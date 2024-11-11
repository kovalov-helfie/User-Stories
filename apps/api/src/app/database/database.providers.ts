import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { Claim } from '../claims/claim.entity';
import { Identity } from '../identities/identity.entity';
import { Asset } from '../assets/asset.entity';
import { Obligation } from '../obligations/obligation.entity';
import { env } from '../../env';
import { TokenClaim } from '../token-claims/token-claim.entity';
import { TokenIdentity } from '../token-identities/token-identity.entity';
import { TokenComplianceRequest } from '../token-compliance/token-compliance-request.entity';
import { DvdTransfer } from '../dvd-transfers/dvd-transfer.entity';
import { UserAsset } from '../user-assets/user-asset.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: env.DB_HOST,
        port: env.DB_PORT,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
      });
      sequelize.addModels([
        User,
        Claim,
        Identity,
        Asset,
        UserAsset,
        Obligation,
        TokenClaim, 
        TokenIdentity, 
        TokenComplianceRequest, 
        DvdTransfer,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];