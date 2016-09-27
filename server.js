var express = require('express');
var mongodb = require('mongodb');
var http = require("http");
var url = require("url");
var app = express();


var server = http.createServer(function(req, res) {
var currpath = JSON.stringify(url.parse(request.url).path);
var input = decodeURIComponent(currpath.slice(2,currpath.length-1));
res.writeHeader(200, {"Content-Type": "text/html"}); 
  
  res.write(index.html)
  res.end()
})


server.listen(process.env.PORT || 8888)





/*var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.PORT+'/'+process.env.DB;

mongodb.MongoClient.connect(uri, function(err, db) {
  if(err) throw err;
    var shorten = db.collection('shortened');
    shorten.insert({
      _id: 1,
      "page": "http://www.google.hu"
    }, function(err,data) {
      console.log(JSON.stringify(data))
    })
    db.close();
}) */
