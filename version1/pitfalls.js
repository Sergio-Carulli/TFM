
import fs from 'fs';
import N3 from 'n3';
import { NamedNode } from 'n3';

const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;
var parser = new N3.Parser();
var store = new N3.Store();
var prefix;
var log = [];
var fileContents;


if(process.argv.length != 3){
    console.log("The number of arguments is incorrect");
    console.log("The number of arguments must be 3");
    console.log('Execution terminated');
    process.exit(-1);
}

var ontologyPath = process.argv[2];
if(!fs.existsSync(ontologyPath)){
    console.log(`The file ${ontologyPath} does not exist`);
    console.log('Execution terminated');
    process.exit(-1);
  }
else{
    pitfalls(ontologyPath);
}

/*
var ontologyPath = '../../../../pruebaPitfalls/P06.ttl';
pitfalls(ontologyPath);
*/
async function pitfalls(ontologyPath) {
    await readOntology(ontologyPath);
    P02();
    P04();
    P05();
    P06();
    P07();
    P08();
    P10();
    P11();
    P12();
    P13();
    P19();
    P20();
    P21();
    P22();
    P24();
    P25();
    P26();
    P27();
    P28();
    P29();
    P32();
    P34();
    P35();
    P36();
    P38();
    P41();
    setTimeout(() => {
        writeLog('./logs/');
    }, 2000);
}

Array.prototype.equals = function (getArray) {
    if (this.length != getArray.length) return false;
    for (var i = 0; i < getArray.length; i++) {
        if (this[i] instanceof Array && getArray[i] instanceof Array) {
            if (!this[i].equals(getArray[i])) return false;
        } else if (this[i] != getArray[i]) {
            return false;
        }
    }
    return true;
};

function getSubjects(quads) {
    var quad = [];
    if (quads.length != 0) {
        quads.forEach(element => {
            quad.push(element.subject.id);
        })
    }
    return quad;
}

function getObjects(quads) {
    var quad = [];
    if (quads.length != 0) {
        quads.forEach(element => {
            quad.push(element.object.id);
        })
    }
    return quad;
}

//Return true if contain mayus in a character which is not the first
//otherwise false
function containMayus(getString) {
    var count = 0;
    for (var i = 1; i < getString.length; i++) {
        if (getString[i] == getString[i].toUpperCase() && getString[i] != getString[i].toLowerCase()) {
            count++;
        }
    }
    return count != 0;
}


//Each position of array correspond to properties which are equivalent
function getEquivalentProperties() {
    var array = [];
    var equivalentProperties = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#equivalentProperty'), null);
    if (equivalentProperties.length) {
        equivalentProperties.forEach(element => {
            array.push([element.subject.id, element.object.id]);
        });
        var i = 0;
        while (i + 1 < array.length) {
            array.concat
            var j = 0;
            while (j < array[i + 1].length) {
                if (array[i].includes(array[i + 1][j])) {
                    array[i] = array[i].concat(array[i + 1]);
                    array.splice(i + 1, 1);

                    i--;
                    break;
                }
                j++;
            }
            i++;
        }
    }
    return array;
}

//Each position of array correspond to properties which are subProperty
function getSubProperties() {
    var array = [];
    var subProperties = store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#subPropertyOf'), null);
    if (subProperties.length) {
        subProperties.forEach(element => {
            array.push([element.subject.id, element.object.id]);
        });

        var i = 0;
        while (i + 1 < array.length) {
            array.concat
            var j = 0;
            while (j < array[i + 1].length) {
                if (array[i].includes(array[i + 1][j])) {
                    array[i] = array[i].concat(array[i + 1]);
                    array.splice(i + 1, 1);

                    i--;
                    break;
                }
                j++;
            }
            i++;
        }
    }
    return array;
}


function P02() {
    var equivalentClasses = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), null);
    if (equivalentClasses.length) {
        var aux, pref1, pref2;
        equivalentClasses.forEach(element => {
            //get subject prefix
            aux = element.subject.id.indexOf('#');
            if (aux == -1) {
                aux = element.subject.id.lastIndexOf('/');
            }
            pref1 = element.subject.id.substring(0, aux);

            //get object prefix
            aux = element.object.id.indexOf('#');
            if (aux == -1) {
                aux = element.object.id.lastIndexOf('/');
            }
            pref2 = element.object.id.substring(0, aux);
            if (pref1 == pref2) {
                log.push(`Pitfall P02: Classes ${element.subject.id} and ${element.object.id} are defined as owl:equivalentClass and both classes are defined in the same namespace`);
            }
        });
    }
}

function P04() {
    var classes = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Class'));
    if (classes.length) {
        var subclass, equivalentClass, domain, range;
        classes.forEach(element => {
            subclass = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2000/01/rdf-schema#subClassOf'), null);
            if (!subclass.length) {
                subclass = store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#subClassOf'), namedNode(element.subject.id));
                if (!subclass.length) {
                    equivalentClass = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), null);
                    if (!equivalentClass.length) {
                        equivalentClass = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(element.subject.id));
                        if (!equivalentClass.length) {
                            domain = store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), namedNode(element.subject.id));
                            if (!domain.length) {
                                range = store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#range'), namedNode(element.subject.id));
                                if (!range.length) {
                                    log.push(`Pitfall P04: Class ${element.subject.id} is not connected with other element in the ontology`);
                                }
                            }
                        }
                    }
                }
            }
        });

    }

}


function P05() {
    var inverseProperties = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#inverseOf'), null);
    if (inverseProperties.length) {
        var p1, p2;
        inverseProperties.forEach(element => {
            //check domains
            p1 = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
            p2 = store.getQuads(namedNode(element.object.id), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
            if (p1.length && p2.length) {
                p1.forEach(c1 => {
                    p2.forEach(c2 => {
                        if (c1.object.id != c2.object.id) {
                            log.push(`Pitfall P05 (Pattern A): the domain of ${element.subject.id} and the range of its inverse object property ${element.object.id} are
                            defined but they do not match each other`);
                        }
                    })
                })
            }

            //check ranges
            p1 = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
            p2 = store.getQuads(namedNode(element.object.id), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
            if (p1.length && p2.length) {
                p1.forEach(c1 => {
                    p2.forEach(c2 => {
                        if (c1.object.id != c2.object.id) {
                            log.push(`Pitfall P05 (Pattern B):the range of ${element.subject.id} and the domain of its inverse object property ${element.object.id} are 
                            defined but they do not match each other`);
                        }
                    });
                });
            }

        });
    }
}

function detectCycles(c, subclasses) {
    var subclass = store.getQuads(namedNode(c), namedNode('http://www.w3.org/2000/01/rdf-schema#subClassOf'), null);
    if (subclass.length) {
        subclass.forEach(element => { 
            if (subclasses.includes(element.object.id)) {
                log.push(`Pitfall P06: Class ${element.object.id} appears in the list of its superclasses`);
                return;
            }
            else {
                //In nodejs if que assign a variable to an array we are creating a reference to that array.
                //We have to copy the content of the array with the function slide.
                var aux = subclasses.slice();
                aux.push(element.object.id);
                detectCycles(element.object.id, aux);
            }
        });
        return;
    }
    else {
        return;
    }

}

function P06() {
    var classes = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Class'));
    if (classes.length) {
        classes.forEach(element => {
            detectCycles(element.subject.id, [element.subject.id]);
        });
    }

}


function P07() {
    var classes = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Class'));
    if (classes.length) {
        var aux, name;
        classes.forEach(element => {
            //Get names
            aux = element.subject.id.indexOf('#');
            if (aux == -1) {
                aux = element.subject.id.lastIndexOf('/');
            }
            name = element.subject.id.substring(aux + 1);
            if (name.includes('and') || name.includes('And')) {
                log.push(`Pitfall P07 (Pattern A): Class ${element.subject.id} contains the copulative conjunction “and”`);
            }
            else if (name.includes('or') || name.includes('Or')) {
                log.push(`Pitfall P07 (Pattern B): Class ${element.subject.id} contains the disjunctive conjunction “or”`);
            }
        })
    }
}

function P08_aux(ontologyElements, name) {
    if (ontologyElements.length) {
        var annotation;
        ontologyElements.forEach(element => {
            //check label
            annotation = store.getQuads(element.subject.id, namedNode('http://www.w3.org/2000/01/rdf-schema#label'), null);
            if (!annotation.length) {
                log.push(`Pitfall P08 (Pattern A): ${name} ${element.subject.id} lacks an
                rdfs:label annotation`);
            }

            //check comment
            annotation = store.getQuads(element.subject.id, namedNode('http://www.w3.org/2000/01/rdf-schema#comment'), null);
            if (!annotation.length) {
                log.push(`Pitfall P08 (Pattern B): ${name} ${element.subject.id} lacks an
                rdfs:comment annotation`);
            }
        });
    }
}

function P08() {
    var classes = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Class'));
    var dataProperties = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#DatatypeProperty'));
    var objectProperties = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty'));

    P08_aux(classes, 'Class');
    P08_aux(objectProperties, 'Object Property');
    P08_aux(dataProperties, 'Data Property');

}

function P10() {
    var aux = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#disjointWith'), null);
    if (!aux.length) {
        aux = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#AllDisjointClasses'), null);
        if (!aux.length) {
            aux = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#disjointUnionOf'), null);
            if (!aux.length) {
                log.push(`Pitfall P10: Not disjoint axiom is found`);
            }
        }

    }

}

function P11_aux(ontologyElements, name) {
    if (ontologyElements.length) {
        var aux;
        ontologyElements.forEach(element => {
            //check domain
            aux = store.getQuads(element.subject.id, namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
            if (!aux.length) {
                log.push(`Pitfall P11 (Pattern A): ${name} ${element.subject.id} lacks domain`);
            }

            //check range
            aux = store.getQuads(element.subject.id, namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
            if (!aux.length) {
                log.push(`Pitfall P11 (Pattern B): ${name} ${element.subject.id} lacks range`);
            }
        });
    }

}

function P11() {
    var dataProperties = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#DatatypeProperty'));
    var objectProperties = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty'));

    P11_aux(objectProperties, 'Object Property');
    P11_aux(dataProperties, 'Data Property');
}

function P12_aux(ontologyElement, name, equivalentProperties, subProperties) {
    if (ontologyElement.length) {
        var aux, name1, name2;
        for (var i = 0; i < ontologyElement.length; i++) {
            for (var j = i + 1; j < ontologyElement.length; j++) {
                //Get names
                aux = ontologyElement[i].indexOf('#');
                if (aux == -1) {
                    aux = ontologyElement[i].lastIndexOf('/');
                }
                name1 = ontologyElement[i].substring(aux + 1);
                aux = ontologyElement[j].indexOf('#');
                if (aux == -1) {
                    aux = ontologyElement[j].lastIndexOf('/');
                }
                name2 = ontologyElement[j].substring(aux + 1);

                //Check pattern A
                if (name1 == name2) {
                    var equal = true;
                    if (equivalentProperties.length) {
                        equivalentProperties.forEach(eq => {
                            var contain1 = eq.includes(ontologyElement[i]);
                            var contain2 = eq.includes(ontologyElement[j]);
                            equal = ((contain1 && !contain2) || (!contain1 && contain2) || (!contain1 && !contain2)) && equal;
                        });
                    }
                    if (subProperties.length) {
                        subProperties.forEach(eq => {
                            var contain1 = eq.includes(ontologyElement[i]);
                            var contain2 = eq.includes(ontologyElement[j]);
                            equal = ((contain1 && !contain2) || (!contain1 && contain2) || (!contain1 && !contain2)) && equal;
                        });
                    }
                    if (!equivalentProperties.length && equal) {
                        log.push(`Pitfall P12 (Pattern A): ${name} ${ontologyElement[i]} and ${ontologyElement[j]} have the same identifier (in different namespaces) and
                        they are not equivalent (owl:equivalentProperty) or sub properties
                        (rdfs:subPropertyOf ) of each other`);
                    }
                }

            }
        }

    }
}

function P12() {
    var subProperties = getSubProperties();
    var equivalentProperties = getEquivalentProperties();
    var dataProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#DatatypeProperty')));
    var objectProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')));

    P12_aux(dataProperties, 'Data Property', equivalentProperties, subProperties);
    P12_aux(objectProperties, 'Object Property', equivalentProperties, subProperties);
}

function P13() {
    var objectProperties = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty'));
    if (objectProperties.length) {
        var aux;
        var suggestion = [];
        objectProperties.forEach(element => {
            //check if it is a symmetric property
            aux = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#SymmetricProperty'));
            if (!aux.length) {
                //check if it has inverse
                aux = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2002/07/owl#inverseOf'), null);
                if (!aux.length) {
                    aux = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#inverseOf'), namedNode(element.subject.id));
                    if (!aux.length) {
                        log.push(`Pitfall P13 (Pattern A): Object property ${element.subject.id} is not defined as symmetric property (owl:SymmetricProperty) and
                        does not have any inverse property defined (owl:inverseOf )`);
                        //Check if there is a possible inverse
                        if (suggestion.length) {
                            var match1, match2;
                            suggestion.forEach(suggest => {
                                //check if the first object property domain match the second object property range
                                match1 = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
                                match2 = store.getQuads(namedNode(suggest), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
                                if (match1.length && match2.length && match1[0].object.id == match2[0].object.id) {
                                    //check if the first object property range match the second object property domain
                                    match1 = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
                                    match2 = store.getQuads(namedNode(suggest), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
                                    if (match1.length && match2.length && match1[0].object.id == match2[0].object.id) {
                                        log.push(`Pitfall P13 (Pattern B): The object properties ${suggest} and ${element.subject.id} are suggested as potential inverse properties`);
                                    }
                                }

                            });

                        }
                        suggestion.push(element.subject.id);
                    }
                }

            }
        })
    }
}

function P19() {
    var dataProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#DatatypeProperty')));
    var objectProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')));
    if (objectProperties.length) {
        var domain, range, eq;
        objectProperties.forEach(element => {
            domain = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
            if (domain.length > 1) {
                for (var i = 0; i + 1 < domain.length; i++) {
                    if (domain[i].object.id != domain[i + 1].object.id) {
                        eq = store.getQuads(namedNode(domain[i].object.id), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(domain[i + 1].object.id));
                        if (!eq.length) {
                            eq = store.getQuads(namedNode(domain[i + 1].object.id), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(domain[i].object.id));
                            if (!eq.length) {
                                log.push(`Pitfall 19 (Pattern A): Object Property ${element} has more than one rdfs:domain axiom and the classes the
                                domain axioms refer to do not match`);
                            }
                        }
                    }
                }
            }
            range = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
            if (range.length > 1) {
                for (var i = 0; i + 1 < range.length; i++) {
                    if (range[i].object.id != range[i + 1].object.id) {
                        eq = store.getQuads(namedNode(range[i].object.id), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(range[i + 1].object.id));
                        if (!eq.length) {
                            eq = store.getQuads(namedNode(range[i + 1].object.id), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(range[i].object.id));
                            if (!eq.length) {
                                log.push(`Pitfall 19 (Pattern B): Object Property ${element} has more than one rdfs:range axiom and the classes the range axioms
                                refer to do not match`);
                            }
                        }
                    }
                }
            }
        });
    }

    if (dataProperties.length) {
        var domain, range, eq;
        dataProperties.forEach(element => {
            domain = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
            if (domain.length > 1) {
                for (var i = 0; i + 1 < domain.length; i++) {
                    if (domain[i].object.id != domain[i + 1].object.id) {
                        eq = store.getQuads(namedNode(domain[i].object.id), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(domain[i + 1].object.id));
                        if (!eq.length) {
                            eq = store.getQuads(namedNode(domain[i + 1].object.id), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(domain[i].object.id));
                            if (!eq.length) {
                                log.push(`Pitfall 19 (Pattern A): Data Property ${element} has more than one rdfs:domain axiom and the classes
                                the domain axioms refer to do not match`);
                            }
                        }
                    }
                }
            }
            range = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
            if (range.length > 1) {
                for (var i = 0; i + 1 < range.length; i++) {
                    if (range[i].object.id != range[i + 1].object.id) {
                        log.push(`Pitfall 19 (Pattern B): Data Property ${element} has more than one rdfs:range axiom and the datatypes the range
                        axioms refer to are not the same one`);
                    }
                }
            }
        });
    }

}

function P20_aux(ontologyElement, name) {
    var label, comment;
    if (ontologyElement.length) {
        ontologyElement.forEach(element => {
            label = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#label'), null);
            comment = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#comment'), null);
            if (label.length && comment.length) {
                if (label[0].object.id == comment[0].object.id) {
                    log.push(`Pitfall P20 (Pattern D): ${name} ${element} its rdfs:label annotation and its rdfs:comment have the same content`);
                }
                else if (label[0].object.id.length > comment[0].object.id.length) {
                    log.push(`Pitfall P20 (Pattern A): ${name} ${element} its rdfs:label annotation includes more tokens than its rdfs:comment`);
                }
            }
        })
    }
}

function P20() {
    var classes = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Class')));
    var dataProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#DatatypeProperty')));
    var objectProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')));
    P20_aux(classes, 'Class');
    P20_aux(dataProperties, 'Data Property');
    P20_aux(objectProperties, 'Object Property');
}

function P21() {
    var classes = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Class')));

    if (classes.length) {
        classes.forEach(element => {
            var aux = element[0].indexOf('#');
            if (aux == -1) {
                aux = element[0].lastIndexOf('/');
            }
            if (element.includes('other', aux)) {
                log.push(`Pitfall 21: Class ${element} contains "other"`);
            }
            if (element.includes('misc', aux)) {
                log.push(`Pitfall 21: Class ${element} contains "misc"`);
            }
            if (element.includes('miscellanea', aux)) {
                log.push(`Pitfall 21: Class ${element} contains "miscellanea"`);
            }
            if (element.includes('miscellaneous', aux)) {
                log.push(`Pitfall 21: Class ${element} contains "miscellaneous"`);
            }
            if (element.includes('miscellany', aux)) {
                log.push(`Pitfall 21: Class ${element} contains "miscellany"`);
            }
        });
    }


}

function P22() {
    var classes = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Class')));
    var dataProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#DatatypeProperty')));
    var objectProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')));

    //check naming convention (if - or _ o camel)
    //classContain[0] = if a class contains -
    //classContain[1] = if a class contains _
    //classContain[2] = if a class contains mayus which are not the first char
    //classContain[3] = if a class contains the same number of mayus and -
    //classContain[4] = if a class contains the same number of mayus and _
    var classContain = checkNaminConvention(classes, 'Class');
    var dataPropertyContain = checkNaminConvention(dataProperties, 'Data Propertys');
    var objectPropertyContain = checkNaminConvention(objectProperties, 'Object Property');

    //check if all the ontology elements use the same delimeters
    if ((classContain != dataPropertyContain && classContain != 6 && dataPropertyContain != 6) || (classContain != objectPropertyContain && classContain != 6 && objectPropertyContain != 6) || (dataPropertyContain != objectPropertyContain && dataPropertyContain != 6 && objectPropertyContain != 6)) {
        log.push(`Pitfall 22: There are ontology elements with different delimeters`);
    }
}

//Para ver si los separadores son _ , - o usar mayusculas vamos:
//Comprobar que separador se usa en las palabras compuestas
//Para ver si una palabra es compuesta vamos a contar el numero de mayusculas, si contiene - y si contiene _
//en el numero de mayusculas se tiene en cuenta si las palabras empiezan por mayuscula o no
//si un elemento tiene mas de un separador, salta la pitfall
function checkNaminConvention(ontologyElement, name) {
    //contain1 count names which contain -
    var contain1 = 0;
    //contain2 count names which contain _
    var contain2 = 0;
    //contain3 count names which contain mayus character which are not the first char
    var contain3 = 0;

    if (ontologyElement.length) {
        var aux = ontologyElement[0].indexOf('#');
        if (aux == -1) {
            aux = ontologyElement[0].lastIndexOf('/');
        }
        var character = ontologyElement[0][aux + 1];
        var minus = character == character.toLowerCase();
        for (var i = 0; i < ontologyElement.length; i++) {
            aux = ontologyElement[i].indexOf('#');
            if (aux == -1) {
                aux = ontologyElement[i].lastIndexOf('/');
            }
            character = ontologyElement[i][aux + 1];
            if ((character == character.toLowerCase()) != minus) {
                log.push(`Pitfall P22: ${name} ${ontologyElement[i]} does not start as the others elements (lowercase or uppercase)`);
            }
            if (ontologyElement[i].indexOf('-', aux) != -1) {
                contain1++;
            }
            if (ontologyElement[i].indexOf('_', aux) != -1) {
                contain2++;
            }
            if (containMayus(ontologyElement[i].substring(aux + 1))) {
                contain3++;
            }
        }
    }
    /*
    0 =  elements with - and _ (PITFALL)
    1 = elements with - and mayus (PITFALL)
    2 = elements with _ and mayus (PITFALL)
    3 = elements with just _ 
    4 = elements with just - 
    5 = elements with just mayus
    6 = no delimeters (simple words or compound words without delimeters)
    */
    if (contain1 != 0 && contain2 != 0) {
        log.push(`Pitfall 22: There are ${name} with - and _ at the same time`);
        return 0;
    }
    else if (contain1 != 0 && contain3 != 0) {
        log.push(`Pitfall 22: There are ${name} with - and mayus as delimeters at the same time`);
        return 1;
    }
    else if (contain2 != 0 && contain3 != 0) {
        log.push(`Pitfall 22: There are ${name} with _ and mayus as delimeters at the same time`);
        return 2;
    }
    else if (contain2 != 0) {
        return 3;
    }
    else if (contain1 != 0) {
        return 4;
    }
    else if (contain3 != 0) {
        return 5;
    }
    else {
        return 6;
    }
}


function P24() {
    var classes = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Class')));
    var dataProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#DatatypeProperty')));
    var objectProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')));
    if (classes.length) {
        classes.forEach(element => {
            var subclass = store.getQuads(namedNode(element), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#subClassOf'), namedNode(element));
            if (subclass.length) {
                log.push(`Pitfall P24: Class it is own rdf:subClassOf ${element}`);
            }
            var equivalent = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(element));
            if (equivalent.length) {
                log.push(`Pitfall P24: Class it is own owl:equivalentClass ${element}`);
            }
        });
    }
    if (objectProperties.length) {
        objectProperties.forEach(element => {
            var domain = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), namedNode(element));
            if (domain.length) {
                log.push(`Pitfall P24: Object property it is own rdf:domain ${element}`);
            }
            var range = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), namedNode(element));
            if (range.length) {
                log.push(`Pitfall P24: Object property it is own rdf:range ${element}`);
            }
        });
    }
    if (dataProperties.length) {
        dataProperties.forEach(element => {
            var domain = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), namedNode(element));
            if (domain.length) {
                log.push(`Pitfall P24: Data property it is own rdf:domain ${element}`);
            }
        });
    }
}

function P25() {
    var objectProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')));
    if (objectProperties.length) {
        objectProperties.forEach(element => {
            var inverse = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2002/07/owl#inverseOf'), namedNode(element));
            if (inverse.length) {
                inverse.forEach(i => {
                    log.push(`Pitfall 25: Object property ${i.subject.id} acts at the same time as subject and object in an owl:inverseOf
                    statement`);
                })
            }
        });
    }

}

function P26() {
    var symmetricProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#SymmetricProperty')));
    if (symmetricProperties.length) {
        symmetricProperties.forEach(element => {
            var subjectInverse = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2002/07/owl#inverseOf'), null);
            var objectInverse = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#inverseOf'), namedNode(element));
            //Check pattern A
            if (subjectInverse.length) {
                log.push(`Pitfalls P26 (Pattern A): Object property ${element} is defined as symmetric
                (owl:SymmetricProperty) and it acts as subject of an inverse property statement (owl:inverseOf)`);
            }

            //Check pattern B
            if (objectInverse.length) {
                log.push(`Pitfalls P26 (Pattern B): Object property ${element} is defined as symmetric
                (owl:SymmetricProperty) and it acts as object of an inverse property statement (owl:inverseOf)`);
            }
        });
    }
}

function P27() {
    var equivalentProperties = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#equivalentProperty'), null);
    if (equivalentProperties.length) {
        equivalentProperties.forEach(element => {
            var domain1 = getObjects(store.getQuads(element.subject.id, namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null));
            var domain2 = getObjects(store.getQuads(element.object.id, namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null));
            var range1 = getObjects(store.getQuads(element.subject.id, namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null));
            var range2 = getObjects(store.getQuads(element.object.id, namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null));

            //Check pattern A
            if (domain1.length && domain2.length) {
                domain1.forEach(d1 => {
                    domain2.forEach(d2 => {
                        //Check if they are the same
                        if (d1 != d2) {
                            //Check if they are equivalent
                            var eq = store.getQuads(namedNode(d1), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(d2));
                            if (!eq.length) {
                                eq = store.getQuads(namedNode(d2), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(d1));
                                if (!eq.length) {
                                    log.push(`Pitfall 27 (Pattern A): Object properties ${element.subject.id} and ${element.object.id} 
                                    are equivalent object properties (owl:equivalentProperty) and the domains of both object properties are defined but they do not match each
                                    other`);
                                }
                            }
                        }
                    });
                });
            }

            //Check pattern B
            if (range1.length && range2.length) {
                range1.forEach(r1 => {
                    range2.forEach(r2 => {
                        //Check if they are the same
                        if (r1 != r2) {
                            //Check if they are equivalent
                            var eq = store.getQuads(namedNode(r1), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(r2));
                            if (!eq.length) {
                                eq = store.getQuads(namedNode(r2), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(r1));
                                if (!eq.length) {
                                    log.push(`Pitfall 27 (Pattern B): Object properties ${element.subject.id} and ${element.object.id}
                                    are equivalent object properties (owl:equivalentProperty) and the domains of both object properties are defined but they do not match each
                                    other`);
                                }
                            }
                        }
                    });
                });
            }
        })
    }

}

function P28() {
    var symmetricProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#SymmetricProperty')));
    if (symmetricProperties.length) {
        symmetricProperties.forEach(element => {
            var domain = getObjects(store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null));
            var range = getObjects(store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null));
            if (domain.length && range.length) {
                domain.forEach(d => {
                    range.forEach(r => {
                        //Check if there are the same class
                        if (d != r) {
                            //Check if they are equivalent classes
                            var eq = store.getQuads(namedNode(d), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(r));
                            if (!eq.length) {
                                eq = store.getQuads(namedNode(r), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(d));
                                if (!eq.length) {
                                    log.push(`Pitfall 28: Object property ${element} is defined as symmetric
                                    (owl:SymmetricProperty) and its domain and range are defined and they do not match`);
                                }
                            }
                        }
                    });
                });
            }
        });

    }
}

function P29() {
    var transitiveProperties = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#TransitiveProperty'));
    if (transitiveProperties.length) {
        var domain, range;
        transitiveProperties.forEach(element => {
            domain = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
            range = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
            if (domain.length && range.length) {
                var eq;
                domain.forEach(d => {
                    range.forEach(r => {
                        if (d.object.id != r.object.id) {
                            eq = store.getQuads(namedNode(d.object.id), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(r.object.id));
                            if (!eq.length) {
                                eq = store.getQuads(namedNode(r.object.id), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(d.object.id));
                                if (!eq.length) {
                                    log.push(`Pitfall P29: Object Property ${element.subject.id} is defined as transitive
                                    (owl:TransitiveProperty) and its domain and range are defined and they do not match`);
                                }
                            }

                        }
                    });
                });
            }

        })
    }
}

function P32() {
    var classes = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Class'));
    if (classes.length) {
        var dictionary = {};
        classes.forEach(element => {
            var label = getObjects(store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2000/01/rdf-schema#label'), null));
            if (label.length) {
                if (label != '') {
                    if (dictionary[label] != undefined) {
                        log.push(`Pitfall 32: Classess ${element.subject.id} and ${dictionary[label]} have the same content in their rdfs:label
                        and they are not defined as equivalent classes (owl:equivalentClass)`);
                    }
                    dictionary[label] = element.subject.id;
                }

            }

        });
    }

}

/*
function P33(){
    var objectPropertyChain = store.getQuads(null, namedNode(), null);
    if(objectPropertyChain.length){
        console.log(objectPropertyChain);
    })
}
*/

function P34() {
    var classes = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Class')));
    var domain = store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
    var range = store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
    var subClass = store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#subClassOf'), null);
    var disjointClass = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#disjointWith'), null);
    var equivalentClass = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), null);

    //Check pattern A and C
    if (domain.length) {
        domain.forEach(element => {
            if (classes.find(el => el == element.object.id) == undefined && element.object.id != "http://www.w3.org/2002/07/owl#Thing") {
                log.push(`Pitfall P34 (pattern A and C): ${element.object.id} is not defined as a class and it appears as domain in an object or data property `);
            }
        });
    }

    //Check pattern B
    if (range.length) {
        range.forEach(element => {
            var auxObjectPorperty = getSubjects(store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')));
            if (auxObjectPorperty.find(el => el == element.subject.id) != undefined && classes.find(el => el == element.object.id) == undefined && element.object.id != "http://www.w3.org/2002/07/owl#Thing") {
                log.push(`Pitfall P34 (pattern B): ${element.object.id} is not defined as a class and it appears as range in an object property`);
            }
        });
    }

    //Check pattern D, E
    if (subClass.length) {
        subClass.forEach(element => {
            //Check pattern D
            if (classes.find(el => el == element.subject.id) == undefined && element.subject.id != "http://www.w3.org/2002/07/owl#Thing") {
                log.push(`Pitfall P34 (pattern D): ${element.subject.id} is not defined as a class and it appears as subject in an rdfs:subClassOf
                statement`);
            }
            //Check pattern E
            if (classes.find(el => el == element.object.id) == undefined && element.object.id != "http://www.w3.org/2002/07/owl#Thing") {
                log.push(`Pitfall P34 (pattern E): ${element.object.id} is not defined as a class and it appears as object in an rdfs:subClassOf
                statement`);
            }
        });
    }

    //Check pattern F, G
    if (disjointClass.length) {
        disjointClass.forEach(element => {
            //Check pattern F
            if (classes.find(el => el == element.subject.id) == undefined && element.subject.id != "http://www.w3.org/2002/07/owl#Thing") {
                log.push(`Pitfall P34 (pattern F): ${element.subject.id} is not defined as a class and it appears as subject in an owl:disjointWith
                statement`);
            }
            //Check pattern G
            if (classes.find(el => el == element.object.id) == undefined && element.object.id != "http://www.w3.org/2002/07/owl#Thing") {
                log.push(`Pitfall P34 (pattern G): ${element.object.id} is not defined as a class and it appears as object in an owl:disjointWith
                statement`);
            }
        });
    }

    //Check pattern H, I
    if (equivalentClass.length) {
        equivalentClass.forEach(element => {
            //Check pattern H
            if (classes.find(el => el == element.subject.id) == undefined && element.subject.id != "http://www.w3.org/2002/07/owl#Thing") {
                log.push(`Pitfall P34 (pattern H): ${element.subject.id} is not defined as a class and it appears as subject in an owl:equivalentClass
                statement`);
            }
            //Check pattern I
            if (classes.find(el => el == element.object.id) == undefined && element.object.id != "http://www.w3.org/2002/07/owl#Thing") {
                log.push(`Pitfall P34 (pattern I): ${element.object.id} is not defined as a class and it appears as object in an owl:equivalentClass
                statement`);
            }
        });
    }
}

function P35() {
    var objectProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')));
    //objectProperties = objectProperties.concat(getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#SymmetricProperty'))));
    //objectProperties = objectProperties.concat(getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#TransitiveProperty'))));
    var dataProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#DatatypeProperty')));
    var domain = store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
    var range = store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
    var subProperty = store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#subPropertyOf'), null);
    var disjointProperty = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#propertyDisjointWith'), null);
    var equivalentProperty = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#equivalentProperty'), null);
    var inverseProperty = store.getQuads(null, namedNode('http://www.w3.org/2002/07/owl#inverseOf'), null);
    //Check pattern A
    if (domain.length != 0) {
        domain.forEach(element => {
            if (objectProperties.find(el => el == element.subject.id) == undefined && dataProperties.find(el => el == element.subject.id) == undefined) {
                log.push(`Pitfall P35 (pattern A): ${element.subject.id} is not defined as an object property or datatype property and it has a domain
                declared`);
            }
        });
    }

    //Check pattern B and C
    if (range.length != 0) {
        range.forEach(element => {
            if (objectProperties.find(el => el == element.subject.id) == undefined && dataProperties.find(el => el == element.subject.id) == undefined) {
                log.push(`Pitfall P35 (pattern B and C): ${element.subject.id} is not defined as an object property or datatype property and it has a class defined as range`);
            }
        });
    }

    //Check pattern D, E
    if (subProperty.length != 0) {
        subProperty.forEach(element => {
            //Check pattern D
            if (objectProperties.find(el => el == element.subject.id) == undefined && dataProperties.find(el => el == element.subject.id) == undefined) {
                log.push(`Pitfall P35 (pattern D): ${element.subject.id} is not defined as an object property or datatype property and it appears as
                subject in an rdfs:subPropertyOf statement`);
            }
            //Check pattern E
            if (objectProperties.find(el => el == element.object.id) == undefined && dataProperties.find(el => el == element.object.id) == undefined) {
                log.push(`Pitfall P35 (pattern E): ${element.subject.id} is not defined as an object property or datatype property and it appears as
                object in an rdfs:subPropertyOf statement`);
            }
        });
    }

    //Check pattern F, G
    if (disjointProperty.length != 0) {
        disjointProperty.forEach(element => {
            //Check pattern F
            if (objectProperties.find(el => el == element.subject.id) == undefined && dataProperties.find(el => el == element.subject.id) == undefined) {
                log.push(`Pitfall P35 (pattern F): ${element.subject.id} is not defined as an object property or datatype property and it appears as subject
                 in an owl:propertyDisjointWith statement`);
            }
            //Check pattern G
            if (objectProperties.find(el => el == element.object.id) == undefined && dataProperties.find(el => el == element.object.id) == undefined) {
                log.push(`Pitfall P35 (pattern G): ${element.object.id} is not defined as an object property or datatype property and it appears as 
                object in an owl:propertyDisjointWith statement`);
            }
        });
    }

    //Check pattern H, I
    if (equivalentProperty.length != 0) {
        equivalentProperty.forEach(element => {
            //Check pattern H
            if (objectProperties.find(el => el == element.subject.id) == undefined && dataProperties.find(el => el == element.subject.id) == undefined) {
                log.push(`Pitfall P35 (pattern H): ${element.subject.id} is not defined as an object property or datatype property and it appears as
                subject in an owl:equivalentProperty statement`);
            }
            //Check pattern I
            if (objectProperties.find(el => el == element.object.id) == undefined && dataProperties.find(el => el == element.object.id) == undefined) {
                log.push(`Pitfall P35 (pattern I): ${element.object.id} is not defined as an object property or datatype property and it appears as
                object in an owl:equivalentProperty statement`);
            }
        })
    }

    //Check pattern J, K
    if (inverseProperty.length != 0) {
        inverseProperty.forEach(element => {
            //Check pattern J
            if (objectProperties.find(el => el == element.subject.id) == undefined) {
                log.push(`Pitfall P35 (pattern J): ${element.subject.id} is not defined as an object property and it appears as subject in an owl:inverseOf statement`);
            }
            //Check pattern K
            if (objectProperties.find(el => el == element.object.id) == undefined) {
                log.push(`Pitfall P35 (pattern K): ${element.object.id} is not defined as an object property and it appears as
                object in an owl:inverseOf statement`);
            }
        })
    }
}

function P36() {
    var ontology = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Ontology'));
    if (ontology.length != 0) {
        ontology = ontology[0].subject.id;
        if (ontology.includes('.ttl') || ontology.includes('.owl') || ontology.includes('.rdf') || ontology.includes('.n3') || ontology.includes('.rdfxml')) {
            log.push('Pitfall P36: the ontology URI contains any of the file extensions "owl", "rdf", "n3" or "ttl"');
        }
    }

}

function P38() {
    var ontology = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Ontology'));
    if (ontology.length == 0) {
        log.push('Pitfall P38: the ontology lacks the ontology declaration or the ontology header');
        P39();
    }
}

function P39() {
    if (!fileContents.includes('@base')) {
        log.push('Pitfall P39: the ontology lacks the definition of a base URI and the ontology declaration');
    }
}

function P41() {
    var license = store.getQuads(null, namedNode('http://purl.org/dc/terms/license'), null);
    if (license.length == 0) {
        license = store.getQuads(null, namedNode('http://purl.org/dc/elements/1.1/rights'), null);
        if (license.length == 0) {
            license = store.getQuads(null, namedNode('http://purl.org/dc/terms/rights'), null);
            if (license.length == 0) {
                license = store.getQuads(null, namedNode('http://www.w3.org/1999/xhtml/vocab#license'), null);
                if (license.length == 0) {
                    log.push('Pitfall P41: ontology not contains a license declaration using any of the predicates: dc:rights, dcterms:rights, dcterms:license, cc:license or xhv:license');
                }
            }
        }
    }
}

async function readOntology(ontologyPath) {
    return new Promise((resolve, reject) => {
        fileContents = fs.readFileSync(ontologyPath, 'utf8');
        var quads = [];

        parser.parse(fileContents, (error, quad, prefixes) => {
            if (quad) {
                quads.push(quad);
            }
            else if(error){
                console.log(`Error reading ontology: ${ontologyPath} is not an ontology or contains errors`);
                console.log(`Error: ${error.message}`);
                console.log('Execution terminated');
                process.exit(-1);
            }
            else {
                prefix = prefixes;
                store.addQuads(quads);
            }
        });
        //writer.list
        return resolve(store);
    });
}

function writeLog(logPath) {
    let now= new Date();
    logPath = `${logPath}pitfalls_${now.getMonth()+1}-${now.getDate()}-${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.txt`;
    fs.writeFile(`${logPath}`, log.join('\n'), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log(`The Log file has been created successfully in ${logPath}`);
        }
    });
  }

