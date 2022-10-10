import bodyParser from 'body-parser';
import express from 'express';
import { versionRoute } from './routers/version-route';
import config from 'config';

const app = express();
const port = config.get('port');
app.use(versionRoute);

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Program is running on port: ${port}`);
});
