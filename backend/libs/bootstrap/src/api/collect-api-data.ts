import * as crypto from 'crypto';

import {
  Injectable,
  Logger,
  OnModuleInit,
  RequestMethod,
} from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { ApiEndpoint } from '@app/base-system/lib/bounded-contexts/api-endpoint/api-endpoint/domain/api-endpoint.model';

import { API_ENDPOINT } from '@lib/constants/event-emitter-token.constant';
import {
  FUNCTION,
  METHOD,
  PATH,
  SWAGGER_API_OPERATION,
} from '@lib/constants/rest.constant';
import { Permission, PERMISSIONS_METADATA } from '@lib/infra/casbin';
import { isMainCluster } from '@lib/utils/env';

@Injectable()
export class ApiDataService implements OnModuleInit {
  constructor(
    private readonly modulesContainer: ModulesContainer,
    private readonly reflector: Reflector,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger(ApiDataService.name);

  onModuleInit() {
    if (isMainCluster) {
      const endpoints: ApiEndpoint[] = [];
      this.modulesContainer.forEach((module: Module) => {
        const controllers = Array.from(module.controllers.values());
        controllers.forEach((controller) =>
          this.processController(controller, endpoints),
        );
      });

      setImmediate(() => {
        this.eventEmitter.emit(API_ENDPOINT, endpoints);
      });
    }
  }

  // 处理单个控制器
  private processController(
    controller: InstanceWrapper<object>,
    endpoints: ApiEndpoint[],
  ) {
    const instance: Record<string, any> = controller.instance;
    if (!instance) return;

    const prototype = Object.getPrototypeOf(instance);
    const controllerName = controller.metatype.name;
    const controllerPath = Reflect.getMetadata(PATH, controller.metatype) || '';

    Object.getOwnPropertyNames(prototype)
      .filter((method) => typeof instance[method] === FUNCTION)
      .forEach((method) =>
        this.processMethod(
          method,
          instance,
          controllerPath,
          controllerName,
          endpoints,
        ),
      );
  }

  // 处理控制器中的每个方法
  private processMethod(
    method: string,
    instance: Record<string, any>,
    controllerPath: string,
    controllerName: string,
    endpoints: ApiEndpoint[],
  ) {
    const methodPath = Reflect.getMetadata(PATH, instance[method]) || '';
    const methodType = Reflect.getMetadata(METHOD, instance[method]);
    if (methodType === undefined) return;

    const permissions: Permission[] = this.reflector.get(
      PERMISSIONS_METADATA,
      instance[method],
    ) || [{ action: '', resource: '' }];
    const cleanedPath = (controllerPath + (methodPath ? '/' + methodPath : ''))
      .replace(/\/+/g, '/')
      .replace(/\/$/, '');
    const summary =
      Reflect.getMetadata(SWAGGER_API_OPERATION, instance[method])?.summary ||
      '';

    this.createEndpoints(
      permissions,
      cleanedPath,
      methodType,
      controllerName,
      summary,
      endpoints,
    );
  }

  // 创建 API 端点
  private createEndpoints(
    permissions: Permission[],
    cleanedPath: string,
    methodType: any,
    controllerName: string,
    summary: string,
    endpoints: ApiEndpoint[],
  ) {
    permissions.forEach((permission) => {
      const action = permission.action;
      const resource = permission.resource;
      const id = crypto
        .createHash('md5')
        .update(
          JSON.stringify({
            action,
            resource,
            path: cleanedPath,
            method: RequestMethod[methodType],
          }),
        )
        .digest('hex');

      endpoints.push(
        new ApiEndpoint(
          id,
          cleanedPath,
          RequestMethod[methodType],
          action,
          resource,
          controllerName,
          summary,
        ),
      );
    });
  }
}
