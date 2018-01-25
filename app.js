/**
 * Created by Christine on 2018/1/24.
 */
var express = require('express'),
    app = express(),
    mongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;
var connectionUrl = 'mongodb://gao:gaoxinhe@ds113358.mlab.com:13358/gao';
var db_obj = '';

app.use(express.static('public'));
app.use(bodyParser.json());

mongoClient.connect(connectionUrl, function(err, db) {
    if (!err) {
        //console.log(mongodb_obj);
        db_obj = db;
        app.listen(port, function() {
            console.log("Server running @ localhost:3000");
        })
    }
});
// app.listen(port, function () {
//     console.log("server running @ localhost:3000");
// })

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.get('/getUsers', function(req, res) {
    var db = db_obj.db('gao').collection('marlabs');
    //console.log(db_obj.db('gao').collection('marlabs'));
    db.find({}).toArray(function(err, docs) {
        //console.log(docs);
        res.send(docs);
    })
});



//mongodb://<dbuser>:<dbpassword>@ds113358.mlab.com:13358/gao