const fs = require('fs');
const { exit } = require('process');
const readline = require('readline');
const handlerFunctions = require("./handlerFunctions");

var inputFile = "prueba.txt";
var outputFile = "pruebaEscribir.txt";

//Check if the file exists
fs.stat(inputFile, function(err) {
    if (err == null) {
      console.log("The file exists");
    } else if (err.code == 'ENOENT') {
      console.log("The file does not exist");
      exit(-1);
    } else {
      console.log(err); //Unknown error happens
      exit(-1);
    }
  })

// Read File line per line
var lines;
fs.readFile('prueba.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  lines = data.split('\n');
  var content = "";
  /*
  console.log(lines[0]);
  console.log(lines[0].length);
  console.log(lines[0].indexOf("#Required Information"));
  console.log(lines[0].localeCompare("#Required Information"));
  console.log(lines[0][21].charCodeAt(0));
  console.log('B'.charCodeAt(0));
  console.log(lines[4]);
  console.log(lines[4].length);
  console.log(lines[4].indexOf("#Prefix"));
  console.log(lines[11]);
  console.log(lines[11].length);
  console.log(lines[11].indexOf("#Class"));
  console.log(lines[15]);
  console.log(lines[15].length);
  console.log(lines[15].indexOf("#Object Properties"));
  console.log(lines[18]);
  console.log(lines[18].length);
  console.log(lines[18].indexOf("#Data Properties"));
  
  console.log(lines[3] == '\r');
  console.log(lines[0] == "#Required Information\r");
  */
  for(line = 0; line<lines.length;line++){
    if(lines[line] == "#Required Information\r"){
      line = handlerFunctions.requiredInformation(lines,line+1);
    }
    else if(lines[line] == "#Prefix\r"){
      line = handlerFunctions.prefix(lines,line+1,content);
    }
    else if(lines[line] == "#Class\r"){
      line = handlerFunctions.class(lines,line+1);
    }
    else if(lines[line] == "#Object Properties\r"){
      line = handlerFunctions.objectProperties(lines,line+1);
    }
    else if(lines[line] == "#Data Properties\r"){
      line = handlerFunctions.dataProperties(lines,line+1);
    }
    console.log(line);
  }
  
})

/*
// Write file line per line
// If outputFile already exists, it will be removed before
var stream = fs.createWriteStream(outputFile);
stream.once('open', function(fd) {
  stream.write("tercera línea\n");
  //stream.write("Segunda línea\n");
  stream.end();
});
*/
