/*global require */
var colors  = require('colors');
var express = require('express');
var port = 3000;
express().use(express.static('dist')).listen(port);
console.log(("Server listening on port " + port).black.bgGreen);
