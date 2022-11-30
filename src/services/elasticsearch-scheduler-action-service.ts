import { Client } from '@elastic/elasticsearch';
import { StarlinkSyncConnector } from '../connectors/starlink-sync-connector';
import { Consts } from '../consts';
import { Starlink } from '../contracts/starlink';
import { ElasticSearchQueries } from '../helpers/elasticsearch-queries';

export class ElasticSearchSchedulerActionService {
  private client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  async syncDataIfNeeded() {
    const maxXmin = await ElasticSearchQueries.getMaxXminValue(this.client);
    const starlinksToSync = await StarlinkSyncConnector.getStarlinksToSync(
      maxXmin
    );
    if (starlinksToSync.length > 0) {
      const [starlinksToCreate, starlinksToEdit, starlinksToDelete] =
        await this.splitStarlinksToAddEditAndDeleteGroups(starlinksToSync);

      const starlinksBulkOperations = this.prepareBulkOperationsObject(
        starlinksToCreate,
        starlinksToEdit,
        starlinksToDelete
      );

      await this.syncElasticSearchData(starlinksBulkOperations);
    }
  }

  async getStarlinksToSyncAddAndEditIds(
    starlinksToSync: Starlink[]
  ): Promise<[number[], number[]]> {
    const notDeletedStarlinksToSyncIds = starlinksToSync
      .filter((x) => x.deleted_at === null)
      .map((x) => x.id) as number[];

    const responsesToEditIds =
      (await ElasticSearchQueries.getIdsOfElementsToEdit(
        this.client,
        notDeletedStarlinksToSyncIds
      )) ?? [];
    const responsesToAddIds = notDeletedStarlinksToSyncIds.filter(
      (id) => !responsesToEditIds.includes(id)
    );

    return [responsesToAddIds, responsesToEditIds];
  }

  private async splitStarlinksToAddEditAndDeleteGroups(
    starlinksToSync: Starlink[]
  ): Promise<[Starlink[], Starlink[], Starlink[]]> {
    const [responsesToAddIds, responsesToEditIds] =
      await this.getStarlinksToSyncAddAndEditIds(starlinksToSync);
    const starlinksToDelete = starlinksToSync.filter(
      (x) => x.deleted_at !== null
    );

    const starlinksToEdit = starlinksToSync.filter((starlink) =>
      responsesToEditIds.includes(starlink.id)
    );

    const starlinksToAdd = starlinksToSync.filter((starlink) =>
      responsesToAddIds.includes(starlink.id)
    );

    return [starlinksToAdd, starlinksToEdit, starlinksToDelete];
  }

  private async syncElasticSearchData(bulkOperations: any[]) {
    if (bulkOperations.length > 0) {
      await this.client.bulk({
        refresh: true,
        index: Consts.ELASTICSEARCH_INDEX_NAME,
        operations: bulkOperations
      });
    }
  }

  private prepareBulkOperationsObject(
    starlinksToCreate: Starlink[],
    starlinksToEdit: Starlink[],
    starlinksToDelete: Starlink[]
  ): any[] {
    let starlinksBulkOperations: any[] = [];

    if (starlinksToCreate.length > 0) {
      starlinksBulkOperations = starlinksBulkOperations.concat(
        starlinksToCreate.flatMap((starlink) => [
          {
            index: { _index: Consts.ELASTICSEARCH_INDEX_NAME, _id: starlink.id }
          },
          starlink
        ])
      );
    }

    if (starlinksToEdit.length > 0) {
      starlinksBulkOperations = starlinksBulkOperations.concat(
        starlinksToEdit.flatMap((starlink) => [
          {
            update: {
              _index: Consts.ELASTICSEARCH_INDEX_NAME,
              _id: starlink.id
            }
          },
          { doc: { value: starlink.value, xmin: starlink.xmin } }
        ])
      );
    }

    if (starlinksToDelete.length > 0) {
      starlinksBulkOperations = starlinksBulkOperations.concat(
        starlinksToDelete.flatMap((starlink) => [
          {
            update: {
              _index: Consts.ELASTICSEARCH_INDEX_NAME,
              _id: starlink.id
            }
          },
          { doc: { deleted_at: starlink.deleted_at, xmin: starlink.xmin } }
        ])
      );
    }

    return starlinksBulkOperations;
  }
}
