import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import { dbConn } from '../config/postgres-db';

const baseConfig = {
    database: process.env.DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: 5432,
    dialect: 'postgres',
    models: [path.dirname(__dirname) + '/models'],
    logging: false,
}

const sequelizeConfig: any = { ...baseConfig };

if (process.env.NODE_ENV === 'production') {
  sequelizeConfig.dialectOptions = {
    ssl: {
      require: true, // Enforce SSL connection
      rejectUnauthorized: true, 
    }
  };
}

const sequelize = new Sequelize(sequelizeConfig);

// const sequelize = new Sequelize(
//     `${dbConn}`,
//     {
//       dialect: 'postgres',
//       dialectOptions: {
//         ssl: {
//           require: true,
//           rejectUnauthorized: false, // Required for Neon or some managed PG services
//         },
//       },
//       models: [path.resolve(__dirname, '../models')],
//       logging: false,
//     }
//   );

// sequelize.sync( { alter: true});
sequelize.sync();

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