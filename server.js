var express = require('express');
var mongodb = require('mongodb');
var http = require("http");
var url = require("url");
var app = express();
var fs = require("fs");


var server = http.createServer(function(req, res) {
    var currpath = JSON.stringify(url.parse(req.url).path);
    var input = decodeURIComponent(currpath.slice(2,currpath.length-1));
    if (currpath.length < 4) {
    fs.readFile('./index.html', function (err, html) {
    if (err) {
        throw err; 
    }       
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end();
  })
}
 else if (/[0-9]/.test(input)){   
    res.writeHeader(200, {"Content-Type": "text/html"}); 
  
    res.write("number was searched")
    res.end()
  }
  else if (/^new\/http:\/\//.test(input)){
    res.write("new entry was seacrhed")
    res.end()
  }
  else {
    //res.write("Bad format or not existing id. Try again!")
     res.write(input);
    res.end()
  }
})


server.listen(process.env.PORT || 8080)





/*var uri = 'mongodb://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+':'+process.env.MONGOPORT+'/'+process.env.DB;

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
