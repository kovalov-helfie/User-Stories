import { Module } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { UserClaimModule } from './users/user-claim.module';
import { AssetModule } from './assets/asset.module';

@Module({
  imports: [DatabaseModule, UserClaimModule, AssetModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
