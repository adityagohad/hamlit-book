const express = require('express');
const cors = require('cors')

var fs = require('fs');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'books';

const app = express();

app.use(express.static('public'));
app.use(cors())

const initDB = function (callback) {
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        callback(db, client);
    });
}

const findDocuments = function (db, docId, callback) {
    const collection = db.collection('books');
    collection.find({ id: docId }).toArray(function (err, docs) {
        assert.equal(err, null);
        collection.updateOne({ id: docId }, { $set: { money_raised: docs[0].money_raised + 0.01 } }, function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
        });
        callback(docs);
    });
};

const findMoneyRaised = function(db, callback){
    const collection = db.collection('money');
    collection.find({}).toArray(function (err, docs){
        assert.equal(err, null);
        collection.updateOne({ id: 1 }, { $set: { money_raised: docs[0].money_raised + 0.01 } }, function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            callback(docs);
        });
    });
}

app.get('/', function (req, res) {
    res.end()
});

app.get('/getBook', function (req, res) {
    var i = Math.floor(Math.random() * 50) + 1;
    initDB(function (db, client) {
        findDocuments(db, i, function (data) {
            findMoneyRaised(db, function(moneyData){
                data[0].money_raised = moneyData[0].money_raised;
                res.end(JSON.stringify(data[0]));
                client.close()
            })
        })
    })
});

app.listen(3000, '0.0.0.0');