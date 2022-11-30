import { Client } from '@elastic/elasticsearch';
import { StarlinkSyncConnector } from '../connectors/starlink-sync-connector';
import { Consts } from '../consts';
import { Starlink } from '../contracts/starlink';

export class ElasticSearchInitialActionService {
  private client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  async createIndexAndMigrateDataIfNeeded() {
    const doesIndexExists = await this.doesStarlinkIndexExist();

    if (!doesIndexExists) {
      await this.createIndex();
      const starlinks = await StarlinkSyncConnector.getStarlinksToSync(0);
      console.log(starlinks);
      await this.populateStarlinkIndex(starlinks);
    }
  }

  private async createIndex() {
    await this.client.indices.create({
      index: Consts.ELASTICSEARCH_INDEX_NAME,
      mappings: {
        properties: {
          id: { type: 'integer' },
          deleted_at: { type: 'date' },
          xmin: { type: 'integer' },
          value: { type: 'object' }
        }
      }
    });
  }

  private async populateStarlinkIndex(starlinks: Starlink[]) {
    await this.client.bulk({
      refresh: true,
      index: Consts.ELASTICSEARCH_INDEX_NAME,
      operations: starlinks.flatMap((starlink) => [
        {
          index: { _index: Consts.ELASTICSEARCH_INDEX_NAME, _id: starlink.id }
        },
        starlink
      ])
    });
  }

  private async doesStarlinkIndexExist(): Promise<boolean> {
    return await this.client.indices.exists({
      index: Consts.ELASTICSEARCH_INDEX_NAME
    });
  }
}
