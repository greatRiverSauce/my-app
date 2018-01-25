/**
 * Created by Christine on 2018/1/24.
 */
var express = require('express'),
    app = express();

var port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("server running @ localhost:3000");
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})