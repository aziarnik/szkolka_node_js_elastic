import config from 'config';

export class Configuration {
  static readonly PORT: number = config.get('port');
  static readonly ELASTICSEARCH_USER: string = config.get('elasticSearch.user');
  static readonly ELASTICSEARCH_URL: string = config.get('elasticSearch.url');
  static readonly ELASTICSEARCH_PASSWORD: string = config.get(
    'elasticSearch.password'
  );
  static readonly API_URL: string = config.get('apiUrl');
}
