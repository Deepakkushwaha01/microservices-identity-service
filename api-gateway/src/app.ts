import express from "express";
import dotenv from 'dotenv';
import logger from "./logs/logger";
import chalk from "chalk";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors"
import helmet from "helmet"
import { limiter } from "./middlewares/express/expressHandler";
import { identityServiceProxy } from "./middlewares/proxy/proxyOptions";

dotenv.config()

const app = express();

const PORT = process.env.PORT

if(!PORT) {
    process.exit(1)
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())
app.use(helmet())


app.use(limiter)
app.use('/v1/auth', identityServiceProxy)


app.use(errorHandler)


app.listen(PORT, () => {
    logger.info(chalk.magenta(`Identity service is running on port ${PORT}`))

  })
