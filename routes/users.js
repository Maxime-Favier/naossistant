var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "naossistant"
});
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    con.query("SELECT * FROM patients", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render('patients', {out: result});
    });
});

module.exports = router;
