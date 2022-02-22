const fs = require('fs');
const yaml = require('js-yaml');

var content = [];

function createOntology(templatePath, outputPath){
    var fileContents = fs.readFileSync(templatePath, 'utf8');
    var data = yaml.loadAll(fileContents);
    //Read metadata
    var metadata = data[0];
    createMetadata(metadata);
    //Read prefix
    var prefix = data[1];
    createPrefix(prefix);
    //Read class
    var classes = data[2];
    createClass(classes);
    //Read object properties
    var objectProperties = data[3];
    createObjectProperties(objectProperties);
    //Read data properties
    var dataProperties = data[4]; 
    createDataProperties(dataProperties);
    var texto = content.join("\n");
    fs.writeFile(outputPath,texto , function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('The ttl file has been created successfully');
        }
      });
}

function createMetadata(metadata){
    //ontology
    if(metadata["ontology"] == undefined || metadata["ontology"] == null){
        console.log("ontology is undefined");
        process.exit(-1);
    }
    else{
        ontology = metadata["ontology"];
    }
    content.push("\n# #################################################################\n# #\n# #    Metadata\n# #\n# #################################################################\n");
    content.push(`<${ontology}> a owl:Ontology .`);

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
}

function createPrefix(prefix){
    var names = Object.keys(prefix);
    content.unshift(`@prefix : <${ontology}> .`);
    names.forEach(name => {
        content.unshift(`@prefix ${name}: <${prefix[name]}> .`);
    });
}

function createClass(classes){
    content.push("\n# #################################################################\n# #\n# #    Classes\n# #\n# #################################################################\n");
    var classes_names = Object.keys(classes);
    classes_names.forEach(name => {
        var class_metadata = classes[name];
        content.push(`${name} rdf:type owl:Class .`);
        if(class_metadata != null){
            //class label
            if(class_metadata["label"] == undefined || class_metadata["label"] == null){
                console.log(`${name} has not "label" defined`);
            }
            else{
                content.push(`${name} rdfs:label ${class_metadata["label"]} .`);
            }
            //class comment
            if(class_metadata["definition"] == undefined || class_metadata["definition"] == null){
                console.log(`${name} has not "definition" defined`);
            }
            else{
                content.push(`${name} rdfs:comment ${class_metadata["definition"]} .`);
            }
            //class example
            if(class_metadata["example"] == undefined || class_metadata["example"] == null){
                console.log(`${name} has not "example" defined`);
            }
            else{
                content.push(`${name} vann:example ${class_metadata["example"]} .`);
            }
            //class status
            if(class_metadata["status"] == undefined || class_metadata["status"] == null){
                console.log(`${name} has not "status" defined`);
            }
            else{
                content.push(`${name} sw:term status ${class_metadata["status"]} .`);
            }
            //class rationale
            if(class_metadata["rationale"] == undefined || class_metadata["rationale"] == null){
                console.log(`${name} has not "rationale" defined`);
            }
            else{
                content.push(`${name} vaem:rationale ${class_metadata["rationale"]} .`);
            }
            //class source
            if(class_metadata["source"] == undefined || class_metadata["source"] == null){
                console.log(`${name} has not "source" defined`);
            }
            else{
                content.push(`${name} dcterms:source ${class_metadata["source"]} .`);
            }
        }
        else{
            console.log(`${name} has not metadata defined`);
        }
    });
}

function createObjectProperties(objectProperties){
    var objectProperties_names = Object.keys(objectProperties);
    content.push("\n# #################################################################\n# #\n# #    Object Properties\n# #\n# #################################################################\n");
    objectProperties_names.forEach(name => {
        var class_metadata = objectProperties[name];
        content.push(`${name} rdf:type owl:ObjectProperty .`);
        if(class_metadata != null){
            //object property domain
            if(class_metadata["domain"] == undefined || class_metadata["domain"] == null){
                console.log(`${name} has not "domain" defined`);
            }
            else{
                content.push(`${name} rdfs:domain ${class_metadata["domain"]} .`);
            }
            //object property range
            if(class_metadata["range"] == undefined || class_metadata["range"] == null){
                console.log(`${name} has not "range" defined`);
            }
            else{
                content.push(`${name} rdfs:range ${class_metadata["range"]} .`);
            }
            //object property label
            if(class_metadata["label"] == undefined || class_metadata["label"] == null){
                console.log(`${name} has not "label" defined`);
            }
            else{
                content.push(`${name} rdfs:label ${class_metadata["label"]} .`);
            }
            //object property comment
            if(class_metadata["definition"] == undefined || class_metadata["definition"] == null){
                console.log(`${name} has not "definition" defined`);
            }
            else{
                content.push(`${name} rdfs:comment ${class_metadata["definition"]} .`);
            }
            //object property example
            if(class_metadata["example"] == undefined || class_metadata["example"] == null){
                console.log(`${name} has not "example" defined`);
            }
            else{
                content.push(`${name} vann:example ${class_metadata["example"]} .`);
            }
            //object property status
            if(class_metadata["status"] == undefined || class_metadata["status"] == null){
                console.log(`${name} has not "status" defined`);
            }
            else{
                content.push(`${name} sw:term status ${class_metadata["status"]} .`);
            }
            //object property rationale
            if(class_metadata["rationale"] == undefined || class_metadata["rationale"] == null){
                console.log(`${name} has not "rationale" defined`);
            }
            else{
                content.push(`${name} vaem:rationale ${class_metadata["rationale"]} .`);
            }
            //object property source
            if(class_metadata["source"] == undefined || class_metadata["source"] == null){
                console.log(`${name} has not "source" defined`);
            }
            else{
                content.push(`${name} dcterms:source ${class_metadata["source"]} .`);
            }
        }
        else{
            console.log(`${name} has not metadata defined`);
        }
    });
}

function createDataProperties(dataProperties){
    var dataProperties_names = Object.keys(dataProperties);
    content.push("\n# #################################################################\n# #\n# #    Data Properties\n# #\n# #################################################################\n");
    dataProperties_names.forEach(name => {
        var class_metadata = dataProperties[name];
        content.push(`${name} rdf:type owl:DatatypeProperty .`);
        if(class_metadata != null){
            //object property domain
            if(class_metadata["domain"] == undefined || class_metadata["domain"] == null){
                console.log(`${name} has not "domain" defined`);
            }
            else{
                content.push(`${name} rdfs:domain ${class_metadata["domain"]} .`);
            }
            //object property range
            if(class_metadata["range"] == undefined || class_metadata["range"] == null){
                console.log(`${name} has not "range" defined`);
            }
            else{
                content.push(`${name} rdfs:range ${class_metadata["range"]} .`);
            }
            //object property label
            if(class_metadata["label"] == undefined || class_metadata["label"] == null){
                console.log(`${name} has not "label" defined`);
            }
            else{
                content.push(`${name} rdfs:label ${class_metadata["label"]} .`);
            }
            //object property comment
            if(class_metadata["definition"] == undefined || class_metadata["definition"] == null){
                console.log(`${name} has not "definition" defined`);
            }
            else{
                content.push(`${name} rdfs:comment ${class_metadata["definition"]} .`);
            }
            //object property example
            if(class_metadata["example"] == undefined || class_metadata["example"] == null){
                console.log(`${name} has not "example" defined`);
            }
            else{
                content.push(`${name} vann:example ${class_metadata["example"]} .`);
            }
            //object property status
            if(class_metadata["status"] == undefined || class_metadata["status"] == null){
                console.log(`${name} has not "status" defined`);
            }
            else{
                content.push(`${name} sw:term status ${class_metadata["status"]} .`);
            }
            //object property rationale
            if(class_metadata["rationale"] == undefined || class_metadata["rationale"] == null){
                console.log(`${name} has not "rationale" defined`);
            }
            else{
                content.push(`${name} vaem:rationale ${class_metadata["rationale"]} .`);
            }
            //object property source
            if(class_metadata["source"] == undefined || class_metadata["source"] == null){
                console.log(`${name} has not "source" defined`);
            }
            else{
                content.push(`${name} dcterms:source ${class_metadata["source"]} .`);
            }
        }
        else{
            console.log(`${name} has not metadata defined`);
        }
    });  
}

module.exports.createOntology = createOntology;