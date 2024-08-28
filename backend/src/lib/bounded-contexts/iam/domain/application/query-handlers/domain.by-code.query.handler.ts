import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { DomainReadRepoPortToken } from '../../constants';
import { DomainProperties } from '../../domain/domain.read.model';
import { DomainReadRepoPort } from '../../ports/domain.read.repo-port';
import { FindDomainByCodeQuery } from '../../queries/domain.by-code.query';

@QueryHandler(FindDomainByCodeQuery)
export class FindDomainByCodeQueryHandler
  implements IQueryHandler<FindDomainByCodeQuery, DomainProperties | null>
{
  @Inject(DomainReadRepoPortToken)
  private readonly repository: DomainReadRepoPort;

  async execute(
    query: FindDomainByCodeQuery,
  ): Promise<DomainProperties | null> {
    return this.repository.getDomainByCode(query.code);
  }
}
