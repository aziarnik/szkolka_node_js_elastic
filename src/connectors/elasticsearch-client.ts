import { Client } from '@elastic/elasticsearch';
import { Configuration } from '../configuration';

export class ElasticSearchClient {
  static getClient(): Client {
    return new Client({
      node: Configuration.ELASTICSEARCH_URL,
      auth: {
        username: Configuration.ELASTICSEARCH_USER,
        password: Configuration.ELASTICSEARCH_PASSWORD
      }
    });
  }
}
