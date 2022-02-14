const fs = require('fs');

var inputFile = "prueba.txt";
var outputFile = "pruebaEscribir.ttl";
var archivo = fs.readFileSync(inputFile,"utf-8");
var lines = archivo.split('\n');
var content = [];
var aux;

function removeItemsFromArr ( arr, item ) {
  var i = arr.indexOf( item );
  while(i!=-1){
      arr.splice( i, 1 );
      var i = arr.indexOf( item );
  }
}

for(line = 0; line<lines.length;line++){
  if(lines[line] == "#Required Information\r"){
    //console.log("Iniciar Require Information");
    line++;
    while(lines[line] !="#Prefix\r"){
        //console.log(lines[line]);
        if(lines[line].startsWith("ontology")){
          aux = lines[line].split("=",2);
          content.push(`@base <${aux[1].replace(/\s+/g, "")}> .`);
          content.push(`<${aux[1].replace(/\s+/g, "")}> rdf:type owl:Ontology .`);
        }
        line++;
    }
    line--;
  }
  else if(lines[line] == "#Prefix\r"){
    //console.log("Iniciar Prefix");
    line++;
    while(lines[line] !="#Class\r"){
       //console.log(content[line]);
      if(lines[line] != "\r"){
        aux = lines[line].split("=",2);
        content.push(`@prefix ${aux[0].replace(/\s+/g, "")}: <${aux[1].replace(/\s+/g, "")}> .`);
      }
        line++;
    }
    line--;
  }
  else if(lines[line] == "#Class\r"){
    //console.log("Iniciar Class");
    line++;
    while(lines[line] !="#Object Properties\r"){
        //console.log(lines[line]);
        if(lines[line] != "\r"){
          content.push(`${lines[line].replace(/\s+/g, "")} rdf:type owl:Class .`);
        }
        line++;
    }
    line--;
}
  else if(lines[line] == "#Object Properties\r"){
    //console.log("Iniciar Object Properties");
    line++;
    while(lines[line] !="#Data Properties\r"){
        //console.log(lines[line]);
        if(lines[line] != "\r"){
          aux = lines[line].split(" ");
          removeItemsFromArr(aux, '' );
          content.push(`${aux[1]} rdf:type owl:ObjectProperty .`);
          content.push(`${aux[1]} rdfs:domain ${aux[0]} .`);
          content.push(`${aux[1]} rdfs:range ${aux[2].replace(/\s+/g, "")} .`);
        }
        line++;
    }
    line--;
  }
  else if(lines[line] == "#Data Properties\r"){
    //console.log("Iniciar Data Properties");
    line++;
    while(lines[line] != null){
        //console.log(lines[line]);
        if(lines[line] != "\r"){
          aux = lines[line].split(" ");
          removeItemsFromArr(aux, '' );
          content.push(`${aux[1]} rdf:type owl:DatatypeProperty .`);
          content.push(`${aux[1]} rdfs:domain ${aux[0]} .`);
          content.push(`${aux[1]} rdfs:range ${aux[2].replace(/\s+/g, "")} .`);
        }
        line++;
    }
  }
}
var texto = content.join("\n");
console.log(texto);
//fs.writeFileSync(outputFile, texto);
fs.writeFile(outputFile, texto, function (err) {
  if (err) {
      console.log(err);
  } else {
      console.log('ok.');
  }
});


