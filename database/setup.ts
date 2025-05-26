import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import { dbConn } from '../config/postgres-db';
// const sequelize = new Sequelize({
//   database: 'link-sharing-app',
//   username: 'admin',
//   password: 'qwerty',
//   host: 'localhost',
//   port: 5432,
//   dialect: 'postgres',
//   models: [path.dirname(__dirname) + '/models'],
//   logging: false,
// });


const sequelize = new Sequelize(
    `${dbConn}`,
    {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Required for Neon or some managed PG services
        },
      },
      models: [path.resolve(__dirname, '../models')],
      logging: false,
    }
  );

sequelize.sync( { alter: true});
// sequelize.sync();

try {
    const start = async () =>{
        await sequelize.authenticate();
        console.info("Connected")
    }

    start();
} catch (error) {
    console.info('unable to connect', error)
}

export { sequelize };