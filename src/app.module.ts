import { EnvironmentModule } from '@core/environment';

import { Logger, Module } from '@nestjs/common';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [EnvironmentModule, HelloModule],
  providers: [Logger],
})
export class AppModule {}
