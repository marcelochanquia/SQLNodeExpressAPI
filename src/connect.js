var sql = require('mssql');
var connect = function()
{
  var conn = new sql.ConnectionPool({
    user : 'sa',
    password: 'onehanded2015',
    server: 'localhost',
    database: 'req',
    options: {
              encrypt: true
            }
  });

    return conn;

};
module.exports = connect;
