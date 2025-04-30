import express, {Express} from 'express';
import router from './routes/route';
import dotenv from 'dotenv';
import connectToDb from './DB/connectToDb';
import logger from './utils/logger';
import chalk from 'chalk';

const app: Express = express();
const PORT = process.env.PORT || 3001;
dotenv.config();


connectToDb();
// Middleware to parse incoming JSON data from client (like from frontend)
app.use(express.json());

// Middleware to parse URL-encoded data (like from HTML form submissions)
// extended: true allows parsing of nested objects
app.use(express.urlencoded({extended: true}));
app.use(router)

app.listen(PORT, () => {
    logger.info(chalk.magenta(`Identity service is running on port ${PORT}`));
});