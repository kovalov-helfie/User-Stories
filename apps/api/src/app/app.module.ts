import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { UserModule } from './users/user.module';
import { ClaimModule } from './claims/claim.module';

@Module({
  imports: [DatabaseModule, UserModule, ClaimModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
