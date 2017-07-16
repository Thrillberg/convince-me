var sinon = require('sinon');
require('babel-register')();
var mount = require('enzyme').mount;
var shallow = require('enzyme').shallow;
var React = require('react');
var Firebase = require('firebase');
var chai = require('chai');

global.expect = chai.expect;
global.sinon = sinon;
global.React = React;
global.shallow = shallow;
global.mount = mount;
global.Firebase = Firebase;

