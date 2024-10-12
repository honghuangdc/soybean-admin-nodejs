import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

import { UpdateAuditInfo } from '@lib/shared/prisma/db.constant';
import {
  CreationAuditInfoProperties,
  UpdateAuditInfoProperties,
} from '@lib/typings/global';

export type DomainEssentialProperties = Readonly<
  Required<{
    id: string;
    code: string;
    name: string;
    description: string | null;
    status: Status;
  }>
>;

export type DomainProperties = DomainEssentialProperties;

export type DomainCreateProperties = DomainProperties &
  CreationAuditInfoProperties;

export type DomainUpdateProperties = DomainProperties &
  UpdateAuditInfoProperties;

export class DomainReadModel extends UpdateAuditInfo {
  @ApiProperty({ description: 'The unique identifier of the casbin domain' })
  id: string;

  @ApiProperty({ description: 'Code of the casbin domain' })
  code: string;

  @ApiProperty({ description: 'Name of the casbin domain' })
  name: string;

  @ApiProperty({
    description: 'Description of the casbin domain',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Current status of the casbin domain',
    enum: Object.values(Status),
  })
  status: Status;
}
