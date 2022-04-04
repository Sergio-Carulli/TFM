const $rdf = require('rdflib');

var store = $rdf.graph();

var FOAF = $rdf.Namespace("http://xmlns.com/foaf/0.1/")

var uri = "https://www.food.com/recipe/327593";
var s = $rdf.sym(uri);


var p = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');



var me = $rdf.sym('https://www.w3.org/People/Berners-Lee/card#i');
var knows = FOAF('knows');
store.add(me, FOAF('knows'), $rdf.sym('https://fred.me/profile#me'));
store.add(me, FOAF('name'), "Albert Bloggs");


var friend = store.any(me, knows)  // Any one person

console.log($rdf.serialize(store,'ttl'));