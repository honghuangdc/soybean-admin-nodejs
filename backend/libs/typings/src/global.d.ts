export interface IAuthentication {
  uid: string;
  username: string;
  domain: string;
}

export interface ApiResponse<T = any> {
  code: number;
  message: string;
  // timestamp: string;
  // requestId: string;
  // path: string;
  error?: {
    code: number;
    message: string;
  };
  data?: T;
}

export type CreationAuditInfoProperties = Readonly<{
  createdAt: Date;
  createdBy: string;
}>;

export type UpdateAuditInfoProperties = Readonly<{
  updatedAt: Date | null;
  updatedBy: string | null;
}>;
