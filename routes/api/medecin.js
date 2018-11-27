var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

//body parser
var jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false});


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "naossistant"
});

//con.connect();
var router = express.Router();

router.get('/', function (req, res, next) {
    con.query("SELECT * FROM medecin", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.send(result);
    });
});

router.get('/search/:name', function (req, res, next) {
    con.query("SELECT * FROM medecin WHERE med_name = ?", req.params.name, function (err, result) {
        if (err) throw err;
        //console.log(result.length);
        if (typeof result === 'undefined' || result === null || result.length === 0) {
            res.send({code: "404", error: "Ce medecin n'existe pas"})
        } else {
            res.send(result);
        }
    })
});

router.post('/add', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var salle = req.body.salle;
    var med_name = req.body.med_name;
    var sql = 'INSERT INTO medecin (med_name, salle) VALUE (?, ?)';
    con.query(sql, [med_name, salle], function (err, result) {
        if (err) throw err;
        //console.log('OK');
        res.redirect("/medecin");
    });
});

router.get('/del/:id', function (req, res) {
    //console.log(req.body);
    var sql = 'DELETE FROM medecin WHERE id = ?';
    con.query(sql, req.params.id, function (err, result) {
        if (err) throw err;
        //console.log('OK');
        res.redirect("/medecin");
    });
});

router.post('/update/:id', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var salle = req.body.salle;
    var sql = 'UPDATE medecin SET salle = ? WHERE id = ?';
    con.query(sql, [salle, req.params.id], function (err, result) {
        if (err) throw err;
        //console.log('OK');
        //res.send("OK")
        res.redirect("/medecin");
    });
});

module.exports = router;
//con.end();