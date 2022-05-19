import Hylar from 'hylar';
import fs from 'fs';
import N3 from 'n3';

const h = new Hylar();

//var ontologyPath = '../../../../pruebaInconsistencias/ontologySinInconsistencias.ttl';
var ontologyPath = '../../../../pruebaInconsistencias/ontologyConInconsistencias.ttl';
dependencyManagement(ontologyPath);

async function dependencyManagement(ontologyPath) {
  var rawOntology = await fs.readFileSync(ontologyPath, 'utf8');
  var mimeType = 'text/turtle';

  // async function
  //Empty ontology
  await h.clean();
  //Set reasoning to incremental
  h.updateReasoningMethod('incremental');
  await h.load(rawOntology, mimeType, false);
  var consistency = await h.checkConsistency();

  console.log(`Ontology is consistent: ${consistency.consistent}`);
  if (!consistency.consistent) {
    console.log(`Explanation of why the ontology is not consistent:`);
    //Explain inconsistency
    prpirp(h);
    prpasyp(h);
    prppdw(h);
    prpnpa1(h);
    prpnpa2(h);
    clsnothing2(h);
    clscom(h);
    clsmaxc1(h);
    clsmaxqc1(h);
    clsmaxqc2(h);
    caxdw(h);
    }

  //Read ontology in N3 format
  var content = await h.getStorage();

  //Write ontology after performing the reasoner
  readOntology(ontologyPath, content).then(writer => writeOntology(ontologyPath, writer));
  //readOntology(ontologyPath, content);
}

//Read prefixes from the ontology and read the ontology storages in the reasoner
async function readOntology(ontologyPath, content) {
  return new Promise((resolve, reject) => {
    var fileContents = fs.readFileSync(ontologyPath, 'utf8');
    var parser = new N3.Parser();
    var parser2 = new N3.Parser();
    var writer = new N3.Writer();
    

    //In order to write in turtle format we need the prefixes of the ontology
    parser.parse(fileContents, (error, quad, prefixes) => {
      if (quad) {
        //Do nothing
      }
      else {
        //Add prefixes
        writer.addPrefixes(prefixes);
      }
    });
    var aux = content.replaceAll(',',''); 
    parser2.parse(aux, (error, quad, prefixes) => {
      if (quad) {
        writer.addQuad(quad)
      }
    });
    setTimeout(() => {
      return resolve(writer);
  }, 1000);
  }); 
}

function writeOntology(ontologyPath, writer) {
  writer.end((error, result) => fs.writeFile(`${ontologyPath}/../ontologyAfterReasoning.ttl`, result, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('The ttl file has been created successfully');
    }
  }));
}

async function prpirp(h) {
  var query = 'SELECT ?x ?p WHERE { ?p <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#IrreflexiveProperty> . ?x ?p ?x .}'
  let result = await h.query(query);
  if (result.length != 0) {
    console.log(`${result[0].p.value} http://www.w3.org/1999/02/22-rdf-syntax-ns#type http://www.w3.org/2002/07/owl#IrreflexiveProperty`);
    console.log(`${result[0].x.value} ${result[0].p.value} ${result[0].x.value}`);
  }
}

async function prpasyp(h) {
  var query = 'SELECT ?x ?p ?y WHERE { ?p <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#AsymmetricProperty> . ?x ?p ?y . ?y ?p ?x .}'
  let result = await h.query(query);
  if (result.length != 0) {
    console.log(`${result[0].p.value} http://www.w3.org/1999/02/22-rdf-syntax-ns#type http://www.w3.org/2002/07/owl#AsymmetricProperty`);
    console.log(`${result[0].x.value} ${result[0].p.value} ${result[0].y.value}`);
    console.log(`${result[0].y.value} ${result[0].p.value} ${result[0].x.value}`);
  }
}

async function prppdw(h) {
  var query = 'SELECT ?p1 ?p2 ?x ?y  WHERE { ?p1 <http://www.w3.org/2002/07/owl#propertyDisjointWith> ?p2 . ?x ?p1 ?y . ?x ?p2 ?y . }'
  let result = await h.query(query);
  if (result.length != 0) {
    console.log(`${result[0].p1.value} http://www.w3.org/2002/07/owl#propertyDisjointWith ${result[0].p2.value}`);
    console.log(`${result[0].x.value} ${result[0].p1.value} ${result[0].y.value}`);
    console.log(`${result[0].x.value} ${result[0].p2.value} ${result[0].y.value}`);
  }
}

async function prpnpa1(h) {
  var query = 'SELECT ?x ?i1 ?p ?i2 WHERE {?x <http://www.w3.org/2002/07/owl#sourceIndividual> ?i1 . ?x <http://www.w3.org/2002/07/owl#assertionProperty> ?p . ?x <http://www.w3.org/2002/07/owl#targetIndividual> ?i2 . ?i1 ?p ?i2 .}'
  let result = await h.query(query);
  if (result.length != 0) {
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#sourceIndividual ${result[0].i1.value}`);
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#assertionProperty ${result[0].p.value}`);
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#targetIndividual ${result[0].i2.value}`);
    console.log(`${result[0].i1.value} ${result[0].p.value} ${result[0].i2.value}`);
  }
}

async function prpnpa2(h) {
  var query = 'SELECT ?x ?i ?p ?lt WHERE { ?x <http://www.w3.org/2002/07/owl#sourceIndividual> ?i . ?x <http://www.w3.org/2002/07/owl#assertionProperty> ?p . ?x <http://www.w3.org/2002/07/owl#targetValue> ?lt . ?i ?p ?lt .}'
  let result = await h.query(query);
  if (result.length != 0) {
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#sourceIndividual ${result[0].i.value}`);
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#assertionProperty ${result[0].p.value}`);
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#targetValue ${result[0].lt.value}`);
    console.log(`${result[0].i.value} ${result[0].p.value} ${result[0].lt.value}`);
  }
}

async function clsnothing2(h) {
  var query = 'SELECT ?x  WHERE { ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2002/07/owl#Nothing> . }'
  let result = await h.query(query);
  if (result.length != 0) {
    console.log(`${result[0].x.value} http://www.w3.org/1999/02/22-rdf-syntax-ns#type http://www.w3.org/2002/07/owl#Nothing`);
  }
}

async function clscom(h) {
  var query = 'SELECT ?c1 ?c2 ?x WHERE {?c1 <http://www.w3.org/2002/07/owl#complementOf> ?c2 . ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?c1 . ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?c2 .}'
  let result = await h.query(query);
  if (result.length != 0) {
    console.log(`${result[0].c1.value} http://www.w3.org/2002/07/owl#complementOf ${result[0].c2.value}`);
    console.log(`${result[0].x.value} http://www.w3.org/1999/02/22-rdf-syntax-ns#type ${result[0].c1.value}`);
    console.log(`${result[0].x.value} http://www.w3.org/1999/02/22-rdf-syntax-ns#type ${result[0].c2.value}`);
  }
}

async function clsmaxc1(h) {
  var query = 'SELECT ?x ?p ?u ?y  WHERE { ?x <http://www.w3.org/2002/07/owl#maxCardinality> "0"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger> . ?x <http://www.w3.org/2002/07/owl#onProperty> ?p . ?u <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?x . ?u ?p ?y .}'
  let result = await h.query(query);
  if (result.length != 0) {
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#maxCardinality "0"^^xsd:nonNegativeInteger`);
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#onProperty ${result[0].p.value}`);
    console.log(`${result[0].u.value} http://www.w3.org/1999/02/22-rdf-syntax-ns#type ${result[0].x.value}`);
    console.log(`${result[0].u.value} ${result[0].p.value} ${result[0].y.value}`);
  }
}

async function clsmaxqc1(h) {
  var query = 'SELECT ?x ?u ?p ?y ?c WHERE { ?x <http://www.w3.org/2002/07/owl#maxQualifiedCardinality> "0"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger> . ?x <http://www.w3.org/2002/07/owl#onProperty> ?p . ?x <http://www.w3.org/2002/07/owl#onClass> ?c . ?u <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?x . ?y <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?c . ?u ?p ?y}'
  let result = await h.query(query);
  if (result.length != 0) {
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#maxQualifiedCardinality "0"^^xsd:nonNegativeInteger`);
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#onProperty ${result[0].p.value}`);
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#onClass ${result[0].c.value}`);
    console.log(`${result[0].u.value} http://www.w3.org/1999/02/22-rdf-syntax-ns#type ${result[0].x.value}`);
    console.log(`${result[0].y.value} http://www.w3.org/1999/02/22-rdf-syntax-ns#type ${result[0].c.value}`);
    console.log(`${result[0].u.value} ${result[0].p.value} ${result[0].y.value}`);
  }
}

async function clsmaxqc2(h) {
  var query = 'SELECT ?x ?u ?p ?y  WHERE { ?x <http://www.w3.org/2002/07/owl#maxQualifiedCardinality> "0"^^<http://www.w3.org/2001/XMLSchema#nonNegativeInteger> . ?x <http://www.w3.org/2002/07/owl#onClass> <http://www.w3.org/2002/07/owl#Thing> . ?x <http://www.w3.org/2002/07/owl#onProperty> ?p . ?u <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?x . ?u ?p ?y}'
  let result = await h.query(query);
  if (result.length != 0) {
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#maxQualifiedCardinality "0"^^xsd:nonNegativeInteger`);
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#onClass http://www.w3.org/2002/07/owl#Thing`);
    console.log(`${result[0].x.value} http://www.w3.org/2002/07/owl#onProperty ${result[0].p.value}`);
    console.log(`${result[0].u.value} http://www.w3.org/1999/02/22-rdf-syntax-ns#type ${result[0].x.value}`);
    console.log(`${result[0].u.value} ${result[0].p.value} ${result[0].y.value}`);
  }
}

async function caxdw(h) {
  var query = 'SELECT ?x ?c1 ?c2 WHERE { ?c1 <http://www.w3.org/2002/07/owl#disjointWith> ?c2 . ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?c1 . ?x <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?c2 . }'
  let result = await h.query(query);
  if (result.length != 0) {
    console.log(`${result[0].c1.value} http://www.w3.org/2002/07/owl#disjointWith ${result[0].c2.value}`);
    console.log(`${result[0].x.value} http://www.w3.org/1999/02/22-rdf-syntax-ns#type ${result[0].c1.value}`);
    console.log(`${result[0].x.value} http://www.w3.org/1999/02/22-rdf-syntax-ns#type ${result[0].c2.value}`);
  }
}
