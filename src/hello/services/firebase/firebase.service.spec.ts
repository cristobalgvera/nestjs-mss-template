import { FirebaseService } from '@core/firebase';
import { createMock } from '@golevelup/ts-jest';
import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './firebase.service';

describe('MessageService', () => {
  let messageService: MessageService;
  let firebaseService: FirebaseService;
  let loggerService: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageService, FirebaseService, Logger],
    })
      .overrideProvider(FirebaseService)
      .useValue(createMock<FirebaseService>())
      .overrideProvider(Logger)
      .useValue(createMock<Logger>())
      .compile();
    firebaseService = module.get(FirebaseService);
    messageService = module.get(MessageService);
    loggerService = module.get(Logger);
  });

  describe('getFirebaseCollections', () => {
    let firestoreMock: { [p: string]: jest.Mock<any, any> };
    let firebaseServiceSpy: jest.SpyInstance;
    beforeEach(() => {
      firestoreMock = {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValueOnce({
          data: () => ({}),
        }),
      };
      firebaseServiceSpy = jest
        .spyOn(firebaseService, 'getAdmin')
        .mockReturnValueOnce({ firestore: () => firestoreMock } as any);
    });
    describe('success', () => {
      it('should return the right response', async () => {
        const expected = { id: 'id' } as any;
        const collection = 'collection';
        const expectedKey = 'key';
        firestoreMock.doc
          .mockReset()
          .mockImplementationOnce(function (key: string) {
            if (expectedKey === key) {
              return this;
            }
          });
        firestoreMock.get.mockReset().mockResolvedValueOnce({
          data: () => expected,
        });
        const actual = await messageService.getFirebaseCollections(
          collection,
          expectedKey,
        );
        expect(actual).toEqual(expected);
      });

      it('should call firebaseService once', async () => {
        await messageService.getFirebaseCollections('', '');
        expect(firebaseServiceSpy).toHaveBeenCalledTimes(1);
      });
    });
    describe('failure', () => {
      it('should return an error when object if data is undefined', async () => {
        expect.assertions(1);
        firestoreMock.get.mockReset().mockResolvedValueOnce({
          data: () => undefined,
        });
        try {
          await messageService.getFirebaseCollections('', '');
        } catch (actual) {
          expect(actual).toBeInstanceOf(NotFoundException);
        }
      });
      it('should log an error', async () => {
        const expected = {} as never;
        const loggerSpy = jest.spyOn(loggerService, 'error');
        jest.spyOn(firebaseService, 'getAdmin').mockRejectedValueOnce(expected);
        try {
          await messageService.getFirebaseCollections('collection', 'key');
        } catch (e) {
          expect(loggerSpy).toHaveBeenCalled();
        }
      });
    });
    it('should throw an error when method fails', async () => {
      const expected = new Error('message');
      firestoreMock.collection.mockReset().mockImplementationOnce(() => {
        throw expected;
      });
      try {
        await messageService.getFirebaseCollections('collection', 'key');
      } catch (actual) {
        expect(actual.message).toEqual(expected.message);
        expect(actual).toBeInstanceOf(InternalServerErrorException);
      }
    });
  });
});
