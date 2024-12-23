import { Inject, OnModuleInit } from '@nestjs/common';

import {
  ComplexApiKeyServiceToken,
  SimpleApiKeyServiceToken,
} from '@lib/infra/guard/api-key/api-key.constants';
import { IApiKeyService } from '@lib/infra/guard/api-key/services/api-key.interface';

import { AccessKeyReadRepoPortToken } from '../../constants';
import { AccessKeyReadRepoPort } from '../../ports/access_key.read.repo-port';

export class AccessBootstrapQueryHandler implements OnModuleInit {
  constructor(
    @Inject(AccessKeyReadRepoPortToken)
    private readonly repository: AccessKeyReadRepoPort,
    @Inject(SimpleApiKeyServiceToken)
    private readonly simpleApiKeyService: IApiKeyService,
    @Inject(ComplexApiKeyServiceToken)
    private readonly complexApiKeyService: IApiKeyService,
  ) {}

  async onModuleInit() {
    const allKeys = await this.repository.findAll();

    console.log('allKeys', JSON.stringify(allKeys));

    await Promise.all(
      allKeys.flatMap((key) => [
        this.complexApiKeyService.addKey(key.AccessKeyID, key.AccessKeySecret),
        this.simpleApiKeyService.addKey(key.AccessKeyID),
      ]),
    );
  }
}
