const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        populate();
        //console.log(results);
    });

function populate() {
    var dbs = Array()
    for (i = 0; i < results.length; i++) {
        var data = {}
        data['id'] = i + 1;
        data['name'] = results[i]['name'];
        data['description'] = results[i]['description'];
        data['img'] = results[i]['img'];
        data['money_raised'] = 0
        console.log(data)
    }
}