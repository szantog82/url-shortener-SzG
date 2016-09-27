var express = require('express');
var mongodb = require('mongodb');
var opn = require('opn');
var http = require("http");
var url = require("url");
var app = express();
var fs = require("fs");
var output; //if output happens, JSON output will be in this variable
var uri = 'mongodb://' + process.env.USER + ':' + process.env.PASS + '@' +
    process.env.HOST + ':' + process.env.MONGOPORT + '/' + process.env.DB;
var entryid;
var entrypage;
var shortened = "https://urlshortener-szg.herokuapp.com/";
var existingid = []; //for checking the existing id-s
var repeat; //for checking the existing id-s


var server = http.createServer(function(req, res) {
    var currpath = JSON.stringify(url.parse(req.url).path);
    var input = decodeURIComponent(currpath.slice(2, currpath.length -
        1));

      if (currpath.length < 4) {
        fs.readFile('./index.html', function(err, html) {
            if (err) {
                throw err;
            }
            res.writeHeader(200, {
                "Content-Type": "text/html"
            });
            res.write(html);
            res.end();
        })
      
    } else if (/[0-9]/.test(input)) {                           //when number (shortened url) is supplied
        res.writeHeader(200, {
            "Content-Type": "text/html"
        });
        entryid = parseInt(input);
        mongodb.MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var shorten = db.collection('shortened');
            shorten.find({
                _id: entryid
            }).toArray(function(err, data) {
                if (JSON.stringify(data).length < 3) {            //The number does not exist
                  res.write("This shortened url does not yet exist");
                  res.end();
                  db.close();
                        }
                else {                                            //The number already exists
                entrypage = JSON.stringify(data[0].page);
              opn('http://www.google.com', function(){
                
                res.end();
              db.close();
              });
              
              }
        });
        });
        
        
    } else if (/^new\/\?http:\/\//.test(input) || /^new\/\?https:\/\//.test(input)) { //when address is supplied
        existingid = [];                                                              //to reset this variable
        entrypage = input.slice(5, input.length);
        mongodb.MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var shorten = db.collection('shortened');
            shorten.find({
                page: entrypage
            }).toArray(function(err, data) {
                if (JSON.stringify(data).length < 3) {              //when address is supplied, and it does not exist in the db
                    
                    shorten.find().forEach(function(myDoc){
                    existingid.push(myDoc["_id"])
                    })
                    
                    do{ repeat = false;
                        entryid = Math.floor(Math.random() * 1000);
                        for (var i = 0; i < entryid.length; i++) {
                        if (entryid === existingid[i]) repeat = true;
                        }
                    } while (repeat);
                    
                    shorten.insert({
                        "_id": entryid,
                        "page": entrypage
                    });
                    output = {
                        "original_url": entrypage,
                        "shortened_url": (shortened + entryid)
                    };
                    res.write(JSON.stringify(output));
                    res.end();
                    db.close();

                } else {                                          //when address is supplied, and it exists in the db
                    entryid = JSON.stringify(data[0]._id);
                    output = {
                        "original_url": entrypage,
                        "shortened_url": (shortened +
                            entryid)
                    };
                    res.write(JSON.stringify(output));
                    res.end();
                    db.close();
                }
            })
        })

    } else {                                                      //when input is not correct
        res.write("Bad format or not existing id. Try again!")
        res.end()
    }
})


server.listen(process.env.PORT || 8080)
