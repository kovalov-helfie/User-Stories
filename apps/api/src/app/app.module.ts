import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { UserClaimModule } from './users/user-claim.module';

@Module({
  imports: [DatabaseModule, UserClaimModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
