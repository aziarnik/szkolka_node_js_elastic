import bodyParser from 'body-parser';
import express from 'express';
import { versionRoute } from './routers/version-route.js';

const app = express();

app.use(versionRoute);

app.use(bodyParser.json());

app.listen(4000);
