import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { DomainReadRepoPortToken } from '../../constants';
import { DomainProperties } from '../../domain/domain-read.model';
import { DomainReadRepoPort } from '../../ports/domain.read.repo-port';
import { GetDomainByCodeQuery } from '../../queries/domain.by-id.query';

@QueryHandler(GetDomainByCodeQuery)
export class GetDomainByIdQueryHandler
  implements IQueryHandler<GetDomainByCodeQuery, DomainProperties | null>
{
  @Inject(DomainReadRepoPortToken)
  private readonly repository: DomainReadRepoPort;

  async execute(query: GetDomainByCodeQuery): Promise<DomainProperties | null> {
    return this.repository.getDomainById(query.code);
  }
}
