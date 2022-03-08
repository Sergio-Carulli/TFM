const fs = require('fs');
const $rdf = require('rdflib');

var store = $rdf.graph();
var ontologyPath = '../pruebaCrearRepo/ontology/prueba.ttl';
var fileContents = fs.readFileSync(ontologyPath, 'utf8');
    
var uri = 'https://example.org/resource.ttl';
try {
    $rdf.parse(fileContents, store, uri, 'text/turtle');
} catch (err) {
    console.log(err);
}

store.removeMatches($rdf.sym('http://www.studyroomsmadrid.es/studyRoom/ontology/studyOnt'), undefined, undefined);

console.log(store.toNT());