declare namespace Log {
  type LoginLog = Api.Common.CommonRecord<{
    username: string;
    domain: string;
    loginTime: string;
    port: number | null;
    address: string;
    userAgent: string;
    requestId: string;
    type: string;
  }>;

  type LoginLogList = Api.Common.PaginatingQueryRecord<LoginLog>;

  type LoginLogSearchParams = CommonType.RecordNullable<
    Pick<LoginLog, 'username' | 'domain' | 'address' | 'type'> & Api.Common.CommonSearchParams
  >;

  type OperationLog = Api.Common.CommonRecord<{
    userId: string;
    username: string;
    domain: string;
    moduleName: string;
    description: string;
    requestId: string;
    method: string;
    url: string;
    ip: string;
    userAgent: string | null;
    params: any;
    body: any;
    response: any;
    startTime: string;
    endTime: string;
    duration: number;
  }>;

  type OperationLogList = Api.Common.PaginatingQueryRecord<OperationLog>;

  type OperationLogSearchParams = CommonType.RecordNullable<
    Pick<OperationLog, 'username' | 'domain' | 'moduleName' | 'method'> & Api.Common.CommonSearchParams
  >;
}
