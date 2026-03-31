import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { argv } from "node:process";
import migrationCommand from "./database/migration-config";
import seederCommand from "./database/seeder/seeder-command";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import ConfigService from "./config/config.service";
import { ResponseTransformInterceptor } from "./common/interceptors/response-transform.interceptor";
import { DatabaseExceptionFilter } from "./common/filters/database-exception.filter";
import multipart from "@fastify/multipart";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      trustProxy: true,
    }),
  );

  const configService = app.get(ConfigService);
  const appConfig = configService.app();
  const multipartConfig = configService.multipart();

  await app.register(multipart, {
    limits: {
      fieldNameSize: multipartConfig.fieldNameSize,
      fieldSize: multipartConfig.fieldSize,
      fields: multipartConfig.fields,
      fileSize: multipartConfig.fileSize,
      files: multipartConfig.files,
    },
  });

  app.enableCors({
    origin: appConfig.corsOrigin,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalFilters(new DatabaseExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle("STK Backend API")
    .setDescription("API documentation for STK Application")
    .setVersion("1.0")
    .addBearerAuth()
    .addTag("Authentication")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, documentFactory);

  await app.listen(appConfig.port, "0.0.0.0");
}

function main() {
  if (argv.includes("database")) {
    void migrationCommand().finally(() => {
      process.exit();
    });
    return;
  }

  if (argv.includes("seeder")) {
    void seederCommand().finally(() => {
      process.exit();
    });
    return;
  }

  void bootstrap();
}

main();
