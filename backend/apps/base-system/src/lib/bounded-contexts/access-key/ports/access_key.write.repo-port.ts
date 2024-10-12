import { AccessKey } from '../domain/access_key.model';

export interface AccessKeyWriteRepoPort {
  deleteById(id: string): Promise<void>;
  save(accessKey: AccessKey): Promise<void>;
}
