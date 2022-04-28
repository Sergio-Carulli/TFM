//const N3 = require('n3');
import N3 from 'n3'

const { DataFactory } = N3;

const { namedNode, literal, defaultGraph, quad } = DataFactory;

//const yaml = require('js-yaml');
import yaml from 'js-yaml'

//const fs = require('fs-extra');
import fs from 'fs-extra'

//const { exec } = require("child_process");
import child_process from 'child_process'
const { exec } = child_process;

var writer;
var ontology;
var prefixes = {
    owl: 'http://www.w3.org/2002/07/owl#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    bibo: 'http://purl.org/ontology/bibo/',
    foaf: 'http://xmlns.com/foaf/0.1/',
    dcterms: 'http://purl.org/dc/terms/',
    vaem: 'http://www.linkedmodel.org/schema/vaem',
    vann: 'http://purl.org/vocab/vann/',
    sw: 'http://www.w3.org/2003/06/sw-vocab-status/ns#',
    xsd: 'http://www.w3.org/2001/XMLSchema#'
}

var variables = {}

//createOntology('./templates/data.yaml');

export default function createOntology(templatePath) {
    var fileContents = fs.readFileSync(templatePath, 'utf8');
    var data = yaml.loadAll(fileContents);

    //Read prefixes
    var prefix = data[1];
    createPrefix(prefix);

    //Read metadata
    var information = data[0];
    ontology = information['ontology'];
    if (ontology == undefined || ontology == null) {
        console.log("The camp 'ontology' is undefined. Please defined an URI for your ontology");
        console.log('Execution terminated');
        process.exit(-1);
    }

    //Add default prefix :
    if (ontology.slice(-1) != '#' && ontology.slice(-1) != '/') {
        //If ontology does not finish with a # or a /, we added a # in the end in the default prefix :
        prefixes[''] = `${ontology}#`;
    }
    else {
        prefixes[''] = ontology;
    }


    //Create graph
    writer = new N3.Writer({ prefixes: prefixes });

    createMetadata(information);

    //Read classes
    var classes = data[2];
    createClasses(classes);

    //Read object properties
    var objectProperties = data[3];
    createObjectProperties(objectProperties);

    //Read data properties
    var dataProperties = data[4];
    createDataProperties(dataProperties);

    //Read create Repo
    var repo = data[5];
    createRepo(repo);
}


function createPrefix(prefix) {
    var names = Object.keys(prefix);
    names.forEach(name => {
        if (prefix[name].slice(-1) != '#' && prefix[name].slice(-1) != '/') {
            //It is not a good practice if the prefix does not finish with a # or a /
            console.log(`The prefix ${name} does not finish with a # or a /`);
            console.log('Execution terminated');
            process.exit(-1);
        }
        prefixes[name] = prefix[name];
    });
}

function createMetadata(metadata) {

    writer.addQuad(
        namedNode(ontology),
        namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        namedNode('http://www.w3.org/2002/07/owl#Ontology')
    );

    //license
    if (metadata["license"] == undefined || metadata["license"] == null) {
        console.log("The camp 'License' is undefined. License is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/license'),
            namedNode(metadata["license"])
        );
    }

    //creator
    if (metadata["creator"] == undefined || metadata["creator"] == null) {
        console.log("The camp 'creator' is undefined. Creator is not going to be added in the ontology metadata");
    }
    else {
        metadata["creator"].split(',').forEach(element => {
            writer.addQuad(quad(
                namedNode(ontology),
                namedNode('http://purl.org/dc/terms/creator'),
                literal(element.trim())
            ));
        });
    }

    //contributor
    if (metadata["contributor"] == undefined || metadata["contributor"] == null) {
        console.log("The camp 'contributor' is undefined. Contributor is not going to be added in the ontology metadata");
    }
    else {
        metadata["contributor"].split(',').forEach(element => {
            writer.addQuad(quad(
                namedNode(ontology),
                namedNode('http://purl.org/dc/terms/contributor'),
                literal(element.trim())
            ));
        });
    }

    //prefix
    if (metadata["prefix"] == undefined || metadata["prefix"] == null) {
        console.log("The camp 'prefix' is undefined. Prefix is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/vocab/vann/preferredNamespacePrefix'),
            literal(metadata["prefix"])
        ));
    }

    //title
    if (metadata["title"] == undefined || metadata["title"] == null) {
        console.log("The camp 'title' is undefined. Title is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/title'),
            literal(metadata["title"])
        ));
    }

    //description
    if (metadata["description"] == undefined || metadata["description"] == null) {
        console.log("The camp 'description' is undefined. Description is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/description'),
            literal(metadata["description"])
        ));
    }

    //citation
    if (metadata["citation"] == undefined || metadata["citation"] == null) {
        console.log("The camp 'citation' is undefined. Citation is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/bibliographicCitation'),
            literal(metadata["citation"])
        ));
    }

    //abstract
    if (metadata["abstract"] == undefined || metadata["abstract"] == null) {
        console.log("The camp 'abstract' is undefined. Abstract is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/abstract'),
            literal(metadata["abstract"])
        ));
    }

    //see also
    if (metadata["see also"] == undefined || metadata["see also"] == null) {
        console.log("The camp 'see also' is undefined. See also is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
            literal(metadata["see also"])
        ));
    }

    //status
    if (metadata["status"] == undefined || metadata["status"] == null) {
        console.log("The camp 'status' is undefined. Status is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://www.w3.org/2003/06/sw-vocab-status/ns#status'),
            literal(metadata["status"])
        ));
    }

    //backward compatibility
    if (metadata["backward compatibility"] == undefined || metadata["backward compatibility"] == null) {
        console.log("The camp 'backward compatibility' is undefined. Backward compatibility is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://www.w3.org/2002/07/owl#backwardCompatibility'),
            literal(metadata["backward compatibility"])
        ));
    }

    //incompatibility
    if (metadata["incompatibility"] == undefined || metadata["incompatibility"] == null) {
        console.log("The camp 'incompatibility' is undefined. Incompatibility is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://www.w3.org/2002/07/owl#incompatibleWith'),
            literal(metadata["incompatibility"])
        ));
    }

    //issued date
    if (metadata["issued date"] == undefined || metadata["issued date"] == null) {
        console.log("The camp 'issued date' is undefined. Issued date is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/issued'),
            literal(metadata["issued date"])
        ));
    }

    //source
    if (metadata["source"] == undefined || metadata["source"] == null) {
        console.log("The camp 'source' is undefined. Source is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/source'),
            literal(metadata["source"])
        ));
    }

    //publisher
    if (metadata["publisher"] == undefined || metadata["publisher"] == null) {
        console.log("The camp 'publisher' is undefined. Publisher is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/published'),
            literal(metadata["publisher"])
        ));
    }

    //DOI
    if (metadata["DOI"] == undefined || metadata["DOI"] == null) {
        console.log("The camp 'DOI' is undefined. DOI is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/ontology/bibo/doi'),
            literal(metadata["DOI"])
        ));
    }

    //logo
    if (metadata["logo"] == undefined || metadata["logo"] == null) {
        console.log("The camp 'logo' is undefined. Logo is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://xmlns.com/foaf/0.1/logo'),
            literal(metadata["logo"])
        ));
    }

    //diagram
    if (metadata["diagram"] == undefined || metadata["diagram"] == null) {
        console.log("The camp 'diagram' is undefined. Diagram is not going to be added in the ontology metadata");
    }
    else {
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://xmlns.com/foaf/0.1/depiction'),
            literal(metadata["diagram"])
        ));
    }
    //Fields which are filled automatically
    var actualDate = new Date();
    writer.addQuad(quad(
        namedNode(ontology),
        namedNode('http://purl.org/dc/terms/created'),
        literal(`${actualDate.getFullYear()}-${actualDate.getMonth() + 1}-${actualDate.getDate()}`)
    ));
    writer.addQuad(quad(
        namedNode(ontology),
        namedNode('http://purl.org/vocab/vann/preferredNamespaceUri'),
        literal(ontology)
    ));
    writer.addQuad(quad(
        namedNode(ontology),
        namedNode('http://purl.org/dc/terms/modified'),
        literal(`${actualDate.getFullYear()}-${actualDate.getMonth() + 1}-${actualDate.getDate()}`)
    ));

    //version
    writer.addQuad(quad(
        namedNode(ontology),
        namedNode('http://www.w3.org/2002/07/owl#versionInfo'),
        literal('1.0.0')
    ));
    var aux = ontology;
    if (ontology.slice(-1) == '#' || ontology.slice(-1) == '/') {
        aux = ontology.slice(0, -1)
    }
    writer.addQuad(
        namedNode(ontology),
        namedNode('http://www.w3.org/2002/07/owl#versionIRI'),
        namedNode(`${aux}/1.0.0`)
    );
}

function createClasses(classes) {
    var classes_names = Object.keys(classes);
    var pos;
    var className;
    var prefix;
    classes_names.forEach(name => {
        pos = name.search(':');
        if (pos != -1) {//The class has a prefix
            prefix = prefixes[name.substring(0, pos)];
            if (prefix != undefined) {//The prefix is defined
                className = `${prefix}${name.substring(pos + 1)}`;
            }
            else {//The prefix is undefined
                console.log(`Prefix ${name.substring(0, pos)} for the class ${name} is not defined`);
                console.log('Execution terminated');
                process.exit(-1);
            }
        }
        else {//The class has not a prefix
            //Add the class with the default
            className = `${ontology}${name}`;
        }
        //Add the class
        variables[name] = '';
        writer.addQuad(
            namedNode(className),
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('http://www.w3.org/2002/07/owl#Class')
        );
        var class_metadata = classes[name];
        if (class_metadata != null) {
            //class label
            if (class_metadata["label"] == undefined || class_metadata["label"] == null) {
                console.log(`The class ${name} has not "label" defined. Label is not going to be added in the class ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
                    literal(class_metadata["label"])
                ));
            }

            //class comment
            if (class_metadata["definition"] == undefined || class_metadata["definition"] == null) {
                console.log(`The class ${name} has not "definition" defined. Comment is not going to be added in the class ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#comment'),
                    literal(class_metadata["definition"])
                ));
            }

            //class example
            if (class_metadata["example"] == undefined || class_metadata["example"] == null) {
                console.log(`The class ${name} has not "example" defined. Example is not going to be added in the class ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://purl.org/vocab/vann/example'),
                    literal(class_metadata["example"])
                ));
            }

            //class status
            if (class_metadata["status"] == undefined || class_metadata["status"] == null) {
                console.log(`The class ${name} has not "status" defined. Status is not going to be added in the class ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2003/06/sw-vocab-status/ns#status'),
                    literal(class_metadata["status"])
                ));
            }

            //class rationale
            if (class_metadata["rationale"] == undefined || class_metadata["rationale"] == null) {
                console.log(`The class ${name} has not "ratioanle" defined. Rationale is not going to be added in the class ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.linkedmodel.org/schema/vaem/rationale'),
                    literal(class_metadata["rationale"])
                ));
            }

            //class source
            if (class_metadata["source"] == undefined || class_metadata["source"] == null) {
                console.log(`The class ${name} has not "source" defined. Source is not going to be added in the class ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://purl.org/dc/terms/source'),
                    literal(class_metadata["source"])
                ));
            }
        }
        else {
            console.log(`The class ${name} has not metadata defined. Any metadata is not going to be added in the class ${name}`);
        }
    });

}

function createObjectProperties(objectProperties) {
    var objectProperties_names = Object.keys(objectProperties);
    var className;
    var prefix;
    var domainRange;
    var pos;
    objectProperties_names.forEach(name => {
        pos = name.search(':');
        if (pos != -1) {//The class has a prefix
            prefix = prefixes[name.substring(0, pos)];
            if (prefix != undefined) {//The prefix is defined
                className = `${prefix}${name.substring(pos + 1)}`;
            }
            else {//The prefix is undefined
                console.log(`Prefix ${name.substring(0, pos)} for the object property ${name}is not defined.`);
                console.log('Execution terminated');
                process.exit(-1);
            }
        }
        else {//The class has not a prefix
            //Add the class with the default
            className = `${ontology}${name}`;
        }
        //Add the object property
        writer.addQuad(
            namedNode(className),
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')
        );

        var class_metadata = objectProperties[name];
        if (class_metadata != null) {
            //object property domain
            if (class_metadata["domain"] == undefined || class_metadata["domain"] == null) {
                console.log(`The object property ${name} has not "domain" defined. Domain is not going to be added in the object property ${name} metadata`);
            }
            else {
                domainRange = class_metadata["domain"];
                pos = domainRange.search(':');
                if (pos != -1) {//The class has a prefix
                    prefix = prefixes[domainRange.substring(0, pos)];
                    if (prefix != undefined) {//The prefix is defined
                        domainRange = `${prefix}${domainRange.substring(pos + 1)}`;
                    }
                    else {//The prefix is undefined
                        console.log(`Prefix ${domainRange.substring(0, pos)} for the class ${domainRange} in the domain of the object property ${name} is not defined`);
                        process.exit(-1);
                    }
                }
                else {//The class has not a prefix
                    //Add the class with the default
                    domainRange = `${ontology}${domainRange}`;
                }
                //If the class has not been defined previously terminate execution
                if (variables[class_metadata["domain"]] != '') {
                    console.log(`The class ${class_metadata["domain"]} is not defined in the domain of the object property ${name}`);
                    process.exit(-1);
                }
                //Add domain
                writer.addQuad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#domain'),
                    namedNode(domainRange)
                );
            }

            //object property range
            if (class_metadata["range"] == undefined || class_metadata["range"] == null) {
                console.log(`The object property ${name} has not "range" defined. Range is not going to be added in the object property ${name} metadata`);
            }
            else {
                domainRange = class_metadata["range"];
                pos = domainRange.search(':');
                if (pos != -1) {//The class has a prefix
                    prefix = prefixes[domainRange.substring(0, pos)];
                    if (prefix != undefined) {//The prefix is defined
                        domainRange = `${prefix}${domainRange.substring(pos + 1)}`;
                    }
                    else {//The prefix is undefined
                        console.log(`Prefix ${domainRange.substring(0, pos)} for the class ${domainRange} in the range of the object property ${name} is not defined`);
                        process.exit(-1);
                    }
                }
                else {//The class has not a prefix
                    //Add the class with the default
                    domainRange = `${ontology}${domainRange}`;
                }
                //If the class has not been defined previously terminate execution
                if (variables[class_metadata["range"]] != '') {
                    console.log(`Class ${class_metadata["range"]} is not defined in the range of the object property ${name}`);
                    process.exit(-1);
                }
                //Add range
                writer.addQuad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#range'),
                    namedNode(domainRange)
                );
            }

            //class label
            if (class_metadata["label"] == undefined || class_metadata["label"] == null) {
                console.log(`The object property ${name} has not "label" defined. Label is not going to be added in the object property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
                    literal(class_metadata["label"])
                ));
            }

            //class comment
            if (class_metadata["definition"] == undefined || class_metadata["definition"] == null) {
                console.log(`The object property ${name} has not "definition" defined. Comment is not going to be added in the object property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#comment'),
                    literal(class_metadata["definition"])
                ));
            }

            //class example
            if (class_metadata["example"] == undefined || class_metadata["example"] == null) {
                console.log(`The object property ${name} has not "example" defined. Example is not going to be added in the object property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://purl.org/vocab/vann/example'),
                    literal(class_metadata["example"])
                ));
            }

            //class status
            if (class_metadata["status"] == undefined || class_metadata["status"] == null) {
                console.log(`The object property ${name} has not "status" defined. Status is not going to be added in the object property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2003/06/sw-vocab-status/ns#status'),
                    literal(class_metadata["status"])
                ));
            }

            //class rationale
            if (class_metadata["rationale"] == undefined || class_metadata["rationale"] == null) {
                console.log(`The object property ${name} has not "rationale" defined. Rationale is not going to be added in the object property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.linkedmodel.org/schema/vaem/rationale'),
                    literal(class_metadata["rationale"])
                ));
            }

            //class source
            if (class_metadata["source"] == undefined || class_metadata["source"] == null) {
                console.log(`The object property ${name} has not "source" defined. Source is not going to be added in the object property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://purl.org/dc/terms/source'),
                    literal(class_metadata["source"])
                ));
            }

        }
        else {
            console.log(`The object property ${name} has not metadata defined. Any metadata is not going to be added in the object property ${name}`);
        }
    });
}

function createDataProperties(dataProperties) {
    var dataProperties_names = Object.keys(dataProperties);
    var className;
    var prefix;
    var domainRange;
    var pos;
    dataProperties_names.forEach(name => {
        pos = name.search(':');
        if (pos != -1) {//The class has a prefix
            prefix = prefixes[name.substring(0, pos)];
            if (prefix != undefined) {//The prefix is defined
                className = `${prefix}${name.substring(pos + 1)}`;
            }
            else {//The prefix is undefined
                console.log(`Prefix ${name.substring(0, pos)} for the data property ${name} is not defined`);
                process.exit(-1);
            }
        }
        else {//The class has not a prefix
            //Add the class with the default
            className = `${ontology}${name}`;
        }
        //Add the data property
        writer.addQuad(
            namedNode(className),
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('http://www.w3.org/2002/07/owl#DatatypeProperty')
        );

        var class_metadata = dataProperties[name];
        if (class_metadata != null) {
            //object property domain
            if (class_metadata["domain"] == undefined || class_metadata["domain"] == null) {
                console.log(`The data property ${name} has not "domain" defined. Domain is not going to be added in the data property ${name} metadata`);
            }
            else {
                domainRange = class_metadata["domain"];
                pos = domainRange.search(':');
                if (pos != -1) {//The class has a prefix
                    prefix = prefixes[domainRange.substring(0, pos)];
                    if (prefix != undefined) {//The prefix is defined
                        domainRange = `${prefix}${domainRange.substring(pos + 1)}`;
                    }
                    else {//The prefix is undefined
                        console.log(`Prefix ${domainRange.substring(0, pos)} for the class ${domainRange} in the domain of the data property ${name} is not defined`);
                        process.exit(-1);
                    }
                }
                else {//The class has not a prefix
                    //Add the class with the default
                    domainRange = `${ontology}${domainRange}`;
                }
                //If the class has not been defined previously terminate execution
                if (variables[class_metadata["domain"]] != '') {
                    console.log(`Class ${class_metadata["domain"]} is not defined in the domain of the data property ${name}`);
                    process.exit(-1);
                }
                writer.addQuad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#domain'),
                    namedNode(domainRange)
                );
            }

            //object property range
            if (class_metadata["range"] == undefined || class_metadata["range"] == null) {
                console.log(`The data property ${name} has not "range" defined. Range is not going to be added in the data property ${name} metadata`);
            }
            else {
                writer.addQuad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#range'),
                    namedNode(`http://www.w3.org/2001/XMLSchema#${class_metadata["range"]}`)
                );
            }

            //class label
            if (class_metadata["label"] == undefined || class_metadata["label"] == null) {
                console.log(`The data property ${name} has not "label" defined. Label is not going to be added in the data property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
                    literal(class_metadata["label"])
                ));
            }

            //class comment
            if (class_metadata["definition"] == undefined || class_metadata["definition"] == null) {
                console.log(`The data property ${name} has not "definition" defined. Comment is not going to be added in the data property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#comment'),
                    literal(class_metadata["definition"])
                ));
            }

            //class example
            if (class_metadata["example"] == undefined || class_metadata["example"] == null) {
                console.log(`The data property ${name} has not "example" defined. Example is not going to be added in the data property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://purl.org/vocab/vann/example'),
                    literal(class_metadata["example"])
                ));
            }

            //class status
            if (class_metadata["status"] == undefined || class_metadata["status"] == null) {
                console.log(`The data property ${name} has not "status" defined. Status is not going to be added in the data property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2003/06/sw-vocab-status/ns#status'),
                    literal(class_metadata["status"])
                ));
            }

            //class rationale
            if (class_metadata["rationale"] == undefined || class_metadata["rationale"] == null) {
                console.log(`The data property ${name} has not "rationale" defined. Rationale is not going to be added in the data property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.linkedmodel.org/schema/vaem/rationale'),
                    literal(class_metadata["rationale"])
                ));
            }

            //class source
            if (class_metadata["source"] == undefined || class_metadata["source"] == null) {
                console.log(`The data property ${name} has not "source" defined. Source is not going to be added in the data property ${name} metadata`);
            }
            else {
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://purl.org/dc/terms/source'),
                    literal(class_metadata["source"])
                ));
            }

        }
        else {
            console.log(`The data property ${name} has not metadata defined. Any metadata is not going to be added in the data property ${name}`);
        }
    });
}

function createRepo(repo) {
    //If local path is defined, the folders are going to be created
    var localPath = repo["repository local path"];
    if (localPath != undefined && localPath != null) {
        //Check if the path exists
        if (fs.existsSync(localPath)) {
            //Create the folder structure
            var text;
            //Create folders
            fs.mkdirSync(`${localPath}/Release`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Documentation`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Requirements`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Current`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Release/1.0.0/Ontology`, { recursive: true }, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Release/1.0.0/Diagrams`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Release/1.0.0/Test`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            //Create README.md in each folder
            text = '#Release\n The previous versions of the ontology are going to be stored in this folder.\nEach version is stored in a folder whose name is the ontology version.'
            writeREADME(`${localPath}/Release/README.md`, text);
            text = '#Documentation\n'
            writeREADME(`${localPath}/Documentation/README.md`, text);
            text = '#Requirements\n'
            writeREADME(`${localPath}/Requirements/README.md`, text);
            text = '#Current\n'
            writeREADME(`${localPath}/Current/README.md`, text);
            text = '#Diagrams\n'
            writeREADME(`${localPath}/Release/1.0.0/Diagrams/README.md`, text);
            text = '#Test\n'
            writeREADME(`${localPath}/Release/1.0.0/Test/README.md`, text);

            //Write the ontology in folder Release
            writeOntology(`${localPath}/Release/1.0.0/Ontology/ontology.ttl`);

            //Copy the ontology to folder Current
            copyCurrentVersion(`${localPath}/Release/1.0.0`, `${localPath}/Current`);

            //Upload ontology to github
            uploadOntology(localPath, repo['url'], repo['github username'], repo['github email']);
        }
        else {
            console.log(`The directory ${localPath} does not exists. The repository can not be created in that path`);
            console.log('Execution terminated');
            process.exit(-1);
        }
    }
    else {
        console.log("The camp 'repository local path' is not defined. The repository is not going to be created");
        console.log("The ontology is going to be stored in the current path");
        writeOntology('./ontology.ttl');
    }


}

function writeOntology(ontologyPath) {
    writer.end((error, result) => fs.writeFile(ontologyPath, result, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('The ttl file has been created successfully');
        }
    }));
}

function writeREADME(readmePath, text) {
    fs.writeFile(readmePath, text, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`The Readme file has been created successfully in ${readmePath}`);
        }
    });
}

function copyCurrentVersion(src, dest) {
    fs.copy(src, dest, (err) => {
        if (err) {
            console.log("Error Found:", err);
        }
        else {
            console.log('File copied succesfully');
        }
    });
}

function uploadOntology(localPath, url, username, email) {
    if (url == undefined || url == null) {
        console.log("Url is not defined. It is not possible to upload the repositoy to github");
    }
    else {
        //Configure github username
        if (username != undefined && username != null) {
            exec(`git config --global user.name "${username}"`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`Username succesfully configured`);
            });
        }
        //Cofigure github email
        if (email != undefined && email != null) {
            exec(`git config --global user.email ${email}`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`Email succesfully configured`);
            });
        }

        //Upload repository to github
        exec(`cd ${localPath} && git init -b master && git add . && git commit -m "Initial Commit" && git remote add origin ${url} && git push origin master && git push --set-upstream origin master`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`Ontology succesfully upload`);
        });
    }
}