import { Module } from '@nestjs/common';

import { AccessKeyInfraModule } from '@app/base-system/infra/bounded-contexts/access-key/access_key.infra.module';
import { ApiEndpointInfraModule } from '@app/base-system/infra/bounded-contexts/api-endpoint/api-endpoint/api-endpoint.infra.module';
import { IamModule } from '@app/base-system/infra/bounded-contexts/iam/authentication/iam.module';
import { DomainInfraModule } from '@app/base-system/infra/bounded-contexts/iam/domain/domain-infra.module';
import { MenuInfraModule } from '@app/base-system/infra/bounded-contexts/iam/menu/menu.infra.module';
import { RoleInfraModule } from '@app/base-system/infra/bounded-contexts/iam/role/role.infra.module';
import { TokensInfraModule } from '@app/base-system/infra/bounded-contexts/iam/tokens/tokens.infra.module';
import { LoginLogInfraModule } from '@app/base-system/infra/bounded-contexts/log-audit/login-log/login-log.infra.module';
import { OperationLogInfraModule } from '@app/base-system/infra/bounded-contexts/log-audit/operation-log/operation-log.infra.module';

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
