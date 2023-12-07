import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import chalk from 'chalk';
import bootstrap from './src/index.router.js'
const app = express();
const port = 5000;


app.use(`/uploads`, express.static("./uploads"))
bootstrap(app, express)
//For getting time for Coupon


app.listen(port, () => console.log(chalk.blue(`Example app listening on port`) + chalk.blackBright(`${port}!`)))