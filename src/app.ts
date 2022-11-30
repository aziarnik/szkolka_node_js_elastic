import bodyParser from 'body-parser';
import express from 'express';
import { ElasticSearchClient } from './connectors/elasticsearch-client';
import { ElasticSearchInitialActionService } from './services/elasticsearch-initial-action-service';
import { SyncDataScheduler } from './scheduler/sync-data-scheduler';
import { Configuration } from './configuration';

const app = express();
const port = Configuration.PORT;

app.use(bodyParser.json());

app.listen(port, async () => {
  console.log(`Program is running on port: ${port}`);
  try {
    const elasticSearchService = new ElasticSearchInitialActionService(
      ElasticSearchClient.getClient()
    );
    await elasticSearchService.createIndexAndMigrateDataIfNeeded();
    SyncDataScheduler.scheduleSyncDataProcess();
  } catch (err) {
    console.log(err);
  }
});
