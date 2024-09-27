import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/user.entity';
import { Claim } from '../claims/claim.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        //env
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'admin',
        database: 'test',
      });
      sequelize.addModels([User,Claim]);
      await sequelize.sync();
      return sequelize;
    },
  },
];