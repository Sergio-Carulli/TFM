import fs from 'fs';
import createOntology from './Bootstrapping.js';
import updateOntology from './versioning.js';
import shapeValidation from './shapeValidation.js';
import dependencyManagement from './dependencyManagement.js';

import child_process from 'child_process'
const { exec } = child_process;

//Check the input
//example of valid input:
//node index.js --bootstrapping ./templates/data.yaml
//node index.js --versioning ./templates/versioning.yaml
//node index.js --shapeValidation ../../../../pruebaOrdenadorTorre3/Current/Ontology/ontology.ttl
//node index.js --dependencyManagement ../../../../pruebaInconsistencias/ontologyConInconsistencias.ttl
//node index.js --dependencyManagement ../../../../pruebaOrdenadorTorre3/Current/Ontology/ontology.ttl
//node pitfalls.js ../../../../pruebaOrdenadorTorre3/Current/Ontology/ontology.ttl
//node pitfalls.js ../../../../pruebaPitfalls/ontologySinInconsistencias.ttl
if(process.argv.length != 4){
    console.log("The number of arguments is incorrect");
    process.exit(-1);
}

var templatePath = process.argv[3];
var mode = process.argv[2];
if(!fs.existsSync(templatePath)){
    console.log(`The file ${templatePath} does not exist`);
    process.exit(-1);
  }
if(mode == "--bootstrapping"){
  createOntology(templatePath);
}
else if(mode == "--versioning"){
  updateOntology(templatePath);
}
else if(mode == "--shapeValidation"){
  shapeValidation(templatePath);
}
else if(mode == "--dependencyManagement"){
  dependencyManagement(templatePath);
}

else{
  console.log(`The argument ${mode} is not recognize`);
  console.log("Valid arguments are: --create or --update");
  process.exit(-1);
}

  