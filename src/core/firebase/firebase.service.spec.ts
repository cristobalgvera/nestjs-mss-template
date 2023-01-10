import { Environment, EnvironmentService } from '@core/environment';
import { createMock } from '@golevelup/ts-jest';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as adminFirebase from 'firebase-admin';
import { FirebaseService } from './firebase.service';

jest.mock('firebase-admin', () => ({
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
}));

describe('FirebaseService', () => {
  let firebaseService: FirebaseService;
  let environmentService: EnvironmentService;
  let loggerService: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvironmentService, FirebaseService, Logger],
    })
      .overrideProvider(Logger)
      .useValue(createMock<Logger>())
      .overrideProvider(EnvironmentService)
      .useValue(createMock<EnvironmentService>())
      .compile();

    firebaseService = module.get(FirebaseService);
    environmentService = module.get(EnvironmentService);
    loggerService = module.get(Logger);
  });
  describe('getAdmin', () => {
    const environment = {
      FIREBASE_CREDENTIALS: '{"id": "id"}',
    } as Environment;
    beforeEach(() => {
      jest
        .spyOn(environmentService, 'getEnvironmentValue')
        .mockImplementation((key) => environment[key]);
    });
    describe('success', () => {
      it('should get admin', () => {
        const expected = { id: 'id' } as any;
        jest
          .spyOn(adminFirebase, 'initializeApp')
          .mockReturnValueOnce(expected);
        firebaseService.onModuleInit();
        const actual = firebaseService.getAdmin();
        expect(actual).toEqual(expected);
      });
    });
    describe('failure', () => {
      it('should log an error if initializeApp fails', () => {
        expect.assertions(1);
        const loggerSpy = jest.spyOn(loggerService, 'error');
        jest
          .spyOn(adminFirebase, 'initializeApp')
          .mockImplementationOnce(() => {
            throw new Error();
          });
        try {
          firebaseService.onModuleInit();
        } catch (e) {
          expect(loggerSpy).toHaveBeenCalled();
        }
      });
    });
  });
});
