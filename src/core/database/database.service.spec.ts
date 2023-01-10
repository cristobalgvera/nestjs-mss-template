import { EnvironmentService } from '@core/environment/environment.service';
import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseConnection } from './database.service';

describe('DatabaseConnection', () => {
  let databaseConnection: DatabaseConnection;
  let environmentService: EnvironmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvironmentService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(createMock<ConfigService>())
      .compile();

    environmentService = module.get<EnvironmentService>(EnvironmentService);
    databaseConnection = new DatabaseConnection(environmentService);
  });

  describe('createTypeOrmOptions Test', () => {
    it('should return the correct options when isProd is false', () => {
      jest.spyOn(environmentService, 'isProd', 'get').mockReturnValue(false);
      jest.spyOn(environmentService, 'isTest', 'get').mockReturnValue(true);
      jest
        .spyOn(environmentService, 'getEnvironmentValue')
        .mockReturnValue('mockValue');

      const options = databaseConnection.createTypeOrmOptions();
      expect(options).toEqual({
        type: 'mysql',
        host: 'mockValue',
        port: 'mockValue',
        username: 'mockValue',
        password: 'mockValue',
        database: 'mockValue',
        entities: ['src/entities/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
      });
    });
  });

  describe('createTypeOrmOptions Prod', () => {
    it('should return the correct options when isProd is false', () => {
      jest.spyOn(environmentService, 'isProd', 'get').mockReturnValue(true);
      jest.spyOn(environmentService, 'isTest', 'get').mockReturnValue(false);
      jest
        .spyOn(environmentService, 'getEnvironmentValue')
        .mockReturnValue('mockValue');

      const options = databaseConnection.createTypeOrmOptions();
      expect(options).toEqual({
        type: 'mysql',
        host: 'mockValue',
        port: 'mockValue',
        username: 'mockValue',
        password: 'mockValue',
        database: 'mockValue',
        entities: ['dist/entities/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
        extra: { socketPath: 'mockValue' },
      });
    });
  });
});
