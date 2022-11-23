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
var log = [];

//createOntology('./templates/data.yaml');

export default function createOntology(templatePath) {
    var fileContents = fs.readFileSync(templatePath, 'utf8');
    var data = yaml.loadAll(fileContents);

    if(data.length != 6){
        console.log(`Template ${templatePath} has not all the camps`);
        console.log(`The camps are the following: Ontology metadata, prefix, class, object properties, data properties and repository information`);
        console.log('Execution terminated');
        process.exit(-1);
    }
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
        log.push("The camp 'License' is undefined. License is not going to be added in the ontology metadata");
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
        log.push("The camp 'creator' is undefined. Creator is not going to be added in the ontology metadata");
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
        log.push("The camp 'contributor' is undefined. Contributor is not going to be added in the ontology metadata");

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
        log.push("The camp 'prefix' is undefined. Prefix is not going to be added in the ontology metadata");
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
        log.push("The camp 'title' is undefined. Title is not going to be added in the ontology metadata");
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
        log.push("The camp 'description' is undefined. Description is not going to be added in the ontology metadata");
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
        log.push("The camp 'citation' is undefined. Citation is not going to be added in the ontology metadata");
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
        log.push("The camp 'abstract' is undefined. Abstract is not going to be added in the ontology metadata");
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
        log.push("The camp 'see also' is undefined. See also is not going to be added in the ontology metadata");
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
        log.push("The camp 'status' is undefined. Status is not going to be added in the ontology metadata");
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
        log.push("The camp 'backward compatibility' is undefined. Backward compatibility is not going to be added in the ontology metadata");
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
        log.push("The camp 'incompatibility' is undefined. Incompatibility is not going to be added in the ontology metadata");
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
        log.push("The camp 'issued date' is undefined. Issued date is not going to be added in the ontology metadata");
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
        log.push("The camp 'source' is undefined. Source is not going to be added in the ontology metadata");
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
        log.push("The camp 'publisher' is undefined. Publisher is not going to be added in the ontology metadata");
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
        log.push("The camp 'DOI' is undefined. DOI is not going to be added in the ontology metadata");
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
        log.push("The camp 'logo' is undefined. Logo is not going to be added in the ontology metadata");
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
        log.push("The camp 'diagram' is undefined. Diagram is not going to be added in the ontology metadata");
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
                console.log(`Prefix ${name.substring(0, pos)} use in the class ${name} is not defined`);
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
                log.push(`The class ${name} has not "label" defined. Label is not going to be added in the class ${name} metadata`);
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
                log.push(`The class ${name} has not "definition" defined. Comment is not going to be added in the class ${name} metadata`);
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
                log.push(`The class ${name} has not "example" defined. Example is not going to be added in the class ${name} metadata`);
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
                log.push(`The class ${name} has not "status" defined. Status is not going to be added in the class ${name} metadata`);
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
                log.push(`The class ${name} has not "ratioanle" defined. Rationale is not going to be added in the class ${name} metadata`);
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
                log.push(`The class ${name} has not "source" defined. Source is not going to be added in the class ${name} metadata`);
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
            log.push(`The class ${name} has not metadata defined. No metadata is not going to be added in the class ${name}`);
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
                console.log(`Prefix ${name.substring(0, pos)} use in the object property ${name} is not defined.`);
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
                log.push(`The object property ${name} has not "domain" defined. Domain is not going to be added in the object property ${name} metadata`);
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
                        console.log(`Prefix ${domainRange.substring(0, pos)} use in the class ${domainRange} which is used as domain of the object property ${name} is not defined`);
                        console.log('Execution terminated');
                        process.exit(-1);
                    }
                }
                else {//The class has not a prefix
                    //Add the class with the default
                    domainRange = `${ontology}${domainRange}`;
                }
                //If the class has not been defined previously terminate execution
                if (variables[class_metadata["domain"]] != '') {
                    console.log(`The class ${class_metadata["domain"]} use as domain of the object property ${name} is not defined `);
                    console.log('Execution terminated');
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
                log.push(`The object property ${name} has not "range" defined. Range is not going to be added in the object property ${name} metadata`);
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
                        console.log(`Prefix ${domainRange.substring(0, pos)} use in the class ${domainRange} which is used as range of the object property ${name} is not defined`);
                        console.log('Execution terminated');
                        process.exit(-1);
                    }
                }
                else {//The class has not a prefix
                    //Add the class with the default
                    domainRange = `${ontology}${domainRange}`;
                }
                //If the class has not been defined previously terminate execution
                if (variables[class_metadata["range"]] != '') {
                    console.log(`Class ${class_metadata["range"]} use as range of the object property ${name} is not defined `);
                    console.log('Execution terminated');
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
                log.push(`The object property ${name} has not "label" defined. Label is not going to be added in the object property ${name} metadata`);
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
                log.push(`The object property ${name} has not "definition" defined. Comment is not going to be added in the object property ${name} metadata`);
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
                log.push(`The object property ${name} has not "example" defined. Example is not going to be added in the object property ${name} metadata`);
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
                log.push(`The object property ${name} has not "status" defined. Status is not going to be added in the object property ${name} metadata`);
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
                log.push(`The object property ${name} has not "rationale" defined. Rationale is not going to be added in the object property ${name} metadata`);
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
                log.push(`The object property ${name} has not "source" defined. Source is not going to be added in the object property ${name} metadata`);
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
            log.push(`The object property ${name} has not metadata defined. Any metadata is not going to be added in the object property ${name}`);
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
                console.log(`Prefix ${name.substring(0, pos)} use in the data property ${name} is not defined`);
                console.log('Execution terminated');
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
                log.push(`The data property ${name} has not "domain" defined. Domain is not going to be added in the data property ${name} metadata`);
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
                        console.log(`Prefix ${domainRange.substring(0, pos)} use in the class ${domainRange} use as domain of the data property ${name} is not defined`);
                        console.log('Execution terminated');
                        process.exit(-1);
                    }
                }
                else {//The class has not a prefix
                    //Add the class with the default
                    domainRange = `${ontology}${domainRange}`;
                }
                //If the class has not been defined previously terminate execution
                if (variables[class_metadata["domain"]] != '') {
                    console.log(`Class ${class_metadata["domain"]} use as domain of the data property ${name} is not defined`);
                    console.log('Execution terminated');
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
                log.push(`The data property ${name} has not "range" defined. Range is not going to be added in the data property ${name} metadata`);
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
                log.push(`The data property ${name} has not "label" defined. Label is not going to be added in the data property ${name} metadata`);
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
                log.push(`The data property ${name} has not "definition" defined. Comment is not going to be added in the data property ${name} metadata`);
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
                log.push(`The data property ${name} has not "example" defined. Example is not going to be added in the data property ${name} metadata`);
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
                log.push(`The data property ${name} has not "status" defined. Status is not going to be added in the data property ${name} metadata`);
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
                log.push(`The data property ${name} has not "rationale" defined. Rationale is not going to be added in the data property ${name} metadata`);
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
                log.push(`The data property ${name} has not "source" defined. Source is not going to be added in the data property ${name} metadata`);
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
            log.push(`The data property ${name} has not metadata defined. Any metadata is not going to be added in the data property ${name}`);
        }
    });
}

function createRepo(repo) {
    //If local path is defined, the folders are going to be created
    var localPath = repo["repository local path"];
    if (localPath != undefined && localPath != null) {
        //Check if the path exists
        if (fs.existsSync(localPath)) {
            //Check if directory localPath is empty
            const files = fs.readdirSync(localPath);
            if(files.length){
                console.log(`Error: Directory ${localPath} is not empty`);
                console.log('It contains the following files:')
                for (const file of files) {
                    console.log(`${file}`);
                }
                console.log('Execution terminated');
                process.exit(-1);
            }
            //Create the folder structure
            var text;
            //Create folders
            fs.mkdirSync(`${localPath}/Release`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Current`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Current/Ontology`, { recursive: true }, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Current/Diagrams`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Current/Queries`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Current/Examples`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Current/Documentation`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Current/Requirements`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Current/Requirements/ORSD`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Current/Requirements/finalVersion`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.mkdirSync(`${localPath}/Current/Requirements/testSuite`, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            //Create README.md in each folder
            text = '#Release\n The previous versions of the ontology are going to be stored in this folder.\nEach version is stored in a folder whose name is the ontology version.'
            writeREADME(`${localPath}/Release/README.md`, text);

            text = '#Current\n Ultima version de la ontologia. Con las mismas carpetas que las versiones de release'
            writeREADME(`${localPath}/Current/README.md`, text);

            //Create README.md in each subfolder of Current
            text = '#Ontology\n Para guardar el ttl con la ontología'
            writeREADME(`${localPath}/Current/Ontology/README.md`, text);

            text = '#Diagrams\n Para guardar imagenes con los diagramas'
            writeREADME(`${localPath}/Current/Diagrams/README.md`, text);

            text = '#Queries\n Para guardar las sparql queries de ejemplo'
            writeREADME(`${localPath}/Current/Queries/README.md`, text);

            text = '#Queries\n Para guardar instancias de ejemplo'
            writeREADME(`${localPath}/Current/Examples/README.md`, text);

            text = '#Documentation\n Documentacion html'
            writeREADME(`${localPath}/Current/Documentation/README.md`, text);

            text = '#Requirements\n Se almacenara todo lo que incluyan los requirements'
            writeREADME(`${localPath}/Current/Requirements/README.md`, text);

            //Create README.md in each subfolder of Requirements
            text = '#ORSD\n Se almacenara el ORSD'
            writeREADME(`${localPath}/Current/Requirements/ORSD/README.md`, text);

            text = '#Requirements Final Version\n Se almacenara la version final de los requirements'
            writeREADME(`${localPath}/Current/Requirements/finalVersion/README.md`, text);

            text = '#Test Suite\n Se almacenara los test suites'
            writeREADME(`${localPath}/Current/Requirements/testSuite/README.md`, text);

            //Write the ontology in folder Current
            writeOntology(`${localPath}/Current/Ontology/ontology.ttl`).then(() => {
                //Upload ontology to github
                uploadOntology(localPath, repo['url'], repo['github username'], repo['github email']).then(() =>{
                    writeLog('./logs/');
                });
            });

            //Copy the ontology to folder Current
            //copyCurrentVersion(`${localPath}/Release/1.0.0`, `${localPath}/Current`);

            
            
        }
        else {
            console.log(`The directory ${localPath} does not exists. The repository can not be created in that path`);
            console.log('Execution terminated');
            process.exit(-1);
        }
    }
    else {
        console.log("The camp 'repository local path' is not defined. The repository is not going to be created");
        log.push("The camp 'repository local path' is not defined. The repository is not going to be created");
        console.log("The ontology is going to be stored in the current path");
        log.push("The ontology is going to be stored in the current path");
        writeOntology('./ontology.ttl').then(() => {
            writeLog('./logs/')
        });
    }


}

async function writeOntology(ontologyPath) {
    return new Promise((resolve, reject) => {
        writer.end((error, result) => fs.writeFile(ontologyPath, result, function (err) {
            if (err) {
                console.log(err);
            } else {
                log.push('The ttl file has been created successfully');
            }
        }));
        setTimeout(() => {
            resolve();
        }, 100);
    });
    
}

function writeREADME(readmePath, text) {
    fs.writeFile(readmePath, text, function (err) {
        if (err) {
            console.log(err);
        } else {
            log.push(`The Readme file has been created successfully in ${readmePath}`);
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

async function uploadOntology(localPath, url, username, email) {
    return new Promise((resolve, reject) => {
    if (url == undefined || url == null) {
        console.log("Url is not defined. It is not possible to upload the repository to github");
        log.push("Url is not defined. It is not possible to upload the repository to github");
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
                log.push(`Username succesfully configured`);
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
                log.push(`Email succesfully configured`);
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
            log.push(`Ontology succesfully upload`);
        });
    }
    setTimeout(() => {
        resolve();
    }, 100);
});
}

function writeLog(logPath) {
    let now= new Date();
    logPath = `${logPath}bootstrapingLog_${now.getMonth()+1}-${now.getDate()}-${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.txt`;
    fs.writeFile(`${logPath}`, log.join('\n'), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`The Log file has been created successfully in ${logPath}`);
        }
    });
}