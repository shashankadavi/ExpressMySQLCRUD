var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var port = 5000;
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'letmein',
  database: 'customer_schema'
});

//middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded

connection.connect();



// routing
app.get('/', function (req, res) {
    res.send('doing stuff');
});

app.get('/customers', function (req, res) {
    connection.query('Select * from Customer',function (err, rows) {
        res.send(rows);
    });
});

app.post('/customer', function (req, res) {
  //  var id = req.body.id
    var name = req.body.name;
    var age = req.body.age;

    var values = [ name, age]

    console.log(name + " "+ age);
    connection.query('INSERT INTO Customer (Name, Age) VALUES (?,?) ', values, function (err, row) {
        if (!err) {
            res.send('creating customer row');
        } else {
            res.send('error1');
        }
    });

});

app.get('/customer/:id', function (req, res) {
    var id = req.params.id;
    connection.query('SELECT * FROM Customer WHERE id = ? ', id, function (err, row) {
        if (row && row.length > 0) {
            res.send(row[0]);
        } else {
            throw new Error("unable to find customer");
        }
    });
});

app.put('/customer/:id', function (req, res) {
    var Id = req.params.id;
    var name = req.body.name;
    var age = req.body.age;



    connection.query('UPDATE Customer SET Name = ?, Age= ? WHERE id = ? ', [name, age, Id], function (err, row) {
        if (!err) {
            res.send('updating customer row');
        } else {
          res.send('cannot update');
        }

    });
});

app.delete('/customer/:id', function (req, res) {
    var id = req.params.id;
    connection.query('DELETE FROM Customer WHERE id = ?', id, function (err, row) {
        if (!err) {
            res.send('deleting customer row');
        } else {
            res.send('error1');
        }
    });
});

app.listen(port);
console.log('rest happens on port ' + port);
