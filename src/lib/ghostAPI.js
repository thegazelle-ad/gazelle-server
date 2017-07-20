import http from 'http';
import ghostConfig from 'lib/../../config/ghost.config';

export function ghostArticleQuery(params) {
  return new Promise((resolve) => {
    http.get({
      host: ghostConfig.host,
      port: ghostConfig.port,
      path: `/ghost/api/v0.1/posts/?clientId=${ghostConfig.clientId}&clientSecret=
        ${ghostConfig.clientSecret} + (${params} ? & ${params} : '')`,
    }, (response) => {
      let body = '';
      response.on('data', (data) => {
        body += data;
      });
      response.on('end', () => {
        body = JSON.parse(body);
        resolve(body);
      });
    }).on('error', (e) => {
      throw e;
    });
  });
}
