const fs = require('fs');
const createOntology2 = require('./createOntology2');
const updateOntology = require('./updateOntology');

//Check the input
//example of valid input:
//node index.js --create ./data.yaml
//node index.js --update ./updateOntology.yaml
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
if(mode == "--create"){
  createOntology2.createOntology(templatePath);
}
else if(mode == "--update"){
  updateOntology.updateOntology(templatePath);
}
else{
  console.log(`The argument ${mode} is not recognize`);
  console.log("Valid arguments are: --create or --update");
  process.exit(-1);
}

  