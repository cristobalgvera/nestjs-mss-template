import { EnvironmentService } from '@core/environment';
import {
  Injectable,
  OnModuleInit,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import * as adminFirebase from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  constructor(
    private readonly environmentService: EnvironmentService,
    private readonly logger: Logger,
  ) {}

  private admin: adminFirebase.app.App;

  onModuleInit() {
    const firebaseCredentials = JSON.parse(
      this.environmentService.getEnvironmentValue('FIREBASE_CREDENTIALS'),
    );
    try {
      this.admin = adminFirebase.initializeApp({
        credential: adminFirebase.credential.cert(firebaseCredentials),
      });
    } catch (error) {
      this.logger.error(
        `[${FirebaseService.name}: ${this.onModuleInit.name}] ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  getAdmin() {
    return this.admin;
  }
}
