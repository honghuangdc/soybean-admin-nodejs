export class PasswordIdentifierDTO {
  constructor(
    public readonly identifier: string,
    public readonly password: string,
    public readonly ip: string,
    public readonly address: string,
    public readonly userAgent: string,
    public readonly requestId: string,
    public readonly type: string,
    public readonly port?: number | null,
  ) {}
}
