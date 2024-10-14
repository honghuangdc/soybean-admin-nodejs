import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import chalk from 'chalk';
import gradient from 'gradient-string';

import { appConfigToken, ConfigKeyPaths, IAppConfig } from '@lib/config';
import { ApiRes } from '@lib/infra/rest/res.response';

import * as packageJson from '../../../../package.json';

export function initDocSwagger(
  app: INestApplication,
  configService: ConfigService<ConfigKeyPaths>,
): void {
  const { docSwaggerEnable, docSwaggerPath, port } =
    configService.get<IAppConfig>(appConfigToken, {
      infer: true,
    });

  if (!docSwaggerEnable) return;

  const documentBuilder = new DocumentBuilder()
    .setTitle('Soybean Admin NestJS Backend API')
    .setDescription(
      'This API serves as the backend service for Soybean Admin, providing a comprehensive set of functionalities for system management and operations.',
    )
    .setVersion(packageJson.version)
    .setTermsOfService('Soybean Terms of Service')
    .setContact(
      packageJson.author.name,
      packageJson.author.url,
      packageJson.author.email,
    )
    .setLicense(
      packageJson.license,
      'https://github.com/soybeanjs/soybean-admin-nestjs/blob/main/LICENSE',
    );

  documentBuilder.addSecurity('', {
    description: 'Bearer Authentication',
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  });

  const document = SwaggerModule.createDocument(app, documentBuilder.build(), {
    ignoreGlobalPrefix: false,
    extraModels: [ApiRes],
  });

  SwaggerModule.setup(docSwaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const logger = new Logger('SwaggerModule');
  const message = `Swagger Document running on http://127.0.0.1:${port}/${docSwaggerPath}`;
  fancyLog(message, logger);
}

function fancyLog(message: string, logger: Logger) {
  const rainbow = gradient(
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'indigo',
    'violet',
  );

  const messageLength = message.length;
  const border = '*'.repeat(messageLength + 10);

  const coloredBorder = rainbow(border);

  const styledMessage = chalk.bold(`**** ${rainbow(message)} ****`);

  logger.log(coloredBorder);
  logger.log(styledMessage);
  logger.log(coloredBorder);
}
