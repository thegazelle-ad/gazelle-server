import http from 'http';

//Update these for relevant website
const client_id = "ghost-admin";
const client_secret = "7a3facc8e9fb";
const host = "localhost";
const port = 2368;

export function ghostArticleQuery(params) {
	return new Promise((resolve, reject) => {
		http.get({
			host: host,
			port: port,
			path: "/ghost/api/v0.1/posts/?client_id="+client_id+"&client_secret="+client_secret+(params ? "&" + params : "")
		}, function(response) {
			let body = ''
			response.on('data', function(data) {
				body += data;
			});
			response.on('end', function() {
				body = JSON.parse(body);
				resolve(body);
			});
		});
	});
}