import { HelloController } from './hello.controller';
import { MessageService } from './services/firebase/firebase.service';
import { UsersService } from './services/database/database.service';
import { FirebaseService } from '@core/firebase';
import { Logger } from '@nestjs/common';
import { Cashin } from '../entities/cashin/cashin.entity';
import { Repository } from 'typeorm';

describe('HelloController', () => {
  let messageService: MessageService;
  let usersService: UsersService;
  let helloController: HelloController;
  let firebaseService: FirebaseService;
  let logger: Logger;
  const usersRepository = new Repository<Cashin>();

  beforeEach(() => {
    messageService = new MessageService(firebaseService, logger);
    usersService = new UsersService(usersRepository);
    helloController = new HelloController(messageService, usersService);
  });

  describe('get', () => {
    it('debe devolver los datos de firebase y llamar a los servicios', async () => {
      const mockGetFirebaseCollections = jest.fn();
      messageService.getFirebaseCollections = mockGetFirebaseCollections;

      const mockFindAll = jest.fn();
      usersService.findAll = mockFindAll;

      mockGetFirebaseCollections.mockReturnValue(['datos de firebase']);
      mockFindAll.mockReturnValue(['datos de la base de datos']);

      const result = await helloController.get();
      expect(result).toEqual(['datos de firebase']);
      expect(mockGetFirebaseCollections).toHaveBeenCalledWith(
        'users',
        'XAwwuxcYAxeFPwTgvPW5',
      );
      expect(mockFindAll).toHaveBeenCalled();
    });
  });
});
