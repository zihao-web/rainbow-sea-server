import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import ConfigService from '@app/config';
import { DbModule } from '@app/db';
// import { SequelizeModule } from '@nestjs/sequelize';
// const { database } = ConfigService();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ConfigService],
    }),
    DbModule,
    // SequelizeModule.forRoot({
    //   ...database
    // }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
