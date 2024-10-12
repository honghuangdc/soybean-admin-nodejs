import { Module } from '@nestjs/common';

import { AccessKeyInfraModule } from 'apps/base-system/src/infra/bounded-contexts/access-key/access_key.infra.module';
import { ApiEndpointInfraModule } from 'apps/base-system/src/infra/bounded-contexts/api-endpoint/api-endpoint/api-endpoint.infra.module';
import { IamModule } from 'apps/base-system/src/infra/bounded-contexts/iam/authentication/iam.module';
import { DomainInfraModule } from 'apps/base-system/src/infra/bounded-contexts/iam/domain/domain-infra.module';
import { MenuInfraModule } from 'apps/base-system/src/infra/bounded-contexts/iam/menu/menu.infra.module';
import { RoleInfraModule } from 'apps/base-system/src/infra/bounded-contexts/iam/role/role.infra.module';
import { TokensInfraModule } from 'apps/base-system/src/infra/bounded-contexts/iam/tokens/tokens.infra.module';
import { LoginLogInfraModule } from 'apps/base-system/src/infra/bounded-contexts/log-audit/login-log/login-log.infra.module';
import { OperationLogInfraModule } from 'apps/base-system/src/infra/bounded-contexts/log-audit/operation-log/operation-log.infra.module';

import { Controllers as AccessKeyRest } from './access-key/rest';
import { Controllers as EndpointRest } from './endpoint/rest';
import { Controllers as IamRest } from './iam/rest';
import { Controllers as LoginLogRest } from './log-audit/login-log/rest';
import { Controllers as OperationLogRest } from './log-audit/operation-log/rest';

@Module({
  imports: [
    IamModule,
    MenuInfraModule,
    RoleInfraModule,
    DomainInfraModule,
    ApiEndpointInfraModule,
    OperationLogInfraModule,
    LoginLogInfraModule,
    TokensInfraModule,
    AccessKeyInfraModule,
  ],
  controllers: [
    ...IamRest,
    ...EndpointRest,
    ...LoginLogRest,
    ...OperationLogRest,
    ...AccessKeyRest,
  ],
})
export class ApiModule {}
