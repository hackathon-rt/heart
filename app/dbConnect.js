const pg = require('pg');

let getConnect = {
    user: 'postgres',
    database: 'heart',
    password: '[frfnjy,fpf2018',
    port: 33123,
    host: "81.177.165.118"
};
exports.pool = new pg.Pool(getConnect);

exports.getConnect = getConnect;

exports.queryDB = function queryDB(query) {
    return new Promise(function (resolve, reject) {
        module.exports.pool.connect((err, client, done) => {
            if (err) {
                console.log('Не удалось выполнить запрос в БД')
            }
            client.query(query, function (err, result) {
                done();
                if (err) {
                    reject(err);
                }
                resolve(result);
            })
        });
    });
};

