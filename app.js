/**
 * Created by Christine on 2018/1/24.
 */
var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log('Server running @localhost:3000');
})

mongoose.connect('mongodb://gao:gaoxinhe@ds113358.mlab.com:13358/gao');
var db = mongoose.connection;
// db.on('error', function() {
//     console.log('Error connection to database');
// })
// db.on('open', function () {
//     console.log('Connection established!!');
// });

//define a schema
var UserSchema = mongoose.Schema({
    'username' :{
        type: String,
        required: true
    },
    'password': {
        type: String,
        required: true
    },
    'firstname': {
        type: String,
        required: true
    },
    'lastname' : {
        type: String,
        required: true
    }
});

//create a model
var User = mongoose.model('users', UserSchema);

//create a document
// var user1 = new User({
//     'username': 'gao',
//     'password': '123',
//     'firstname': 'Xinhe',
//     'lastname' : 'Gao'
// });

// user1.save(function(err) {
//     if (!err) {
//         console.log('document saved successfully!');
//     } else {
//         console.log(err);
//     }
// })
// User.find({}, function (err, doc) {
//     console.log(doc);
// });

// var db_obj = '';

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/getUserByUsername/:username', function (req, res) {
    var username = req.params.username;
    //console.log(username);
    User.find({"username": username}, function(err, doc){
        if (!err) {
            res.send(doc);
        }
    });
});

app.post('/updateUser', function(req, res) {
    var query = {username: req.body.username};
    var newVal = {
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    console.log(query);
    User.update(query, newVal, {multi:true}, function (err, doc) {
        res.send({'flg':'success'});
    })
   //console.log(req.body);
});

app.post('/createUser', function (req, res) {
    var newUser = new User(req.body);
    newUser.save(function (err) {
        if (err) {
            res.send({'msg': 'This username has been used, please change another one'});
        } else {
            res.send({'msg': 'Congratualations! Your account have been successfully created'});
        }
    })

})

app.get('/getUsers', function(req, res) {
    var db = db_obj.db('gao').collection('marlabs');
    //console.log(db_obj.db('gao').collection('marlabs'));
    db.find({}).toArray(function(err, docs) {
        //console.log(docs);
        res.send(docs);
    })
});



