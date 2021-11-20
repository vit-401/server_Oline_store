import {Sequelize} from "sequelize";
import dotenv from "dotenv";

dotenv.config()

export default new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,

    {
        dialect: "postgres",
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }
)

// import {Sequelize} from "sequelize";
//
// export default new Sequelize(
//     "online_store",
//     "postgres",
//     "virus809696",
//     {
//         dialect: "postgres",
//         host: "localhost",
//         port: "5432"
//     }
// )