import { ApiProperty } from '@nestjs/swagger';

export type TokensEssentialProperties = Readonly<
  Required<{
    accessToken: string;
    refreshToken: string;
    status: string;
    userId: string;
    username: string;
    domain: string;
    ip: string;
    address: string;
    userAgent: string;
    requestId: string;
    type: string;
    createdBy: string;
  }>
>;

export type TokensOptionalProperties = Readonly<
  Partial<{
    port: number | null;
  }>
>;

export type TokensProperties = TokensEssentialProperties &
  TokensOptionalProperties;

export class TokensReadModel {
  accessToken: string;

  refreshToken: string;

  status: string;

  userId: string;

  @ApiProperty({ description: 'Username associated with the login event' })
  username: string;

  @ApiProperty({ description: 'Domain where the login occurred' })
  domain: string;

  @ApiProperty({
    description: 'Time when the login occurred',
    type: 'string',
    format: 'date-time',
  })
  loginTime: Date;

  @ApiProperty({ description: 'IP address from which the login was attempted' })
  ip: string;

  @ApiProperty({
    description: 'Port number used for the login attempt',
    nullable: true,
  })
  port: number | null;

  @ApiProperty({
    description: 'Physical or virtual address where the login occurred',
  })
  address: string;

  @ApiProperty({ description: 'User agent of the device used for logging in' })
  userAgent: string;

  @ApiProperty({ description: 'Request ID associated with the login event' })
  requestId: string;

  @ApiProperty({ description: 'Type of login event (e.g., success, failure)' })
  type: string;

  @ApiProperty({
    description: 'Date and time when the log was created',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  createdBy: string;
}
