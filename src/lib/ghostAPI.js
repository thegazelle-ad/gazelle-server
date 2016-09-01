import http from 'http';
import { getGhostConfig } from 'lib/utilities';

const config = getGhostConfig();

export function ghostArticleQuery(params) {
	return new Promise((resolve, reject) => {
		http.get({
			host: config.host,
			port: config.port,
			path: "/ghost/api/v0.1/posts/?client_id="+config.client_id+"&client_secret="+config.client_secret+(params ? "&" + params : "")
		}, function(response) {
			let body = ''
			response.on('data', function(data) {
				body += data;
			});
			response.on('end', function() {
				body = JSON.parse(body);
				resolve(body);
			});
		}).on('error', (e) => {
			reject(e);
		});
	});
}
