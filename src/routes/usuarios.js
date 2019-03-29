var express = require('express');
var router = express.Router();
var sql = require('mssql');
var conn = require('E:/mevn-curso/src/connect')();

//Select

router.get('/',(req,res) => {
  conn.connect().then(function()
    {
      var sqlQuery = 'select idusuario,nombreusuario,claveusuario from usuarios';
      var req = new sql.Request(conn);
      req.query(sqlQuery).then(function(recordset)
      {
        res.json(recordset.recordset);
        conn.close();
      })
      .catch(function(err)
      {
          conn.close();
          res.status(400).send('error mientras buscaba los datos');
      });
    })
    .catch(function(err)
    {
        conn.close();
        res.status(400).send('error mientras conectaba la db');
    });
});

//Insert

router.post('/',(req,res) => {
  conn.connect().then(function(){
      var transaction = new sql.Transaction(conn);
      transaction.begin().then(function(){
        var request = new sql.Request(transaction);

          request.input('nombreusuario',sql.VarChar(200),req.body.nombreusuario)
          request.input('claveusuario',sql.VarChar(50),req.body.claveusuario)
          request.execute('sp_UsuariosGuarda').then(function(){
              transaction.commit().then(function(recordset){
                    conn.close();
                    res.status(200).send(req.body);
              }).catch(function(err)
              {
                  conn.close();
                  res.status(400).send('error1 mientras insertaba en la db');
              });
          }).catch(function(err)
          {
              conn.close();
              res.status(400).send('error2 mientras insertaba en la db');
          });
      }).catch(function(err)
      {
          conn.close();
          res.status(400).send('error3 mientras insertaba en la db');
      });
  }).catch(function(err)
  {
      conn.close();
      res.status(400).send('error4 mientras conectaba la db');
  });
});

//updated

router.put('/:id',(req,res) => {
    var _IdUsuario = req.params.id;
    conn.connect().then(function(){
        var transaction = new sql.Transaction(conn);
        transaction.begin().then(function () {
            var request = new sql.Request(transaction);
            request.input("idusuario", sql.Int, _IdUsuario)
            request.input("nombreusuario", sql.VarChar(200), req.body.nombreusuario)
            request.input("claveusuario", sql.VarChar(50), req.body.claveusuario)
            request.execute("sp_UsuariosModifica").then(function () {
                transaction.commit().then(function (recordSet) {
                    conn.close();
                    res.status(200).send(req.body);
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error1 while updating data");});
            }).catch(function (err) {
                conn.close();
                res.status(400).send("Error2 while updating data");});
        }).catch(function (err) {
            conn.close();
            res.status(400).send("Error3 while updating data");});
    }).catch(function (err) {
            conn.close();
            res.status(400).send("Error4 while updating data");});

});

//Delete
router.delete('/:id',(req,res) => {
        var _IdUsuario = req.params.id;
        conn.connect().then(function () {
          var transaction = new sql.Transaction(conn);
          transaction.begin().then(function () {
              var request = new sql.Request(transaction);
                  request.input("IdUsuario", sql.Int, _IdUsuario)
                  request.execute("sp_UsuariosElimina").then(function () {
                  transaction.commit().then(function (recordSet) {
                              conn.close();
                                res.status(200).json("IdUsuario:" + _IdUsuario);
                            }).catch(function (err) {
                                conn.close();
                                res.status(400).send("Error1 while Deleting data");
                            });
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error2 while Deleting data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error3 while Deleting data");
                    });
            })
  });


module.exports = router;
