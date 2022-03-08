const fs = require('fs');
const yaml = require('js-yaml');
const $rdf = require('rdflib');

var store = $rdf.graph();
var templatePath = "./updateOntology.yaml";
var ontology;
var prefixes = new Map();
updateOntology(templatePath);





function updateOntology(templatePath){
    var fileContents = fs.readFileSync(templatePath, 'utf8');
    var data = yaml.loadAll(fileContents);
    
    //Read metadata
    var information = data[0];
    if(information["previousVersionOntologyPath"] == undefined || information["previousVersionOntologyPath"] == null){
        console.log("ontology is undefined");
        process.exit(-1);
    }
    
    ontologyPath = information["previousVersionOntologyPath"];
    
    if (!fs.existsSync(ontologyPath)) {
        console.log(`The file ${ontologyPath} does not exist`);
        process.exit(-1);
      }
    
    //Read the last version of the ontology
    var fileContents = fs.readFileSync(ontologyPath, 'utf8');
    
    var uri = 'https://example.org/resource.ttl';
    try {
        $rdf.parse(fileContents, store, uri, 'text/turtle');
    } catch (err) {
        console.log(err);
    }
    
    ontology = store.any(undefined, $rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),$rdf.sym('http://www.w3.org/2002/07/owl#Ontology'))['value'];
    updateMetadata(information);

    //Read prefixes
    var prefix = data[1];
    createPrefix(prefix);

    //Read classes
    var classes = data[2];
    updateClasses(classes);

    //Read remove Classes
    var classesRemove = data[3];
    removeClasses(classesRemove);

    //Read object properties
    var objectProperties = data[4];
    updateObjectProperties(objectProperties);

    //Read remove object properties
    var objectPropertiesRemove = data[5];
    removeObjectProperties(objectPropertiesRemove);

    //Read data properties
    var dataProperties = data[6];
    updateDataProperties(dataProperties);

    //Read remove data properties
    var dataPropertiesRemove = data[7];
    removeDataProperties(dataPropertiesRemove);

    //console.log(store.toNT());
    writeOntology("./prueba.ttl");

}

function createPrefix(prefix){
    var names = Object.keys(prefix);
    names.forEach(name => {
        prefixes.set(name, prefix[name]);
    });
}

function updateMetadata(information){
    var actualVersion = information['version'];
    //Prior Version
    var priorVersion = store.any($rdf.sym(ontology), $rdf.sym('http://www.w3.org/2002/07/owl#versionIRI'),undefined)['value'];
    //Remove information which is outdated
    //dcterms:modified 
    store.removeMatches($rdf.sym(ontology), $rdf.sym('http://www.w3.org/2002/07/owl#versionInfo'), undefined);
    store.removeMatches($rdf.sym(ontology), $rdf.sym('http://www.w3.org/2002/07/owl#versionIRI'), undefined);
    store.removeMatches($rdf.sym(ontology), $rdf.sym('http://www.w3.org/2002/07/owl#priorVersion'), undefined);
    store.removeMatches($rdf.sym(ontology), $rdf.sym('http://purl.org/dc/terms/modified'), undefined);
    //Update information
    var actualDate = new Date();
    store.add($rdf.sym(ontology),$rdf.sym('http://www.w3.org/2002/07/owl#versionInfo'),actualVersion);
    store.add($rdf.sym(ontology),$rdf.sym('http://www.w3.org/2002/07/owl#versionIRI'),$rdf.sym('http://www.studyroomsmadrid.es/studyRoom/ontology/studyOnt/'+actualVersion));
    store.add($rdf.sym(ontology), $rdf.sym('http://www.w3.org/2002/07/owl#priorVersion'),$rdf.sym(priorVersion));
    store.add($rdf.sym(ontology), $rdf.sym('http://purl.org/dc/terms/modified'), `${actualDate.getFullYear()}-${actualDate.getMonth()+1}-${actualDate.getDate()}`);

    /*
    var metadata = store.statementsMatching($rdf.sym(ontology), undefined, undefined);
    for (var i=0; i<metadata.length;i++) {
        friend = metadata[i]
        console.log(friend.predicate.value);
        console.log(friend.object.value);
    }
    */
}

function updateClasses(classes){
    var classes_names = Object.keys(classes);
    var pos;
    var className;
    var prefix;
    classes_names.forEach(name => {
        pos = name.search(':');
        if(pos!=-1){//The class has a prefix
            prefix = prefixes.get(name.substring(0,pos));
            if(prefix != undefined){//The prefix is defined
                className = $rdf.sym(`${prefix}${name.substring(pos+1)}`);
            }
            else{//The prefix is undefined
                console.log(`Prefix ${name.substring(0,pos)} is not defined`);
                //Add the class with the default
                className = $rdf.sym(`${ontology}${name}`);
            }
        }
        else{//The class has not a prefix
            //Add the class with the default
            className = $rdf.sym(`${ontology}${name}`);
        }
        //Add the class
        store.add(className,$rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),$rdf.sym('http://www.w3.org/2002/07/owl#Class'));
        var class_metadata = classes[name];
        if(class_metadata != null){
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
        
    });

}

function updateObjectProperties(objectProperties){
    var objectProperties_names = Object.keys(objectProperties);
    var className;
    var prefix;
    var domainRange;
    objectProperties_names.forEach(name => {
        pos = name.search(':');
        if(pos!=-1){//The class has a prefix
            prefix = prefixes.get(name.substring(0,pos));
            if(prefix != undefined){//The prefix is defined
                className = $rdf.sym(`${prefix}${name.substring(pos+1)}`);
            }
            else{//The prefix is undefined
                console.log(`Prefix ${name.substring(0,pos)} is not defined`);
                //Add the class with the default
                className = $rdf.sym(`${ontology}${name}`);
            }
        }
        else{//The class has not a prefix
            //Add the class with the default
            className = $rdf.sym(`${ontology}${name}`);
        }
        store.add(className,$rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),$rdf.sym('http://www.w3.org/2002/07/owl#ObjectProperty'));

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
                        domainRange = $rdf.sym(`${prefix}${domainRange.substring(pos+1)}`);
                    }
                    else{//The prefix is undefined
                        console.log(`Prefix ${domainRange.substring(0,pos)} is not defined`);
                        //Add the class with the default
                        className = $rdf.sym(`${ontology}${domainRange}`);
                    }
                }
                else{//The class has not a prefix
                    //Add the class with the default
                    domainRange = $rdf.sym(`${ontology}${domainRange}`);
                }
                store.add(className,$rdf.sym('http://www.w3.org/2000/01/rdf-schema#domain'),$rdf.sym(domainRange));
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
                        domainRange = $rdf.sym(`${prefix}${domainRange.substring(pos+1)}`);
                    }
                    else{//The prefix is undefined
                        console.log(`Prefix ${domainRange.substring(0,pos)} is not defined`);
                        //Add the class with the default
                        className = $rdf.sym(`${ontology}${domainRange}`);
                    }
                }
                else{//The class has not a prefix
                    //Add the class with the default
                    domainRange = $rdf.sym(`${ontology}${domainRange}`);
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
        
    });
}

function updateDataProperties(dataProperties){
    var dataProperties_names = Object.keys(dataProperties);
    var className;
    var prefix;
    var domainRange;
    dataProperties_names.forEach(name => {
        pos = name.search(':');
        if(pos!=-1){//The class has a prefix
            prefix = prefixes.get(name.substring(0,pos));
            if(prefix != undefined){//The prefix is defined
                className = $rdf.sym(`${prefix}${name.substring(pos+1)}`);
            }
            else{//The prefix is undefined
                console.log(`Prefix ${name.substring(0,pos)} is not defined`);
                //Add the class with the default
                className = $rdf.sym(`${ontology}${name}`);
            }
        }
        else{//The class has not a prefix
            //Add the class with the default
            className = $rdf.sym(`${ontology}${name}`);
        }
        store.add(className,$rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),$rdf.sym('http://www.w3.org/2002/07/owl#DatatypeProperty'));

        var class_metadata = dataProperties[name];
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
                        domainRange = $rdf.sym(`${prefix}${domainRange.substring(pos+1)}`);
                    }
                    else{//The prefix is undefined
                        console.log(`Prefix ${domainRange.substring(0,pos)} is not defined`);
                        //Add the class with the default
                        className = $rdf.sym(`${ontology}${domainRange}`);
                    }
                }
                else{//The class has not a prefix
                    //Add the class with the default
                    domainRange = $rdf.sym(`${ontology}${domainRange}`);
                }
                store.add(className,$rdf.sym('http://www.w3.org/2000/01/rdf-schema#domain'),$rdf.sym(domainRange));
            }
            //object property range
            if(class_metadata["range"] == undefined || class_metadata["range"] == null){
                console.log(`${name} has not "range" defined`);
            }
            else{
                store.add(className,$rdf.sym('http://www.w3.org/2000/01/rdf-schema#range'),$rdf.sym(`http://www.w3.org/2001/XMLSchema#${class_metadata["range"]}`));
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
    });  
}

function removeClasses(classesRemove){
    var classes_names = Object.keys(classesRemove);
    var pos;
    var prefix;
    var className;
    classes_names.forEach(name => {
        pos = name.search(':');
        if(pos!=-1){//The class has a prefix
            prefix = prefixes.get(name.substring(0,pos));
            if(prefix != undefined){//The prefix is defined
                className = $rdf.sym(`${prefix}${name.substring(pos+1)}`);
            }
            else{//The prefix is undefined
                console.log(`Prefix ${name.substring(0,pos)} is not defined`);
                //Add the class with the default
                className = $rdf.sym(`${ontology}${name}`);
            }
        }
        else{//The class has not a prefix
            //Add the class with the default
            className = $rdf.sym(`${ontology}${name}`);
        }
        //Remove the class
        store.removeMatches(className, undefined, undefined);
    });
}

function removeObjectProperties(objectPropertiesRemove){
    var objectProperties_names = Object.keys(objectPropertiesRemove);
    var pos;
    var prefix;
    var objectProperties_name;
    objectProperties_names.forEach(name => {
        pos = name.search(':');
        if(pos!=-1){//The class has a prefix
            prefix = prefixes.get(name.substring(0,pos));
            if(prefix != undefined){//The prefix is defined
                objectProperties_name = $rdf.sym(`${prefix}${name.substring(pos+1)}`);
            }
            else{//The prefix is undefined
                console.log(`Prefix ${name.substring(0,pos)} is not defined`);
                //Add the class with the default
                objectProperties_name = $rdf.sym(`${ontology}${name}`);
            }
        }
        else{//The class has not a prefix
            //Add the class with the default
            objectProperties_name = $rdf.sym(`${ontology}${name}`);
        }
        //Remove the class
        store.removeMatches(objectProperties_name, undefined, undefined);
    });
}

function removeDataProperties(dataPropertiesRemove){
    var dataProperties_names = Object.keys(dataPropertiesRemove);
    var pos;
    var prefix;
    var dataProperties_name;
    dataProperties_names.forEach(name => {
        pos = name.search(':');
        if(pos!=-1){//The class has a prefix
            prefix = prefixes.get(name.substring(0,pos));
            if(prefix != undefined){//The prefix is defined
                dataProperties_name = $rdf.sym(`${prefix}${name.substring(pos+1)}`);
            }
            else{//The prefix is undefined
                console.log(`Prefix ${name.substring(0,pos)} is not defined`);
                //Add the class with the default
                dataProperties_name = $rdf.sym(`${ontology}${name}`);
            }
        }
        else{//The class has not a prefix
            //Add the class with the default
            dataProperties_name = $rdf.sym(`${ontology}${name}`);
        }
        //Remove the class
        store.removeMatches(dataProperties_name, undefined, undefined);
    });
}

function writeOntology(ontologyPath){
    fs.writeFile(ontologyPath, store.toNT() , function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('The ttl file has been created successfully');
        }
      });
}
    