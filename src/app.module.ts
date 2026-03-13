import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './app/module/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import config from './app/config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    MongooseModule.forRoot(config.mongoUri as string),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
