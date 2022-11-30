import schedule from 'node-schedule';
import { ElasticSearchClient } from '../connectors/elasticsearch-client';
import { ElasticSearchSchedulerActionService } from '../services/elasticsearch-scheduler-action-service';

export class SyncDataScheduler {
  static scheduleSyncDataProcess = () => {
    const syncDataJob = schedule.scheduleJob('* * * * *', async function () {
      try {
        const elasticSearchService = new ElasticSearchSchedulerActionService(
          ElasticSearchClient.getClient()
        );
        await elasticSearchService.syncDataIfNeeded();
      } catch (err) {
        console.log(err);
      }
    });
  };
}
