const fs = require('fs');

var inputFile = "pruebaMetadata.txt";
var outputFile = "pruebaEscribirMetadata.ttl";
var archivo = fs.readFileSync(inputFile,"utf-8");
var lines = archivo.split('\n');
var content = [];
var aux;
var ontology = "http://www.studyroomsmadrid.es/studyRoom/ontology/studyOnt";

for(line = 0; line<lines.length;line++){
    //Skip blank lines and comments
    if(lines[line] == '\r' | lines[line].startsWith("#")){
        continue;
    }
    //Recommend fields which are filled using the template
    //Add license
    if(lines[line].startsWith("License")){
        aux = lines[line].replace(/\s+/g, "").split("=",2);
        //If the format is correct, add the license
        if(aux.length == 2){
            content.push(`<${ontology}> dcterms:license <${aux[1]}> .`);
        }
    }
    //Add creators
    else if(lines[line].startsWith("Creator")){
        aux = lines[line].replace(/\s+/g, "").split("=",2);
        //If the format is correct, add the creators
        if(aux.length == 2){
            content.push(`<${ontology}> dcterms:creator "${aux[1].replace(/,/g,'" , "')}" .`);
        }
    }
    //Add contributor
    else if(lines[line].startsWith("Contributor")){
        aux = lines[line].replace(/\s+/g, "").split("=",2);
        //If the format is correct, add the contributor
        if(aux.length == 2){
            content.push(`<${ontology}> dcterms:contributor "${aux[1].replace(/,/g,'" , "')}" .`);
        }
    }
    //Add prefix
    else if(lines[line].startsWith("Prefix")){
        aux = lines[line].replace(/\s+/g, "").split("=",2);
        //If the format is correct, add the Prefix
        if(aux.length == 2){
            content.push(`<${ontology}> vann:preferredNamespacePrefix "${aux[1]}" .`);
        }
    }
    //Add title
    else if(lines[line].startsWith("Title")){
        aux = lines[line].replace(/\s+/g, "").split("=",2);
        //If the format is correct, add the title
        if(aux.length == 2){
            content.push(`<${ontology}> dcterms:title "${aux[1]}"@en .`);
        }
    }
    //Add description
    else if(lines[line].startsWith("Description")){
        aux = lines[line].replace(/\s+/g, "").split("=",2);
        //If the format is correct, add the description
        if(aux.length == 2){
            content.push(`<${ontology}> dcterms:description "${aux[1]}"@en .`);
        }
    }
    //Add citation
    else if(lines[line].startsWith("Citation")){
        aux = lines[line].replace(/\s+/g, "").split("=",2);
        //If the format is correct, add the citation
        if(aux.length == 2){
            content.push(`<${ontology}> dcterms:bibliographicCitation "${aux[1]}" .`);
        }
    }
    //Add version
    else if(lines[line].startsWith("Version")){
        aux = lines[line].replace(/\s+/g, "").split("=",2);
        //If the format is correct, add the version
        if(aux.length == 2){
            content.push(`<${ontology}> owl:versionInfo "${aux[1]}" .`);
            content.push(`<${ontology}> owl:versionIRI <${ontology}/${aux[1]}> .`);
        }
    }
    /* OPTIONALS
    else if(lines[line].startsWith("Abstract")){
        content.push(`<${ontology}> dcterms:abstract .`);
    }
    else if(lines[line].startsWith("See also")){
        content.push(`<${ontology}> rdfs:seeAlso .`);
    }
    else if(lines[line].startsWith("Status")){
        content.push(`<${ontology}> sw:status .`);
    }
    else if(lines[line].startsWith("Backward compatibility ")){
        content.push(`<${ontology}> owl:backwardCompatibility  .`);
    }
    else if(lines[line].startsWith("Incompatibility")){
        content.push(`<${ontology}> owl:incompatibleWith .`);
    }
    else if(lines[line].startsWith("Modification Date")){
        content.push(`<${ontology}> dcterms:modified .`);
    }
    else if(lines[line].startsWith("Issued date")){
        content.push(`<${ontology}> dcterms:issued .`);
    }
    else if(lines[line].startsWith("Source")){
        content.push(`<${ontology}> dcterms:source .`);
    }
    else if(lines[line].startsWith("Publisher")){
        content.push(`<${ontology}> dcterms:published .`);
    }
    else if(lines[line].startsWith("DOI")){
        content.push(`<${ontology}> bibo:doi .`);
    }
    else if(lines[line].startsWith("Logo")){
        content.push(`<${ontology}> foaf:logo .`);
    }
    else if(lines[line].startsWith("Diagram")){
        content.push(`<${ontology}> foaf:depiction .`);
    }
    */
}
//Mandatory fields which are filled automatically
var actualDate = new Date();
content.push(`<${ontology}> dcterms:created "${actualDate.getFullYear()}-${actualDate.getMonth()+1}-${actualDate.getDate()}" .`);
content.push(`<${ontology}> owl:priorVersion "" .`);
//Namespace URI
content.push(`<${ontology}> vann:preferredNamespaceUri <${ontology}> .`);

var texto = content.join("\n");
console.log(texto);

fs.writeFile(outputFile, texto, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('ok.');
    }
  });