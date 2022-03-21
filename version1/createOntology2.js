const fs = require('fs');
const yaml = require('js-yaml');
const $rdf = require('rdflib');
const { exec } = require("child_process");

var store = $rdf.graph();
var ontology;
var prefixes = new Map();

function createOntology(templatePath){
    var fileContents = fs.readFileSync(templatePath, 'utf8');
    var data = yaml.loadAll(fileContents);
    
    //Read metadata
    var information = data[0];
    
    ontology = information['ontology'];
    //ontology
    if(ontology == undefined || ontology == null){
        console.log("ontology is undefined");
        process.exit(-1);
    }

    createMetadata(information);

    //Read prefixes
    var prefix = data[1];
    createPrefix(prefix);

    //Read classes
    var classes = data[2];
    createClasses(classes);


    //Read object properties
    var objectProperties = data[3];
    createObjectProperties(objectProperties);

    //Read data properties
    var dataProperties = data[4];
    createDataProperties(dataProperties);

    //writeOntology("./pruebaCreateOntology.ttl");

    //Read create Repo
    var repo = data[5];
    createRepo(repo);

}

function createPrefix(prefix){
    var names = Object.keys(prefix);
    names.forEach(name => {
        prefixes.set(name, prefix[name]);
    });
}

function createMetadata(metadata){

    store.add($rdf.sym(ontology),$rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),$rdf.sym('http://www.w3.org/2002/07/owl#Ontology'));
    
    //license
    if(metadata["license"] == undefined || metadata["license"] == null){
        console.log("License is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/license'),$rdf.sym(metadata["license"]));
    }
    
    //creator
    if(metadata["creator"] == undefined || metadata["creator"] == null){
        console.log("creator is undefined");
    }
    else{
        metadata["creator"].split(',').forEach(element =>{
            store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/creator'),`${element.trim()}`);
        });
    }

    //contributor
    if(metadata["contributor"] == undefined || metadata["contributor"] == null){
        console.log("contributor is undefined");
    }    
    else{
        metadata["contributor"].split(',').forEach(element =>{
            store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/contributor'),`${element.trim()}`);
        });
    }
    
    //prefix
    if(metadata["prefix"] == undefined || metadata["prefix"] == null){
        console.log("prefix is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/vocab/vann/preferredNamespacePrefix'),`${metadata["prefix"]}`);
    }
    
    //title
    if(metadata["title"] == undefined || metadata["title"] == null){
        console.log("title is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/title'),`${metadata["title"]}`);
    }
    
    //description
    if(metadata["description"] == undefined || metadata["description"] == null){
        console.log("description is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/description'),`${metadata["description"]}`);
    }
    
    //citation
    if(metadata["citation"] == undefined || metadata["citation"] == null){
        console.log("citation is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/bibliographicCitation'),`${metadata["citation"]}`);
    }
    
    //version
    if(metadata["version"] == undefined || metadata["version"] == null){
        console.log("version is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://www.w3.org/2002/07/owl#versionInfo'),`${metadata["version"]}`);
        store.add($rdf.sym(ontology),$rdf.sym('http://www.w3.org/2002/07/owl#versionIRI'),$rdf.sym(`${ontology}/${metadata["version"]}`));
    }
    
    //abstract
    if(metadata["abstract"] == undefined || metadata["abstract"] == null){
        console.log("abstract is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/abstract'),`${metadata["abstract"]}`);
    }
    
    //see also
    if(metadata["see also"] == undefined || metadata["see also"] == null){
        console.log("see also is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://www.w3.org/2000/01/rdf-schema#seeAlso'),`${metadata["see also"]}`);
    }
    
    //status
    if(metadata["status"] == undefined || metadata["status"] == null){
        console.log("status is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://www.w3.org/2003/06/sw-vocab-status/ns#status'),`${metadata["status"]}`);
    }
    
    //backward compatibility
    if(metadata["backward compatibility"] == undefined || metadata["backward compatibility"] == null){
        console.log("backward compatibility is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://www.w3.org/2002/07/owl#backwardCompatibility'),`${metadata["backward compatibility"]}`);
    }
    
    //incompatibility
    if(metadata["incompatibility"] == undefined || metadata["incompatibility"] == null){
        console.log("incompatibility is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://www.w3.org/2002/07/owl#incompatibleWith'),`${metadata["incompatibility"]}`);
    }
    
    //issued date
    if(metadata["issued date"] == undefined || metadata["issued date"] == null){
        console.log("issued date is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/issued'),`${metadata["issued date"]}`);
    }
    
    //source
    if(metadata["source"] == undefined || metadata["source"] == null){
        console.log("source is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/source'),`${metadata["source"]}`);
    }
    
    //publisher
    if(metadata["publisher"] == undefined || metadata["publisher"] == null){
        console.log("publisher is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/published'),`${metadata["publisher"]}`);
    }
    
    //DOI
    if(metadata["DOI"] == undefined || metadata["DOI"] == null){
        console.log("DOI is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/ontology/bibo/doi'),`${metadata["DOI"]}`);
    }
    
    //logo
    if(metadata["logo"] == undefined || metadata["logo"] == null){
        console.log("logo is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://xmlns.com/foaf/0.1/logo'),`${metadata["logo"]}`);
    }
    
    //diagram
    if(metadata["diagram"] == undefined || metadata["diagram"] == null){
        console.log("diagram is undefined");
    }
    else{
        store.add($rdf.sym(ontology),$rdf.sym('http://xmlns.com/foaf/0.1/depiction'),`${metadata["diagram"]}`);
    }
    //Fields which are filled automatically
    var actualDate = new Date();
    store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/created'),`${actualDate.getFullYear()}-${actualDate.getMonth()+1}-${actualDate.getDate()}`);
    store.add($rdf.sym(ontology),$rdf.sym('http://www.w3.org/2002/07/owl#priorVersion')," ");
    store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/vocab/vann/preferredNamespaceUri'),$rdf.sym(ontology));
    store.add($rdf.sym(ontology),$rdf.sym('http://purl.org/dc/terms/modified'),`${actualDate.getFullYear()}-${actualDate.getMonth()+1}-${actualDate.getDate()}`);
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

function createDataProperties(dataProperties){
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

function createRepo(repo){
    //ontologyPath is mandatory
    var ontologyPath = repo["ontology local path"];
    if(ontologyPath == undefined || ontologyPath == null){
        console.log("ontology local path is undefined");
        process.exit(-1);
    }

    //If local path is defined, the folders are going to be created
    var localPath = repo["repository local path"];
    if(localPath != undefined && localPath != null){
        
        if (fs.existsSync(localPath)) { //Check if the path exists
            //Create the folder structure
            var commands = [`cd ${localPath}`]
            var folders = repo["folder"];
            var names = Object.keys(folders);
            names.forEach(name => {
                if(folders[name] == 'y'){
                    commands.push(`mkdir ${name}`);
                }
            });
            var command = commands.join(" & ");
            command = command.replace("&","&&");

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: Folders succesfully created`);
                writeOntology(ontologyPath);
                uploadOntology(localPath,repo["repository github url"]);
            });   
        }
        else{
            console.log(`No such directory ${localPath}`);
            process.exit(-1);
        }

    }
    else{
        console.log("Local path is not defined, the folders are not going to be created");
        writeOntology(ontologyPath);
    }
    


}

function writeOntology(ontologyPath){
    fs.writeFile(ontologyPath, store.toNT().slice(1,-1) , function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('The ttl file has been created successfully');
        }
      });
}

function uploadOntology(localPath, url){
    if(url == undefined || url == null){
        console.log("Url is not defined. It is not possible to upload the repositoy to github");
    }
    else{
        var command = `cd ${localPath} && git init -b master && git add . && git commit -m "Initial Commit" && git remote add origin ${url} && git push origin master`;
        exec(command, (error, stdout, stderr) => {
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

module.exports.createOntology = createOntology;
    