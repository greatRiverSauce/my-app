/**
 * Created by Christine on 2018/1/24.
 */
var express = require('express'),
    app = express(),
    mongoClient = require('mongodb').MongoClient;

var port = process.env.PORT || 3000;
var connectionUrl = 'mongodb://gao:gaoxinhe@ds113358.mlab.com:13358/gao';
var mongodb_obj = '';
mongoClient.connect(connectionUrl, function(err, client) {
    if (!err) {
        console.log(mongodb_obj);
        mongodb_obj = client;
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



//mongodb://<dbuser>:<dbpassword>@ds113358.mlab.com:13358/gao