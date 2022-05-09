//const N3 = require('n3');
import N3 from 'n3'

//const fs = require('fs-extra');
import fs from 'fs-extra'

//const yaml = require('js-yaml');
import yaml from 'js-yaml'

//var rimraf = require("rimraf");
import rimraf from 'rimraf'

const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;

//const { exec } = require("child_process");
import child_process from 'child_process'
const { exec } = child_process;

var parser = new N3.Parser();
var writer = new N3.Writer();
var store = new N3.Store();
var ontology;
var newVersion;
var oldVersion;
//updateOntology('./templates/updateOntology.yaml')

export default function updateOntology(templatePath) {
    var fileContents = fs.readFileSync(templatePath, 'utf8');
    var data = yaml.loadAll(fileContents);

    //Read metadata
    var information = data[0];

    //If the camp "ontology previous version local path" is undefined terminate execution
    var ontologyPath = information["ontology previous version local path"];
    if (ontologyPath == undefined || ontologyPath == null) {
        console.log('Camp "ontology previous version local path" is undefined');
        console.log('Execution terminated');
        process.exit(-1);
    }

    if (!fs.existsSync(ontologyPath)) {
        console.log(`Path ${ontologyPath} does not exist`);
        console.log('Execution terminated');
        process.exit(-1);
    }

    //Read the last version of the ontology
    readOntology(ontologyPath).then(writer => updateMetadata(information));


    //ontology = store.any(undefined, $rdf.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),$rdf.sym('http://www.w3.org/2002/07/owl#Ontology'))['value'];
    //updateMetadata(information);
}

/*
async function readOntology(ontologyPath){
    return new Promise((resolve, reject) => {
        const textStream = fs.createReadStream(ontologyPath);
        rdfParser.parse(textStream, { contentType: 'text/turtle'})
            .on('data', (quad) => writer.addQuad(quad), (prefixes) => console.log(prefixes))
            .on('error', (error) => console.error(error))
            .on('end', () => imprimirQUADS());
    });
}
*/

async function readOntology(ontologyPath) {
    return new Promise((resolve, reject) => {
        var fileContents = fs.readFileSync(ontologyPath, 'utf8');
        var quads = [];

        parser.parse(fileContents, (error, quad, prefixes) => {
            if (quad) {
                //console.log(quad);
                quads.push(quad);
                //console.log(quad.predicate.id);
                if(quad.predicate.id == 'http://www.w3.org/2002/07/owl#versionInfo'){
                    oldVersion = quad.object.id.slice(1, -1);
                }
                //writer.addQuad(quad);
            }
            else {
                writer.addPrefixes(prefixes);
                //console.log(quads);
                store.addQuads(quads);
                //writer.addQuads(quads);
                //console.log("# That's all, folks!", prefixes);
            }
        });
        //writer.list
        return resolve(writer);
    });
}

function updateMetadata(information) {
    newVersion = information['new version'];
    //Get ontology URI
    ontology = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Ontology'))[0].subject.id;
    //Get ontology prior version
    var priorVersion = store.getQuads(namedNode(ontology), namedNode('http://www.w3.org/2002/07/owl#versionIRI'), null)[0].object.id;

    //Remove ontology metadataiwhich is outdated
    store.removeQuads(store.getQuads(namedNode(ontology), namedNode('http://www.w3.org/2002/07/owl#versionInfo'), null));
    store.removeQuads(store.getQuads(namedNode(ontology), namedNode('http://www.w3.org/2002/07/owl#versionIRI'), null));
    store.removeQuads(store.getQuads(namedNode(ontology), namedNode('http://www.w3.org/2002/07/owl#priorVersion'), null));
    store.removeQuads(store.getQuads(namedNode(ontology), namedNode('http://purl.org/dc/terms/modified'), null));

    //Update ontology metadata
    var actualDate = new Date();
    var aux = ontology;
    if (ontology.slice(-1) == '#' || ontology.slice(-1) == '/') {
        aux = ontology.slice(0, -1)
    }
    store.addQuad(quad(
        namedNode(ontology),
        namedNode('http://www.w3.org/2002/07/owl#versionInfo'),
        literal(newVersion)
    ));
    store.addQuad(
        namedNode(ontology),
        namedNode('http://www.w3.org/2002/07/owl#versionIRI'),
        namedNode(`${aux}/${newVersion}`)
    );
    store.addQuad(
        namedNode(ontology),
        namedNode('http://www.w3.org/2002/07/owl#priorVersion'),
        namedNode(priorVersion)
    );
    store.addQuad(quad(
        namedNode(ontology),
        namedNode('http://purl.org/dc/terms/modified'),
        literal(`${actualDate.getFullYear()}-${actualDate.getMonth() + 1}-${actualDate.getDate()}`)
    ));

    //write changes    
    for (const quad of store) {
        writer.addQuad(quad);
        //console.log(quad.subject.id+' '+quad.predicate.id+' '+quad.object.id);
    }

    //Create new folder in release with the new version and copy that folder to current
    updateRepo(information['ontology previous version local path'], information['github username'], information['github email']);

}

function updateRepo(localPath, username, email) {
    //If local path is defined, the folders are going to be created
    if (localPath != undefined && localPath != null) {
        //Check if the path exists
        if (fs.existsSync(localPath)) {
            //Create the new folder in release
            fs.mkdirSync(`${localPath}/../../../Release/${oldVersion}`, { recursive: true }, (err) => {
                if (err) {
                    console.log(err);
                };
            });
            fs.copy(`${localPath}/../..`, `${localPath}/../../../Release/${oldVersion}`, (err) => {
                if (err) {
                    console.log("Error Found:", err);
        
                }
                else {
                    console.log('File copied succesfully');
                    emptyDirectory(`${localPath}/../..`)
                        .then(function(){
                            writeNewFiles(localPath)
                                .then(function(){
                                    uploadOntology(localPath, username, email);
                                })
                                .catch(function(){
                                    console.log('Error al crear los directorios dentro de current');
                                });
                        })
                        .catch(function(){
                            console.log('Error al vaciar el directorio Current');
                        });
        
                }
            });
            /*
            copyCurrentVersion(`${localPath}/../..`,`${localPath}/../../../Release/${oldVersion}`)
                .then(function(){
                    emptyDirectory(`${localPath}/../..`);
                })
                .catch(function(){
                    console.log('error en la copia');
                });
/*
            writeNewFiles(localPath, newVersion)
                .then(function () {
                    copyCurrentVersion(`${localPath}/../../../Release/${newVersion}`, `${localPath}/../..`)
                        .then(function () {
                            uploadOntology(`${localPath}/../../../`, username, email);
                        })
                        .catch(function () {
                            console.log('error en la copia');
                        });
                })
                .catch(function () {
                    console.log('error al escribir los archivos en release');
                });
            //.then(uploadOntology(`${localPath}/../../../`, username, email));
            */
        }
        else {
            console.log(`The directory ${localPath} does not exists. The repository can not be stored in that path`);
            console.log('Execution terminated');
            process.exit(-1);
        }
    }
    else {
        console.log("The camp 'ontology previous version local path' is not defined. The repository is not going to be updated");
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

function writeNewFiles(localPath) {
    return new Promise((resolve, reject) => {
        //Create folders in Current
        fs.mkdirSync(`${localPath}/../../../Current/Ontology`, { recursive: true }, (err) => {
            if (err) {
                console.log(err);
            };
        });
        fs.mkdirSync(`${localPath}/../../../Current/Diagrams`, (err) => {
            if (err) {
                console.log(err);
            };
        });
        fs.mkdirSync(`${localPath}/../../../Current/Test`, (err) => {
            if (err) {
                console.log(err);
            };
        });
        fs.mkdirSync(`${localPath}/../../../Current/Documentation`, (err) => {
            if (err) {
                console.log(err);
            };
        });
        fs.mkdirSync(`${localPath}/../../../Current/Requirements`, (err) => {
            if (err) {
                console.log(err);
            };
        });
        fs.mkdirSync(`${localPath}/../../../Current/Requirements/ORSD`, (err) => {
            if (err) {
                console.log(err);
            };
        });
        fs.mkdirSync(`${localPath}/../../../Current/Requirements/finalVersion`, (err) => {
            if (err) {
                console.log(err);
            };
        });
        fs.mkdirSync(`${localPath}/../../../Current/Requirements/testSuite`, (err) => {
            if (err) {
                console.log(err);
            };
        });

        //Create README.md in each subfolder of Current
        var text = '#Ontology\n Para guardar el ttl con la ontología'
        console.log(`${localPath}/../../../Current/Ontology/README.md`);
        writeREADME(`${localPath}/../../../Current/Ontology/README.md`, text);

        text = '#Diagrams\n Para guardar imagenes con los diagramas'
        writeREADME(`${localPath}/../../../Current/Diagrams/README.md`, text);

        text = '#Test\n Para guardar las sparql queries de ejemplo'
        writeREADME(`${localPath}/../../../Current/Test/README.md`, text);

        text = '#Documentation\n Documentacion html'
        writeREADME(`${localPath}/../../../Current/Documentation/README.md`, text);

        text = '#Requirements\n Se almacenara todo lo que incluyan los requirements'
        writeREADME(`${localPath}/../../../Current/Requirements/README.md`, text);

        //Create README.md in each subfolder of Requirements
        text = '#ORSD\n Se almacenara el ORSD'
        writeREADME(`${localPath}/../../../Current/Requirements/ORSD/README.md`, text);

        text = '#Requirements Final Version\n Se almacenara la version final de los requirements'
        writeREADME(`${localPath}/../../../Current/Requirements/finalVersion/README.md`, text);

        text = '#Test Suite\n Se almacenara los test suites'
        writeREADME(`${localPath}/../../../Current/Requirements/testSuite/README.md`, text);

        //Write ontology in the folder release
        writeOntology(`${localPath}/../../../Current/Ontology/ontology.ttl`);

        resolve();

    });
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

function emptyDirectory(directory) {
    return new Promise((resolve, reject) => {
        //remove directory
        rimraf(directory, function () {
            //create empty directory
            fs.mkdirSync(directory, (err) => {
                if (err) {
                    console.log(err);
                };
            });
        });
        setTimeout(() => {
            resolve();
        }, 1000);
    });

}

function uploadOntology(localPath, username, email) {
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
    exec(`cd ${localPath}/../../../ && git add . && git commit -m "commit" && git push`, (error, stdout, stderr) => {
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

function imprimirQUADS() {
    writer.end((error, result) => console.log(result));
}