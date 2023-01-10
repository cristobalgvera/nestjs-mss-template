import { FirebaseService } from '@core/firebase';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class MessageService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly logger: Logger,
  ) {}

  public async getFirebaseCollections(
    collection: string,
    key: string,
  ): Promise<FirebaseFirestore.DocumentData> {
    let querySnapshot: FirebaseFirestore.DocumentSnapshot;
    try {
      const db = this.firebaseService.getAdmin().firestore();
      querySnapshot = await db.collection(collection).doc(key).get();
    } catch (error) {
      this.logger.error(
        `[${MessageService.name}: ${this.getFirebaseCollections.name}] ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(error.message);
    }
    if (!querySnapshot.data()) {
      throw new NotFoundException(`Invalid Key: ${key}`);
    }
    const data = querySnapshot.data();
    if (data === undefined) {
      throw new InternalServerErrorException(
        'Error al obtener los datos del documento',
      );
    }
    return data;
  }
}
