export interface Ip2RegionConfig {
  xdbPath: string;
  mode: SearchMode;
}

export enum SearchMode {
  File = 'FILE',
  VectorIndex = 'VECTOR_INDEX',
  Full = 'FULL',
}
