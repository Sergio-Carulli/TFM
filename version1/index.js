const fs = require('fs');
const createOntology = require('./createOntology');

//Check the input
//example of valid input:
//node index.js "templatePath"
if(process.argv.length != 4){
    console.log("The number of arguments is incorrect");
    process.exit(-1);
}
var templatePath = process.argv[2];
if (!fs.existsSync(templatePath)) {
    console.log(`The file ${templatePath} does not exist`);
    process.exit(-1);
  }

var outputPath = process.argv[3];
createOntology.createOntology(templatePath,outputPath);  