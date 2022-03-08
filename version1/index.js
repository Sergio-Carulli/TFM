const fs = require('fs');
const createOntology = require('./createOntology');

//Check the input
//example of valid input:
//node index.js "templatePath"
//node index.js ./data.yaml
if(process.argv.length != 3){
    console.log("The number of arguments is incorrect");
    process.exit(-1);
}
var templatePath = process.argv[2];
if (!fs.existsSync(templatePath)) {
    console.log(`The file ${templatePath} does not exist`);
    process.exit(-1);
  }

createOntology.createOntology(templatePath);  