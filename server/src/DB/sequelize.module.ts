import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host: process.env.SQL_HOST,
      port: Number(process.env.SQL_PORT),
      username: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,

      database: process.env.SQL_DB,
      autoLoadModels: true,
      synchronize: true,
      dialectOptions: {
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
      },
    }),
  ],
  exports: [SequelizeModule],
})
export class AppSequelizeModule {}
