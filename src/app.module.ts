import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule, type Duration } from '@nestjs/authentication';
import { AuthorizationModule } from '@nestjs/authorization';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { RolesModule } from './roles/roles.module.js';
import { AuthModule } from './auth/auth.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com,
    // then run `npx @nestjs/observe link` to write your key pair into .env.
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'parcial',
    }),
    // Lee el archivo .env y deja sus variables disponibles en toda la app
    ConfigModule.forRoot({ isGlobal: true }),
    // Conexión a PostgreSQL (el contenedor de docker-compose.yml)
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true, // registra las entidades de cada forFeature()
        synchronize: true, // crea las tablas a partir de las entidades
      }),
    }),
    // Autenticación con JWT. Con solo importarlo queda activo un guard global:
    // toda ruta pide token, salvo las marcadas con @Public().
    AuthenticationModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        accessToken: {
          key: config.getOrThrow<string>('JWT_SECRET'),
          issuer: 'parcial-api',
          audience: 'parcial-clients',
          ttl: config.getOrThrow<Duration>('JWT_EXPIRES_IN'), // '2m' -> expiresIn: 120
        },
        refreshToken: {
          ttl: config.getOrThrow<Duration>('JWT_REFRESH_EXPIRES_IN'), // '7d'
          absoluteTtl: '30d', // duración máxima de la familia, aunque rote
        },
        allowInMemoryStorage: true, // refresh tokens en memoria (permitido por el enunciado)
      }),
    }),
    // Autorización con policies. Va DESPUÉS de AuthenticationModule porque
    // necesita saber quién es el usuario. Desde aquí, toda ruta necesita
    // @Can(), @Can.Anyone() o @Public(); si no tiene ninguno -> 403.
    AuthorizationModule.forRoot(),
    UsersModule,
    RolesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
