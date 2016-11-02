import http from 'http';
import ghostConfig from 'lib/../../config/ghost.config';

export function ghostArticleQuery(params) {
	return new Promise((resolve) => {
		http.get({
			host: ghostConfig.host,
			port: ghostConfig.port,
			path: "/ghost/api/v0.1/posts/?client_id="+ghostConfig.client_id+"&client_secret="+ghostConfig.client_secret+(params ? "&" + params : ""),
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
			throw e;
		});
	});
}
