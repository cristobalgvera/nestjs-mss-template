import { Module, Logger } from '@nestjs/common';
import { HelloController } from './hello.controller';
import { GetService } from './services/get/get.service';
import { MessageService } from './services/firebase/firebase.service';
import { UsersService } from './services/database/database.service';
import { FirebaseService } from '../core/firebase/firebase.service';
import { EnvironmentModule } from '@core/environment';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnection } from '../core/database/database.service';
import { EnvironmentService } from '@core/environment/environment.service';
import { Cashin } from '../entities/cashin/cashin.entity';

@Module({
  controllers: [HelloController],
  providers: [
    Logger,
    FirebaseService,
    MessageService,
    GetService,
    DatabaseConnection,
    UsersService,
  ],
  imports: [
    EnvironmentModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentModule],
      useClass: DatabaseConnection,
      inject: [EnvironmentService],
    }),
    TypeOrmModule.forFeature([Cashin]),
  ],
})
export class HelloModule {}
