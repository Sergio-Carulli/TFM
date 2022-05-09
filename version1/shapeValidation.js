//const fs = require('fs')
import fs from 'fs'

//const factory = require('rdf-ext')
import factory from 'rdf-ext'

//const ParserN3 = require('@rdfjs/parser-n3')
import ParserN3 from '@rdfjs/parser-n3'

//const SHACLValidator = require('rdf-validate-shacl')
import SHACLValidator from 'rdf-validate-shacl'

async function loadDataset(filePath) {
  const stream = fs.createReadStream(filePath)
  const parser = new ParserN3({ factory })
  return factory.dataset().import(parser.import(stream))
}

async function main(ontologyPath) {
  const data = await loadDataset(ontologyPath)
  const files = fs.readdirSync('./shapes')
  for (const file of files) {
    const shapes = await loadDataset(`./shapes/${file}`)
    const validator = new SHACLValidator(shapes, { factory })
    const report = await validator.validate(data)

    // Check conformance: `true` or `false`
    console.log(`${file}: ${report.conforms}`)
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
    writeValidationReport(file,`./validationReport/${file}`,report.dataset.toCanonical())
  };
}

function writeValidationReport(file,reportPath,result) {
  fs.writeFile(reportPath, result, function (err) {
      if (err) {
          console.log(err);
      } else {
          console.log(`${file} validation report has been created succesfully`);
      }
  });
}

main('../../../../pruebaOrdenadorTorre/Current/Ontology/ontology.ttl');