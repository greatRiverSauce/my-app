/**
 * Created by Christine on 2018/1/24.
 */
var express = require('express'),
    app = express();

app.listen(2000, function () {
    console.log("server running @ localhost:2000");
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})