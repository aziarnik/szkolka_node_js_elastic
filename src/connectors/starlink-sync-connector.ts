import fetch from 'cross-fetch';
import { Configuration } from '../configuration';
import { Starlink } from '../contracts/starlink';

export class StarlinkSyncConnector {
  private static starlinkSyncEndpoint = `${Configuration.API_URL}/starlinks/synchronize`;

  static async getStarlinksToSync(
    maxTransactionIdInElasticSearch: number
  ): Promise<Starlink[]> {
    const response = await fetch(
      `${this.starlinkSyncEndpoint}/${maxTransactionIdInElasticSearch}`,
      {
        method: 'GET'
      }
    );

    return (await response.json()) as Starlink[];
  }
}
