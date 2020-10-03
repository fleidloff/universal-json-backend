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
            // todo: is Promise really necessary here?
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
          db.collection(collection).findOne({ _id: new MongoDb.ObjectId(id) }),
        add: async (collection, item) => {
          await db.collection(collection).insertOne(item);
          return item;
        },
        remove: async (collection, id) => {
          const { acknowledged } = await db
            .collection(collection)
            .deleteOne({ _id: new MongoDb.ObjectId(id) });
          return acknowledged;
        },
        update: async (collection, id, update) => {
          const { acknowledged, ...rest } = await db
            .collection(collection)
            .updateOne({ _id: new MongoDb.ObjectId(id) }, { $set: update }); //todo: use $unset to remove fields for real
          return acknowledged;
        },
        close: () => client.close(),
      });
    });
  });
}

export default bootstrapClient;
