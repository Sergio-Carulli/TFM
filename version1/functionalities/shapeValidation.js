//const fs = require('fs')
import fs from 'fs'

//const factory = require('rdf-ext')
import factory from 'rdf-ext'

//const ParserN3 = require('@rdfjs/parser-n3')
import ParserN3 from '@rdfjs/parser-n3'

//const SHACLValidator = require('rdf-validate-shacl')
import SHACLValidator from 'rdf-validate-shacl'

var log = [];

async function loadDataset(filePath) {
  const stream = fs.createReadStream(filePath);
  const parser = new ParserN3({ factory });
  return factory.dataset().import(parser.import(stream));
}

export default async function shapeValidation(ontologyPath) {
  var data;
  try{
    data = await loadDataset(ontologyPath);
  } catch(error){
    console.log(`Error reading ontology: ${ontologyPath} is not an ontology or contains errors`);
    console.log(`Error: ${error.message}`);
    console.log('Execution terminated');
    process.exit(-1);
  }
  
  const files = fs.readdirSync('./shapes');
  for (const file of files) {
    try{
      const shapes = await loadDataset(`./shapes/${file}`);
      const validator = new SHACLValidator(shapes, { factory });
      const report = await validator.validate(data);
      // Check conformance: `true` or `false`
      log.push(`${ontologyPath} has passed all the shapes of ${file}: ${report.conforms}`);
      writeValidationReport(file,`./validationReport/${file}`,report.dataset.toCanonical());
    } catch(error){
      console.log(`Error reading shacl file: ${file}`);
      console.log(`Shacl file contains errors. That shapes are not going to be tested`);
      console.log(`Error: ${error.message}`);
    }

/*
    for (const result of report.results) {
      // See https://www.w3.org/TR/shacl/#results-validation-result for details
      // about each property
      console.log(result.message)
      console.log(result.path)
      console.log(result.focusNode)
      console.log(result.severity)
      console.log(result.sourceConstraintComponent)
      console.log(result.sourceShape)
    }
*/
    // Validation report as RDF dataset
    //console.log(report.dataset)
    
  };
  writeLog('./logs/');
}

function writeValidationReport(file,reportPath,result) {
  fs.writeFile(reportPath, result, function (err) {
      if (err) {
          console.log(err);
      } else {
          log.push(`${file} validation report has been created succesfully`);
      }
  });
}

function writeLog(logPath) {
  let now= new Date();
  logPath = `${logPath}shapeValidationLog_${now.getMonth()}-${now.getDate()}-${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.txt`;
  fs.writeFile(`${logPath}`, log.join('\n'), function (err) {
      if (err) {
          console.log(err);
      } else {
          console.log(`The Log file has been created successfully in ${logPath}`);
      }
  });
}

//shapeValidation('../../../../pruebaOrdenadorTorre/Current/Ontology/ontology.ttl');