var express = require('express');
var mongodb = require('mongodb');
var http = require("http");
var url = require("url");
var app = express();
var fs = require("fs");
var output;
var uri = 'mongodb://' + process.env.USER + ':' + process.env.PASS + '@' +
    process.env.HOST + ':' + process.env.MONGOPORT + '/' + process.env.DB;
var entryid;
var entrypage;
var shortened = "http://";

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
        
    } else if (/[0-9]/.test(input)) {
        res.writeHeader(200, {
            "Content-Type": "text/html"
        });
        entryid = parseInt(input);
        mongodb.MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var shorten = db.collection('shortened');
            shorten.find({
                //_id: entryid
                _id: 1
            }).toArray(function(err, data) {
                //output = JSON.stringify(data);
                entrypage = JSON.stringify(data[0].page);
                res.write(entrypage);
                res.end();
            })

            db.close();
        })
        
    } else if (/^new\/\?http:\/\//.test(input) || /^new\/\?https:\/\//.test(input)) {
        entrypage = input.slice(5, input.length);
        mongodb.MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            var shorten = db.collection('shortened');
            shorten.find({
                page: entrypage
            }).toArray(function(err, data) {
                if (JSON.stringify(data).length < 3) {
                    entryid = Math.floor(Math.random() * 1000);
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

                } else {
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


                /*entryid =  parseInt(JSON.stringify(data[0]._id));
                      if (Number.isInteger(entryid)){
                            res.write(entryid.toString());
                            res.end();
                      }
                      else {
                        res.write("nem nyert");
                            res.end();
                      }*/
            })
        })


        /*   entryid = Math.floor(Math.random()*100);
        output = {"original url": entrypage,
                  "short url": entryid
                }
        res.write(JSON.stringify(output));
         res.end()*/
    } else {
        res.write("Bad format or not existing id. Try again!")
        res.end()
    }
})


server.listen(process.env.PORT || 8080)
