import MongoDb from "mongodb";
const { MongoClient } = MongoDb;

import { mongodbUrl, mongodbName } from "../config/config.js";

function bootstrapClient() {
  return new Promise((resolve, reject) => {
    // Use connect method to connect to the server
    MongoClient.connect(mongodbUrl, { useUnifiedTopology: true }, function (
      err,
      client
    ) {
      if (err) {
        return reject(error);
      }
      const db = client.db(mongodbName);

      resolve({
        find: (collection, criteria = {}) =>
          new Promise((resolve, reject) => {
            db.collection(collection)
              .find(criteria)
              .toArray(function (err, docs) {
                if (err) {
                  return reject(err);
                }
                return resolve(docs);
              });
          }),
        findById: (collection, id) =>
          db.collection(collection).findOne({ _id: new MongoDb.ObjectID(id) }),
        close: () => client.close(),
      });
    });
  });
}

export default bootstrapClient;
