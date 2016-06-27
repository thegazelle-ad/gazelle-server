import {MongoClient, ObjectID} from 'mongodb';

var url = 'mongodb://localhost:27017/ghost';

export function sqlArticleQuery(query, projection) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if (err) {
        reject(err);
      }
      resolve(db.collection('posts').find(query, projection).toArray());
    });
  });
};

export function sqlAuthorUpdate(query, update) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, (err, db) => {
      if (err) {
        reject(err);
      }
      db.collection('posts').updateOne(query, update).then((err, results) => {
        if (err) {
          reject(err);
        }
        db.close();
        resolve();
      });
    })
  });
}

export function sqlAuthorQuery(query, projection) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
      if (err) {
        reject(err);
      }
      resolve(db.collection('authors').find(query, projection).toArray());
    });
  });
};
