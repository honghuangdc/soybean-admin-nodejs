// https://github.com/lionsoul2014/ip2region/blob/master/binding/nodejs/index.js
import fs from 'fs';

const VectorIndexSize = 8;
const VectorIndexCols = 256;
const VectorIndexLength = 256 * 256 * (4 + 4);
const SegmentIndexSize = 14;
const IP_REGEX =
  /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;

const getStartEndPtr = Symbol('#getStartEndPtr');
const getBuffer = Symbol('#getBuffer');
const openFilePromise = Symbol('#openFilePromise');

class Searcher {
  private readonly _dbFile: string;
  private readonly _vectorIndex: Buffer | null;
  private readonly _buffer: Buffer | null;

  constructor(
    dbFile: string,
    vectorIndex: Buffer | null,
    buffer: Buffer | null,
  ) {
    this._dbFile = dbFile;
    this._vectorIndex = vectorIndex;
    this._buffer = buffer;

    if (this._buffer) {
      this._vectorIndex = this._buffer.subarray(256, 256 + VectorIndexLength);
    }
  }

  private async [getStartEndPtr](
    idx: number,
    fd: number,
    ioStatus: { ioCount: number },
  ): Promise<{ sPtr: number; ePtr: number }> {
    if (this._vectorIndex) {
      const sPtr = this._vectorIndex.readUInt32LE(idx);
      const ePtr = this._vectorIndex.readUInt32LE(idx + 4);
      return { sPtr, ePtr };
    } else {
      const buf = await this[getBuffer](256 + idx, 8, fd, ioStatus);
      const sPtr = buf.readUInt32LE();
      const ePtr = buf.readUInt32LE(4);
      return { sPtr, ePtr };
    }
  }

  private async [getBuffer](
    offset: number,
    length: number,
    fd: number,
    ioStatus: { ioCount: number },
  ): Promise<Buffer> {
    if (this._buffer) {
      return this._buffer.subarray(offset, offset + length);
    } else {
      const buf = Buffer.alloc(length);
      return new Promise((resolve, reject) => {
        ioStatus.ioCount += 1;
        fs.read(
          fd,
          buf as unknown as NodeJS.ArrayBufferView,
          0,
          length,
          offset,
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(buf);
            }
          },
        );
      });
    }
  }

  private async [openFilePromise](fileName: string): Promise<number> {
    return new Promise((resolve, reject) => {
      fs.open(fileName, 'r', (err, fd) => {
        if (err) {
          reject(err);
        } else {
          resolve(fd);
        }
      });
    });
  }

  public async search(
    ip: string,
  ): Promise<{ region: string | null; ioCount: number; took: number }> {
    const startTime = process.hrtime();
    const ioStatus = {
      ioCount: 0,
    };

    if (!isValidIp(ip)) {
      throw new Error(`IP: ${ip} is invalid`);
    }

    let fd: number = -1;

    if (!this._buffer) {
      fd = await this[openFilePromise](this._dbFile);
    }

    const ps = ip.split('.');
    const i0 = parseInt(ps[0]);
    const i1 = parseInt(ps[1]);
    const i2 = parseInt(ps[2]);
    const i3 = parseInt(ps[3]);

    const ipInt = i0 * 256 * 256 * 256 + i1 * 256 * 256 + i2 * 256 + i3;
    const idx = i0 * VectorIndexCols * VectorIndexSize + i1 * VectorIndexSize;
    const { sPtr, ePtr } = await this[getStartEndPtr](idx, fd, ioStatus);
    let l = 0;
    let h = (ePtr - sPtr) / SegmentIndexSize;
    let result: string | null = null;

    while (l <= h) {
      const m = (l + h) >> 1;

      const p = sPtr + m * SegmentIndexSize;

      const buff = await this[getBuffer](p, SegmentIndexSize, fd, ioStatus);

      const sip = buff.readUInt32LE(0);

      if (ipInt < sip) {
        h = m - 1;
      } else {
        const eip = buff.readUInt32LE(4);
        if (ipInt > eip) {
          l = m + 1;
        } else {
          const dataLen = buff.readUInt16LE(8);
          const dataPtr = buff.readUInt32LE(10);
          const data = await this[getBuffer](dataPtr, dataLen, fd, ioStatus);
          result = data.toString('utf-8');
          break;
        }
      }
    }
    if (fd) {
      fs.close(fd, function () {});
    }

    const diff = process.hrtime(startTime);

    const took = (diff[0] * 1e9 + diff[1]) / 1e3;
    return { region: result, ioCount: ioStatus.ioCount, took };
  }
}

const _checkFile = (dbPath: string): void => {
  try {
    fs.accessSync(dbPath, fs.constants.F_OK);
  } catch (err) {
    throw new Error(`${dbPath} ${err ? 'does not exist' : 'exists'}`);
  }

  try {
    fs.accessSync(dbPath, fs.constants.R_OK);
  } catch (err) {
    throw new Error(`${dbPath} ${err ? 'is not readable' : 'is readable'}`);
  }
};

const isValidIp = (ip: string): boolean => {
  return IP_REGEX.test(ip);
};

const newWithFileOnly = (dbPath: string): Searcher => {
  _checkFile(dbPath);

  return new Searcher(dbPath, null, null);
};

const newWithVectorIndex = (dbPath: string, vectorIndex: Buffer): Searcher => {
  _checkFile(dbPath);

  if (!Buffer.isBuffer(vectorIndex)) {
    throw new Error('vectorIndex is invalid');
  }

  return new Searcher(dbPath, vectorIndex, null);
};

const newWithBuffer = (buffer: Buffer): Searcher => {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error('buffer is invalid');
  }

  return new Searcher('', null, buffer);
};

const loadVectorIndexFromFile = (dbPath: string): Buffer => {
  const fd = fs.openSync(dbPath, 'r');
  const buffer = Buffer.alloc(VectorIndexLength);
  fs.readSync(
    fd,
    buffer as unknown as NodeJS.ArrayBufferView,
    0,
    VectorIndexLength,
    256,
  );
  fs.close(fd, function () {});
  return buffer;
};

const loadContentFromFile = (dbPath: string): Buffer => {
  const stats = fs.statSync(dbPath);
  const buffer = Buffer.alloc(stats.size);
  const fd = fs.openSync(dbPath, 'r');
  fs.readSync(
    fd,
    buffer as unknown as NodeJS.ArrayBufferView,
    0,
    stats.size,
    0,
  );
  fs.close(fd, function () {});
  return buffer;
};

const ip2region = {
  isValidIp,
  loadVectorIndexFromFile,
  loadContentFromFile,
  newWithFileOnly,
  newWithVectorIndex,
  newWithBuffer,
};

export { Searcher };

export default ip2region;
