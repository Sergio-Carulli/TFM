const fs = require('fs');
const yaml = require('js-yaml');

//Read yaml file
var fileContents = fs.readFileSync('./data.yaml', 'utf8');
var data = yaml.loadAll(fileContents);
var content = [];
var ontology = "";

//Read metadata
var metadata = data[0];

//ontology
if(metadata["ontology"] == undefined || metadata["ontology"] == null){
    console.log("ontology is undefined");
}
else{
    ontology = metadata["ontology"];
}

//license
if(metadata["license"] == undefined || metadata["license"] == null){
    console.log("License is undefined");
}
else{
    content.push(`<${ontology}> dcterms:license <${metadata["license"]}> .`);
}

//creator
if(metadata["creator"] == undefined || metadata["creator"] == null){
    console.log("creator is undefined");
}
else{
    content.push(`<${ontology}> dcterms:creator "${metadata["creator"].replace(/,/g,'","')}" .`);
}

//contributor
if(metadata["contributor"] == undefined || metadata["contributor"] == null){
    console.log("contributor is undefined");
}
else{
    content.push(`<${ontology}> dcterms:contributor "${metadata["contributor"].replace(/,/g,'","')}" .`);
}

//prefix
if(metadata["prefix"] == undefined || metadata["prefix"] == null){
    console.log("prefix is undefined");
}
else{
    content.push(`<${ontology}> vann:preferredNamespacePrefix "${metadata["prefix"]}" .`);
}

//title
if(metadata["title"] == undefined || metadata["title"] == null){
    console.log("title is undefined");
}
else{
    content.push(`<${ontology}> dcterms:title "${metadata["license"]}" .`);
}

//description
if(metadata["description"] == undefined || metadata["description"] == null){
    console.log("description is undefined");
}
else{
    content.push(`<${ontology}> dcterms:description "${metadata["description"]}" .`);
}

//citation
if(metadata["citation"] == undefined || metadata["citation"] == null){
    console.log("citation is undefined");
}
else{
    content.push(`<${ontology}> dcterms:bibliographicCitation "${metadata["citation"]}" .`);
}

//version
if(metadata["version"] == undefined || metadata["version"] == null){
    console.log("version is undefined");
}
else{
    content.push(`<${ontology}> owl:versionInfo "${metadata["version"]}" .`);
    content.push(`<${ontology}> owl:versionIRI <${ontology}/${metadata["version"]}> .`);
}

//abstract
if(metadata["abstract"] == undefined || metadata["abstract"] == null){
    console.log("abstract is undefined");
}
else{
    content.push(`<${ontology}> dcterms:abstract <${metadata["abstract"]}> .`);
}

//see also
if(metadata["see also"] == undefined || metadata["see also"] == null){
    console.log("see also is undefined");
}
else{
    content.push(`<${ontology}> rdfs:seeAlso <${metadata["see also"]}> .`);
}

//status
if(metadata["status"] == undefined || metadata["status"] == null){
    console.log("status is undefined");
}
else{
    content.push(`<${ontology}> sw:status <${metadata["status"]}> .`);
}

//backward compatibility
if(metadata["backward compatibility"] == undefined || metadata["backward compatibility"] == null){
    console.log("backward compatibility is undefined");
}
else{
    content.push(`<${ontology}> owl:backwardCompatibility <${metadata["backward compatibility"]}> .`);
}

//incompatibility
if(metadata["incompatibility"] == undefined || metadata["incompatibility"] == null){
    console.log("incompatibility is undefined");
}
else{
    content.push(`<${ontology}> owl:incompatibleWith <${metadata["incompatibility"]}> .`);
}

//modification date
if(metadata["modification date"] == undefined || metadata["modification date"] == null){
    console.log("modification date is undefined");
}
else{
    content.push(`<${ontology}> dcterms:modified <${metadata["modification date"]}> .`);
}

//issued date
if(metadata["issued date"] == undefined || metadata["issued date"] == null){
    console.log("issued date is undefined");
}
else{
    content.push(`<${ontology}> dcterms:issued <${metadata["issued date"]}> .`);
}

//source
if(metadata["source"] == undefined || metadata["source"] == null){
    console.log("source is undefined");
}
else{
    content.push(`<${ontology}> dcterms:source <${metadata["source"]}> .`);
}

//publisher
if(metadata["publisher"] == undefined || metadata["publisher"] == null){
    console.log("publisher is undefined");
}
else{
    content.push(`<${ontology}> dcterms:published <${metadata["publisher"]}> .`);
}

//DOI
if(metadata["DOI"] == undefined || metadata["DOI"] == null){
    console.log("DOI is undefined");
}
else{
    content.push(`<${ontology}> bibo:doi <${metadata["DOI"]}> .`);
}

//logo
if(metadata["logo"] == undefined || metadata["logo"] == null){
    console.log("logo is undefined");
}
else{
    content.push(`<${ontology}> foaf:logo <${metadata["logo"]}> .`);
}

//diagram
if(metadata["diagram"] == undefined || metadata["diagram"] == null){
    console.log("diagram is undefined");
}
else{
    content.push(`<${ontology}> foaf:depiction <${metadata["diagram"]}> .`);
}

console.log(content);

