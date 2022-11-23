import fs from 'fs';
import createOntology from './functionalities/Bootstrapping.js';
import updateOntology from './functionalities/versioning.js';
import shapeValidation from './functionalities/shapeValidation.js';
import dependencyManagement from './functionalities/dependencyManagement.js';

import child_process from 'child_process'
const { exec } = child_process;

//Check the input
//example of valid input:
//node index.js --bootstrapping ./templates/bootstrapping.yaml
//node index.js --versioning ./templates/versioning.yaml
//node index.js --shapeValidation ../../../../pruebaOrdenadorTorre4/Current/Ontology/ontology.ttl
//node index.js --dependencyManagement ../../../../pruebaInconsistencias/ontologyConInconsistencias.ttl
//   ../../../../pruebaOrdenadorTorre3/Current/Ontology/prueba.txt
//node index.js --dependencyManagement ../../../../pruebaOrdenadorTorre4/Current/Ontology/ontology.ttl
//node pitfalls.js ../../../../pruebaOrdenadorTorre4/Current/Ontology/ontology.ttl
//node pitfalls.js ../../../../pruebaPitfalls/ontologySinInconsistencias.ttl
//node pitfalls.js ../../../../pruebaPitfalls/swc_2009-05-09.owl
//node pitfalls.js ../../../../pruebaPitfalls/P41.ttl

if(process.argv.length != 4){
    console.log("The number of arguments is incorrect");
    console.log("The number of arguments must be 4");
    console.log('Execution terminated');
    process.exit(-1);
}

var templatePath = process.argv[3];
var mode = process.argv[2];
if(!fs.existsSync(templatePath)){
    console.log(`The file ${templatePath} does not exist`);
    console.log('Execution terminated');
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
  console.log("Valid arguments are: --bootstrapping, --versioning, --shapeValidation  or --dependencyManagement");
  console.log('Execution terminated');
  process.exit(-1);
}

  