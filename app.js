const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = "myproject";

const insertDocuments = function (db, callback) {
  // Get the documents collection
  const collection = db.collection("bar");
  // Insert some documents
  collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }], function (err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    console.log(result);
  });
};

const findDocuments = function (db, criteria, callback) {
  // Get the documents collection
  const collection = db.collection("bar");
  // Find some documents
  collection.find(criteria).toArray(function (err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
  });
};

const updateDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection("documents");
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a: 2 }, { $set: { b: 1 } }, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });
};

const removeDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection("documents");
  // Delete document where a is 3
  collection.deleteOne({ a: 3 }, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });
};

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  insertDocuments(db);
  findDocuments(db, { a: 1 });

  client.close();
});
