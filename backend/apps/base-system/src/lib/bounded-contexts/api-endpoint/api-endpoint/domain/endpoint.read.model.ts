import { ApiProperty } from '@nestjs/swagger';

export type EndpointEssentialProperties = Readonly<
  Required<{
    id: string;
    path: string;
    method: string;
    action: string;
    resource: string;
    controller: string;
    summary: string | null;
    createdAt: Date;
    updatedAt: Date | null;
  }>
>;

export type EndpointProperties = EndpointEssentialProperties;

export type EndpointTreeProperties = EndpointProperties & {
  children?: EndpointTreeProperties[];
};

export class EndpointReadModel {
  @ApiProperty({ description: 'The unique identifier of the API endpoint' })
  id: string;

  @ApiProperty({ description: 'Path of the API endpoint' })
  path: string;

  @ApiProperty({ description: 'HTTP method of the API endpoint' })
  method: string;

  @ApiProperty({ description: 'Action associated with the API endpoint' })
  action: string;

  @ApiProperty({ description: 'Resource targeted by the API endpoint' })
  resource: string;

  @ApiProperty({ description: 'Controller handling the API endpoint' })
  controller: string;

  @ApiProperty({
    description: 'Summary or description of the API endpoint',
    nullable: true,
  })
  summary: string | null;

  @ApiProperty({
    description: 'Creation date of the API endpoint',
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the API endpoint',
    type: 'string',
    format: 'date-time',
    nullable: true,
  })
  updatedAt: Date | null;
}
