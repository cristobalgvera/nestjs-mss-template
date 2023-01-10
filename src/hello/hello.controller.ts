import { Controller, Get } from '@nestjs/common';
import { MessageService } from './services/firebase/firebase.service';
import { UsersService } from './services/database/database.service';

@Controller('hello')
export class HelloController {
  constructor(
    private messageService: MessageService,
    private usersService: UsersService,
  ) {}

  @Get()
  async get() {
    const data = await this.messageService.getFirebaseCollections(
      'users',
      'XAwwuxcYAxeFPwTgvPW5',
    );
    const dataBD = await this.usersService.findAll();
    console.log('BD ->', dataBD);
    return data;
  }
}
