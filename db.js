const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const csv = require('csv-parser')
const fs = require('fs')
const results = [];

const url = 'mongodb://localhost:27017';
const dbName = 'books';


const initDB = function (callback) {
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        callback(db, client);
    });
}

const insertDocuments = function (db, data, callback) {
    const collection = db.collection('books');
    collection.insertMany(data, function (err, result) {
        callback(result);
    });
};

const createMoneyRaised = function(db, data, callback){
    const collection = db.collection('money');
    collection.insertMany(data, function(err, result){
        collback(result)
    });
};

fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        populate();
    });

function populate() {
    var dbs = Array()
    for (i = 0; i < results.length; i++) {
        var data = {}
        data['id'] = i + 1;
        data['name'] = results[i]['name'];
        data['description'] = results[i]['description'];
        data['img'] = results[i]['img'];
        data['cost'] = results[i]['cost'];
        data['target'] = results[i]['target'];
        data['money_raised'] = 0
        dbs.push(data)
    }

    initDB(function (db, client) {
        insertDocuments(db, dbs, function () {
            client.close()
        });
    });

    initDB(function (db, client){     
        var moneydData = {}
        moneydData['id'] = 1
        moneydData['money_raised'] = 0
        var moneyDbs = Array()
        moneyDbs.push(moneydData)
        createMoneyRaised(db, moneydData, function(){
            client.close()
        });
    });
}
