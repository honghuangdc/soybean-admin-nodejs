export class RefreshTokenDTO {
  constructor(
    public readonly refreshToken: string,
    public readonly ip: string,
    public readonly region: string,
    public readonly userAgent: string,
    public readonly requestId: string,
    public readonly type: string,
    public readonly port?: number | null,
  ) {}
}
