/*global require */
var colors  = require('colors');
var express = require('express');
express().use(express.static('dist')).listen(3000);
console.log(" Server listening on port 3000 ".black.bgGreen);