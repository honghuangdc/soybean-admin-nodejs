declare namespace Access {
  /** access-key */
  type AccessKey = Api.Common.CommonRecord<{
    domain: string;
    AccessKeyID: string;
    AccessKeySecret: string;
    description: string | null;
  }>;

  /** access-key list */
  type AccessKeyList = Api.Common.PaginatingQueryRecord<AccessKey>;

  type AccessKeyModel = Pick<AccessKey, 'domain' | 'status' | 'description'>;

  /** access-key search params */
  type AccessKeySearchParams = CommonType.RecordNullable<Pick<AccessKey, 'status'> & Api.Common.CommonSearchParams>;
}
