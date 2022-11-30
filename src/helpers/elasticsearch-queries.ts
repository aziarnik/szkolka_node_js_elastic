import { Client } from '@elastic/elasticsearch';

export class ElasticSearchQueries {
  static async getMaxXminValue(client: Client): Promise<number> {
    const response = await client.sql.query({
      query: 'SELECT MAX(xmin) FROM "starlinks"'
    });

    return response.rows[0] as unknown as number;
  }

  static async getIdsOfElementsToEdit(
    client: Client,
    notDeletedResponsesIds: number[]
  ): Promise<number[]> {
    const idsResponsesFromApi = await client.sql.query({
      query: `SELECT id FROM "starlinks" WHERE id in (${notDeletedResponsesIds.toString()})`
    });

    return (idsResponsesFromApi.rows as unknown[]).flatMap(
      (r) => r
    ) as number[];
  }
}
