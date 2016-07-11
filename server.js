var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');

var app = express(); // Create exppress.js app

app.use(bodyParser.json()); // Use bodyParser to handle json req bodies
app.use(express.static('public')); // Use static to serve static files

// runServer coord both connection to db and running http Server
var runServer = function(callback) {
    // Use mongoose to connect to db using URL from config.js ('var config')
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            // If good connection call call 'callback'
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) { // This trick makes file an executable script and a module
    // If scripts run directly the runServer called / If file 'required' from another file then server started at diff point
    runServer();
};

var Item = require('./models/item');

app.get('/items', function(req, res) {
    // 'Item.find' is what sends a query to the db
    Item.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(items);
    });
});

app.post('/items', function(req, res) {
    Item.create({
        name: req.body.name
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

app.delete('/items/:id', function(req, res) {
    var id = req.params.id;
		Item.findByIdAndRemove(id, function(err) {
      if (err) {
        return res.status(500).json({
            message: 'Internal Server Error'
        });
      }
      res.status(200).json(id);
    });
});

app.put('/items/:id', function(req, res) {
  var id = req.params.id;
  var newName = req.body.name;
  Item.findByIdAndUpdate(id, {name : newName }, function(err, data) {
    if (err) {
      return res.status(500).json({
          message: 'Internal Server Error'
      });
    }
    res.status(200).json({_id:id, name: newName});
  });
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

exports.app = app;
exports.runServer = runServer;
