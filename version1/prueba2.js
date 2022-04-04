const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;
const yaml = require('js-yaml');
const fs = require('fs');

var writer;
var prefixes = new Map();
var ontology;
var prueba = {owl:'http://www.w3.org/2002/07/owl#', 
            rdf:'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            xsd:'http://www.w3.org/2001/XMLSchema#',
            rdfs:'http://www.w3.org/2000/01/rdf-schema#',
            bibo:'http://purl.org/ontology/bibo/',
            foaf:'http://xmlns.com/foaf/0.1/',
            dcterms:'http://purl.org/dc/terms/',
            vaem:'http://www.linkedmodel.org/schema/vaem',
            vann:'http://purl.org/vocab/vann/',
            sw:'http://www.w3.org/2003/06/sw-vocab-status/ns#'}

createOntology('./data.yaml');

function createOntology(templatePath){
    var fileContents = fs.readFileSync(templatePath, 'utf8');
    var data = yaml.loadAll(fileContents);

    //Read prefixes
    var prefix = data[1];
    createPrefix(prefix);
    console.log(prueba);

    //Read metadata
    var information = data[0];
    ontology = information['ontology'];
    if(ontology == undefined || ontology == null){
        console.log("ontology is undefined");
        process.exit(-1);
    }
    prueba['']=ontology;

    //Create graph
    writer = new N3.Writer({ prefixes: prueba  });

    createMetadata(information);

    //Read classes
    var classes = data[2];
    createClasses(classes);

    //Read object properties
    var objectProperties = data[3];
    createObjectProperties(objectProperties);

    
    writer.addQuad(
    namedNode('http://www.studyroomsmadrid.es/studyRoom/ontology/studyOnt2#Tom'),
    namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
    namedNode('http://www.studyroomsmadrid.es/studyRoom/ontology/studyOnt2#Cat')
    );
    writer.addQuad(quad(
    namedNode('http://www.studyroomsmadrid.es/studyRoom/ontology/studyOnt2#Tom'),
    namedNode('http://www.studyroomsmadrid.es/studyRoom/ontology/studyOnt2#name'),
    literal('Tom')
    ));
    writer.end((error, result) => console.log(result));
}


function createPrefix(prefix){
    var names = Object.keys(prefix);
    names.forEach(name => {
        prueba[name] = prefix[name];
        prefixes.set(name, prefix[name]);
    });
}

function createMetadata(metadata){

    writer.addQuad(
        namedNode(ontology),
        namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        namedNode('http://www.w3.org/2002/07/owl#Ontology')
        );

    //license
    if(metadata["license"] == undefined || metadata["license"] == null){
        console.log("License is undefined");
    }
    else{
        writer.addQuad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/license'),
            namedNode(metadata["license"])
            );
    }
   
    //creator
    if(metadata["creator"] == undefined || metadata["creator"] == null){
        console.log("creator is undefined");
    }
    else{
        metadata["creator"].split(',').forEach(element =>{
            writer.addQuad(quad(
                namedNode(ontology),
                namedNode('http://purl.org/dc/terms/creator'),
                literal(element.trim())
                ));
        });
    }

    //contributor
    if(metadata["contributor"] == undefined || metadata["contributor"] == null){
        console.log("contributor is undefined");
    }    
    else{
        metadata["contributor"].split(',').forEach(element =>{
            writer.addQuad(quad(
                namedNode(ontology),
                namedNode('http://purl.org/dc/terms/contributor'),
                literal(element.trim())
                ));
        });
    }

    //prefix
    if(metadata["prefix"] == undefined || metadata["prefix"] == null){
        console.log("prefix is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/vocab/vann/preferredNamespacePrefix'),
            literal(metadata["prefix"])
            ));
    }
    
    //title
    if(metadata["title"] == undefined || metadata["title"] == null){
        console.log("title is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/title'),
            literal(metadata["title"])
            ));
    }
    
    //description
    if(metadata["description"] == undefined || metadata["description"] == null){
        console.log("description is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/description'),
            literal(metadata["description"])
            ));
    }
    
    //citation
    if(metadata["citation"] == undefined || metadata["citation"] == null){
        console.log("citation is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/bibliographicCitation'),
            literal(metadata["citation"])
            ));
    }
    
    //version
    if(metadata["version"] == undefined || metadata["version"] == null){
        console.log("version is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://www.w3.org/2002/07/owl#versionInfo'),
            literal(metadata["version"])
            ));
            writer.addQuad(
                namedNode(ontology),
                namedNode('http://www.w3.org/2002/07/owl#versionIRI'),
                namedNode(`${ontology}/${metadata["version"]}`)
                );
    }
   
    //abstract
    if(metadata["abstract"] == undefined || metadata["abstract"] == null){
        console.log("abstract is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/abstract'),
            literal(metadata["abstract"])
            ));
    }
    
    //see also
    if(metadata["see also"] == undefined || metadata["see also"] == null){
        console.log("see also is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://www.w3.org/2000/01/rdf-schema#seeAlso'),
            literal(metadata["see also"])
            ));
    }
    
    //status
    if(metadata["status"] == undefined || metadata["status"] == null){
        console.log("status is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://www.w3.org/2003/06/sw-vocab-status/ns#status'),
            literal(metadata["status"])
            ));
    }
    
    //backward compatibility
    if(metadata["backward compatibility"] == undefined || metadata["backward compatibility"] == null){
        console.log("backward compatibility is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://www.w3.org/2002/07/owl#backwardCompatibility'),
            literal(metadata["backward compatibility"])
            ));
    }
    
    //incompatibility
    if(metadata["incompatibility"] == undefined || metadata["incompatibility"] == null){
        console.log("incompatibility is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://www.w3.org/2002/07/owl#incompatibleWith'),
            literal(metadata["incompatibility"])
            ));
    }
    
    //issued date
    if(metadata["issued date"] == undefined || metadata["issued date"] == null){
        console.log("issued date is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/issued'),
            literal(metadata["issued date"])
            ));
    }
    
    //source
    if(metadata["source"] == undefined || metadata["source"] == null){
        console.log("source is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/source'),
            literal(metadata["source"])
            ));
    }
    
    //publisher
    if(metadata["publisher"] == undefined || metadata["publisher"] == null){
        console.log("publisher is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/dc/terms/published'),
            literal(metadata["publisher"])
            ));
    }
    
    //DOI
    if(metadata["DOI"] == undefined || metadata["DOI"] == null){
        console.log("DOI is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://purl.org/ontology/bibo/doi'),
            literal(metadata["DOI"])
            ));
    }
    
    //logo
    if(metadata["logo"] == undefined || metadata["logo"] == null){
        console.log("logo is undefined");
    }
    else{
        writer.addQuad(quad(
            namedNode(ontology),
            namedNode('http://xmlns.com/foaf/0.1/logo'),
            literal(metadata["logo"])
            ));
    }
    
    //diagram
    if(metadata["diagram"] == undefined || metadata["diagram"] == null){
        console.log("diagram is undefined");
    }
    else{
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
        literal(`${actualDate.getFullYear()}-${actualDate.getMonth()+1}-${actualDate.getDate()}`)
        ));
    writer.addQuad(quad(
        namedNode(ontology),
        namedNode('http://www.w3.org/2002/07/owl#priorVersion'),
        literal(' ')
        ));
    writer.addQuad(
    namedNode(ontology),
    namedNode('http://purl.org/vocab/vann/preferredNamespaceUri'),
    namedNode(ontology)
    );
    writer.addQuad(quad(
        namedNode(ontology),
        namedNode('http://purl.org/dc/terms/modified'),
        literal(`${actualDate.getFullYear()}-${actualDate.getMonth()+1}-${actualDate.getDate()}`)
        ));
}

function createClasses(classes){
    var classes_names = Object.keys(classes);
    var pos;
    var className;
    var prefix;
    classes_names.forEach(name => {
        pos = name.search(':');
        if(pos!=-1){//The class has a prefix
            prefix = prefixes.get(name.substring(0,pos));
            if(prefix != undefined){//The prefix is defined
                className = `${prefix}${name.substring(pos+1)}`;
            }
            else{//The prefix is undefined
                console.log(`Prefix ${name.substring(0,pos)} is not defined`);
                //Add the class with the default
                className = `${ontology}${name}`;
            }
        }
        else{//The class has not a prefix
            //Add the class with the default
            className = `${ontology}${name}`;
        }
        //Add the class
        writer.addQuad(
            namedNode(className),
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('http://www.w3.org/2002/07/owl#Class')
            );
        var class_metadata = classes[name];
        if(class_metadata != null){
            //class label
            if(class_metadata["label"] == undefined || class_metadata["label"] == null){
                console.log(`${name} has not "label" defined`);
            }
            else{
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
                    literal(class_metadata["label"])
                    ));
            }

            //class comment
            if(class_metadata["definition"] == undefined || class_metadata["definition"] == null){
                console.log(`${name} has not "definition" defined`);
            }
            else{
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#comment'),
                    literal(class_metadata["definition"])
                    ));
            }

            //class example
            if(class_metadata["example"] == undefined || class_metadata["example"] == null){
                console.log(`${name} has not "example" defined`);
            }
            else{
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://purl.org/vocab/vann/example'),
                    literal(class_metadata["example"])
                    ));
            }

            //class status
            if(class_metadata["status"] == undefined || class_metadata["status"] == null){
                console.log(`${name} has not "status" defined`);
            }
            else{
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2003/06/sw-vocab-status/ns#status'),
                    literal(class_metadata["status"])
                    ));
            }

            //class rationale
            if(class_metadata["rationale"] == undefined || class_metadata["rationale"] == null){
                console.log(`${name} has not "rationale" defined`);
            }
            else{
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://www.linkedmodel.org/schema/vaem/rationale'),
                    literal(class_metadata["rationale"])
                    ));
            }

            //class source
            if(class_metadata["source"] == undefined || class_metadata["source"] == null){
                console.log(`${name} has not "source" defined`);
            }
            else{
                writer.addQuad(quad(
                    namedNode(className),
                    namedNode('http://purl.org/dc/terms/source'),
                    literal(class_metadata["source"])
                    ));
            }
        }
        else{
            console.log(`${name} has not metadata defined`);
        }
    });

}

function createObjectProperties(objectProperties){
    var objectProperties_names = Object.keys(objectProperties);
    var className;
    var prefix;
    var domainRange;
    objectProperties_names.forEach(name => {
        pos = name.search(':');
        if(pos!=-1){//The class has a prefix
            prefix = prefixes.get(name.substring(0,pos));
            if(prefix != undefined){//The prefix is defined
                className = `${prefix}${name.substring(pos+1)}`;
            }
            else{//The prefix is undefined
                console.log(`Prefix ${name.substring(0,pos)} is not defined`);
                //Add the class with the default
                className = `${ontology}${name}`;
            }
        }
        else{//The class has not a prefix
            //Add the class with the default
            className = `${ontology}${name}`;
        }
        writer.addQuad(quad(
            namedNode(className),
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')
            ));

        var class_metadata = objectProperties[name];
        if(class_metadata != null){
            //object property domain
            if(class_metadata["domain"] == undefined || class_metadata["domain"] == null){
                console.log(`${name} has not "domain" defined`);
            }
            else{
                domainRange = class_metadata["domain"];
                pos = domainRange.search(':');
                if(pos!=-1){//The class has a prefix
                    prefix = prefixes.get(domainRange.substring(0,pos));
                    if(prefix != undefined){//The prefix is defined
                        domainRange = `${prefix}${domainRange.substring(pos+1)}`;
                    }
                    else{//The prefix is undefined
                        console.log(`Prefix ${domainRange.substring(0,pos)} is not defined`);
                        //Add the class with the default
                        className = `${ontology}${domainRange}`;
                    }
                }
                else{//The class has not a prefix
                    //Add the class with the default
                    domainRange = `${ontology}${domainRange}`;
                }
                writer.addQuad(
                    namedNode(className),
                    namedNode('http://www.w3.org/2000/01/rdf-schema#domain'),
                    namedNode(domainRange)
                    );
            }

            //object property range
            if(class_metadata["range"] == undefined || class_metadata["range"] == null){
                console.log(`${name} has not "range" defined`);
            }
            else{
                domainRange = class_metadata["range"];
                pos = domainRange.search(':');
                if(pos!=-1){//The class has a prefix
                    prefix = prefixes.get(domainRange.substring(0,pos));
                    if(prefix != undefined){//The prefix is defined
                        domainRange = `${prefix}${domainRange.substring(pos+1)}`;
                    }
                    else{//The prefix is undefined
                        console.log(`Prefix ${domainRange.substring(0,pos)} is not defined`);
                        //Add the class with the default
                        className = `${ontology}${domainRange}`;
                    }
                }
                else{//The class has not a prefix
                    //Add the class with the default
                    domainRange = `${ontology}${domainRange}`;
                }
                store.add(className,$rdf.sym('http://www.w3.org/2000/01/rdf-schema#range'),$rdf.sym(domainRange));
            }

            //class label
            if(class_metadata["label"] == undefined || class_metadata["label"] == null){
                console.log(`${name} has not "label" defined`);
            }
            else{
                store.add(className,$rdf.sym('http://www.w3.org/2000/01/rdf-schema#label'),`${class_metadata["label"]}`);
            }

            //class comment
            if(class_metadata["definition"] == undefined || class_metadata["definition"] == null){
                console.log(`${name} has not "definition" defined`);
            }
            else{
                store.add(className,$rdf.sym('http://www.w3.org/2000/01/rdf-schema#comment'),`${class_metadata["definition"]}`);
            }

            //class example
            if(class_metadata["example"] == undefined || class_metadata["example"] == null){
                console.log(`${name} has not "example" defined`);
            }
            else{
                store.add(className,$rdf.sym('http://purl.org/vocab/vann/example'),`${class_metadata["example"]}`);
            }

            //class status
            if(class_metadata["status"] == undefined || class_metadata["status"] == null){
                console.log(`${name} has not "status" defined`);
            }
            else{
                store.add(className,$rdf.sym('http://www.w3.org/2003/06/sw-vocab-status/ns#status'),`${class_metadata["status"]}`);
            }

            //class rationale
            if(class_metadata["rationale"] == undefined || class_metadata["rationale"] == null){
                console.log(`${name} has not "rationale" defined`);
            }
            else{
                store.add(className,$rdf.sym('http://www.linkedmodel.org/schema/vaem/rationale'),`${class_metadata["rationale"]}`);
            }

            //class source
            if(class_metadata["source"] == undefined || class_metadata["source"] == null){
                console.log(`${name} has not "source" defined`);
            }
            else{
                store.add(className,$rdf.sym('http://purl.org/dc/terms/source'),`${class_metadata["source"]}`);
            }

        }
        else{
            console.log(`${name} has not metadata defined`);
        }
        */
    });
}