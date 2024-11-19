import { ApiProperty } from '@nestjs/swagger';

export type OperationLogEssentialProperties = Readonly<
  Required<{
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
    startTime: Date;
    endTime: Date;
    duration: number;
  }>
>;

export type OperationLogProperties = OperationLogEssentialProperties;

export class OperationLogReadModel {
  @ApiProperty({ description: 'The unique identifier of the operation log' })
  id: string;

  @ApiProperty({ description: 'User ID associated with the operation' })
  userId: string;

  @ApiProperty({ description: 'Username associated with the operation' })
  username: string;

  @ApiProperty({ description: 'Domain where the operation occurred' })
  domain: string;

  @ApiProperty({ description: 'Module where the operation occurred' })
  moduleName: string;

  @ApiProperty({ description: 'Description of the operation' })
  description: string;

  @ApiProperty({ description: 'Request ID associated with the operation' })
  requestId: string;

  @ApiProperty({ description: 'HTTP method used in the operation' })
  method: string;

  @ApiProperty({ description: 'URL accessed during the operation' })
  url: string;

  @ApiProperty({
    description: 'IP address from which the operation was initiated',
  })
  ip: string;

  @ApiProperty({
    description: 'User agent of the device used in the operation',
    nullable: true,
  })
  userAgent: string | null;

  @ApiProperty({
    description: 'Parameters used in the operation',
  })
  params: any;

  @ApiProperty({
    description: 'Body of the request used in the operation',
  })
  body: any;

  @ApiProperty({
    description: 'Response returned from the operation',
  })
  response: any;

  @ApiProperty({
    description: 'Start time of the operation',
    type: 'string',
    format: 'date-time',
  })
  startTime: Date;

  @ApiProperty({
    description: 'End time of the operation',
    type: 'string',
    format: 'date-time',
  })
  endTime: Date;

  @ApiProperty({ description: 'Duration of the operation in milliseconds' })
  duration: number;
}
