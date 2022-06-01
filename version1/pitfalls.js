
import fs from 'fs';
import N3 from 'n3';
import { NamedNode } from 'n3';

const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;
var parser = new N3.Parser();
var store = new N3.Store();
var prefix;
var fileContents;

/*
var ontologyPath = '../../../../pruebaPitfalls/P06.ttl';
pitfalls(ontologyPath);
*/
export default async function pitfalls(ontologyPath) {
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
    //console.log(prefix);

}
/*
function P35(){
    var objectProperties = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty'));
    if(objectProperties.length != 0){
        var domain;
        objectProperties.forEach(element => {
            domain = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
            console.log(domain);
            if(domain.length == 0){
                console.log(`Pitfall P35: ${element}`)
            }

        });
    }

    //console.log(objectProperties);

}
*/
Array.prototype.equals = function (getArray) {
    if (this.length != getArray.length) return false;
    //console.log(getArray.length);
    //console.log(this.length);
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
                    //console.log(array);
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
                    //console.log(array);
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
                console.log(`Pitfall P02: Classes ${element.subject.id} and ${element.object.id}`);
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
                                    console.log(`Pitfall P04: Class ${element.subject.id}`);
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
            p2 = store.getQuads(namedNode(element.object.id), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), null);
            if (p1.length && p2.length) {
                p1.forEach(c1 => {
                    p2.forEach(c2 => {
                        if (c1 != c2) {
                            console.log(`Pitfall P05: Pattern A ${element.subject.id} ${element.object.id}`);
                        }
                    })
                })
            }

            //check ranges
            p1 = store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
            p2 = store.getQuads(namedNode(element.object.id), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
            if (p1.length && p2.length) {
                p1.forEach(c1 => {
                    p2.forEach(c2 => {
                        if (c1 != c2) {
                            console.log(`Pitfall P05: Pattern B ${element.subject.id} ${element.object.id}`);
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
                console.log(`Pitfall P06: Class ${element.object.id} is in a loop`);
                return;
            }
            else {
                subclasses.push(element.object.id);
                detectCycles(element.object.id, subclasses);
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
        //console.log(classes);
        classes.forEach(element => {
            detectCycles(element.subject.id, [element.subject.id]);
        });
    }

}

/*
function P06(){
    var subclass = store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#subClassOf'), null);
    if(subclass.length){
        var array = [];
        subclass.forEach(element => {
            array.push([element.subject.id, element.object.id]);
        });
        console.log(array);
    }

}
*/

function P07() {
    var classes = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Class'));
    if (classes.length) {
        classes.forEach(element => {
            if (element.subject.id.includes('and') || element.subject.id.includes('And')) {
                console.log(`Pitfall P07: Pattern A Class ${element.subject.id}`);
            }
            else if (element.subject.id.includes('or') || element.subject.id.includes('Or')) {
                console.log(`Pitfall P07: Pattern B Class ${element.subject.id}`);
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
                console.log(`Pitfall P08: Pattern A ${name} ${element.subject.id}`);
            }

            //check comment
            annotation = store.getQuads(element.subject.id, namedNode('http://www.w3.org/2000/01/rdf-schema#comment'), null);
            if (!annotation.length) {
                console.log(`Pitfall P08: Pattern B ${name} ${element.subject.id}`);
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
                console.log(`Pitfall P10: Not disjoint axiom found`);
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
                console.log(`Pitfall P11: Pattern A ${name} ${element.subject.id}`);
            }

            //check range
            aux = store.getQuads(element.subject.id, namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
            if (!aux.length) {
                console.log(`Pitfall P11: Pattern B ${name} ${element.subject.id}`);
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
                    else if (!equivalentProperties.length) {
                        console.log(`Pitfall P12: Pattern A${name} ${ontologyElement[i]} ${ontologyElement[j]}`);
                    }
                    if (equal) {
                        console.log(`Pitfall P12: Pattern A ${name} ${ontologyElement[i]} ${ontologyElement[j]}`);
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
                        console.log(`Pitfall P13: Pattern A ${element.subject.id}`);
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
                                        console.log(`Pitfall P13: Pattern B ${suggest} ${element.subject.id}`);
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
                                console.log(`Pitfall 19: Object Property Pattern A ${element}`);
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
                                console.log(`Pitfall 19: Object Property Pattern B ${element}`);
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
                                console.log(`Pitfall 19: Data Property Pattern A ${element}`);
                            }
                        }
                    }
                }
            }
            range = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), null);
            if (range.length > 1) {
                for (var i = 0; i + 1 < range.length; i++) {
                    if (range[i].object.id != range[i + 1].object.id) {
                        console.log(`Pitfall 19: Data Property Pattern B ${element}`);
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
            if (!label.length) {
                console.log(`Pitfall P20: Pattern B ${name} ${element}`);
            }
            if (!comment.length) {
                console.log(`Pitfall P20: Pattern C ${name} ${element}`);
            }
            else if (label.length) {
                if (label[0].object.id == comment[0].object.id) {
                    console.log(`Pitfall P20: Pattern D ${name} ${element}`);
                }
                else if (label[0].object.id.length > comment[0].object.id.length) {
                    console.log(`Pitfall P20: Pattern A ${name} ${element}`)
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
                console.log(`Pitfall 21: Class ${element} contains "other"`);
            }
            if (element.includes('misc', aux)) {
                console.log(`Pitfall 21: Class ${element} contains "misc"`);
            }
            if (element.includes('miscellanea', aux)) {
                console.log(`Pitfall 21: Class ${element} contains "miscellanea"`);
            }
            if (element.includes('miscellaneous', aux)) {
                console.log(`Pitfall 21: Class ${element} contains "miscellaneous"`);
            }
            if (element.includes('miscellany', aux)) {
                console.log(`Pitfall 21: Class ${element} contains "miscellany"`);
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
        console.log(`Pitfall 22: There are ontology elements with different delimeters`);
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
                console.log(`Pitfall P22: ${name} ${ontologyElement[i]} does not start as the others (lowercase or uppercase)`);
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
        console.log(`Pitfall 22: There are ${name} with - and _ at the same time`);
        return 0;
    }
    else if (contain1 != 0 && contain3 != 0) {
        console.log(`Pitfall 22: There are ${name} with - and mayus as delimeters at the same time`);
        return 1;
    }
    else if (contain2 != 0 && contain3 != 0) {
        console.log(`Pitfall 22: There are ${name} with _ and mayus as delimeters at the same time`);
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
                console.log(`Pitfall P24: Class it is own rdf:subClassOf ${element}`);
            }
            var equivalent = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(element));
            if (equivalent.length) {
                console.log(`Pitfall P24: Class it is own owl:equivalentClass ${element}`);
            }
        });
    }
    if (objectProperties.length) {
        objectProperties.forEach(element => {
            var domain = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), namedNode(element));
            if (domain.length) {
                console.log(`Pitfall P24: Object property it is own rdf:domain ${element}`);
            }
            var range = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#range'), namedNode(element));
            if (range.length) {
                console.log(`Pitfall P24: Object property it is own rdf:range ${element}`);
            }
        });
    }
    if (dataProperties.length) {
        dataProperties.forEach(element => {
            var domain = store.getQuads(namedNode(element), namedNode('http://www.w3.org/2000/01/rdf-schema#domain'), namedNode(element));
            if (domain.length) {
                console.log(`Pitfall P24: Data property it is own rdf:domain ${element}`);
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
                    console.log(`Pitfall 25: ${i.subject.id}`)
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
                console.log(`Pitfalls P26: Pattern A ${element}`);
            }

            //Check pattern B
            if (objectInverse.length) {
                console.log(`Pitfalls P26: Pattern B ${element}`);
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
                                    console.log(`Pitfall 27: Pattern A ${element.subject.id} ${element.object.id}`);
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
                                    console.log(`Pitfall 27: Pattern B ${element.subject.id} ${element.object.id}`);
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
            //console.log(domain);
            //console.log(range);
            if (domain.length && range.length) {
                //console.log(domain.equals(range));
                domain.forEach(d => {
                    range.forEach(r => {
                        //Check if there are the same class
                        if (d != r) {
                            //Check if they are equivalent classes
                            var eq = store.getQuads(namedNode(d), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(r));
                            if (!eq.length) {
                                eq = store.getQuads(namedNode(r), namedNode('http://www.w3.org/2002/07/owl#equivalentClass'), namedNode(d));
                                if (!eq.length) {
                                    console.log(`Pitfall 28: ${element}`);
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
                                    console.log(`Pitfall P29: Object Property ${element.subject.id}`);
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
        //console.log(dictionary['one']);
        classes.forEach(element => {
            var label = getObjects(store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/2000/01/rdf-schema#label'), null));
            if (label.length) {
                //console.log(label);
                if (label != '') {
                    if (dictionary[label] != undefined) {
                        console.log(`Pitfall 32: Class ${element.subject.id} and ${dictionary[label]}`);
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
            if (classes.find(el => el == element.object.id) == undefined) {
                console.log(`Pitfall P34: ${element.object.id} pattern A and C`);
            }
        });
    }

    //Check pattern B
    if (range.length) {
        range.forEach(element => {
            var auxObjectPorperty = getSubjects(store.getQuads(namedNode(element.subject.id), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')));
            if (auxObjectPorperty.find(el => el == element.subject.id) != undefined && classes.find(el => el == element.object.id) == undefined) {
                console.log(`Pitfall P34: ${element.object.id} pattern B`);
            }
        });
    }

    //Check pattern D, E
    if (subClass.length) {
        subClass.forEach(element => {
            //Check pattern D
            if (classes.find(el => el == element.subject.id) == undefined) {
                console.log(`Pitfall P34: ${element.subject.id} pattern D`);
            }
            //Check pattern E
            if (classes.find(el => el == element.object.id) == undefined) {
                console.log(`Pitfall P34: ${element.object.id} pattern E`);
            }
        });
    }

    //Check pattern F, G
    if (disjointClass.length) {
        disjointClass.forEach(element => {
            //Check pattern F
            if (classes.find(el => el == element.subject.id) == undefined) {
                console.log(`Pitfall P34: ${element.subject.id} pattern F`);
            }
            //Check pattern G
            if (classes.find(el => el == element.object.id) == undefined) {
                console.log(`Pitfall P34: ${element.object.id} pattern G`);
            }
        });
    }

    //Check pattern H, I
    if (equivalentClass.length) {
        equivalentClass.forEach(element => {
            //Check pattern H
            if (classes.find(el => el == element.subject.id) == undefined) {
                console.log(`Pitfall P34: ${element.subject.id} pattern H`);
            }
            //Check pattern I
            if (classes.find(el => el == element.object.id) == undefined) {
                console.log(`Pitfall P34: ${element.object.id} pattern I`);
            }
        });
    }
}

function P35() {
    var objectProperties = getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#ObjectProperty')));
    objectProperties = objectProperties.concat(getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#SymmetricProperty'))));
    objectProperties = objectProperties.concat(getSubjects(store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#TransitiveProperty'))));
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
                console.log(`Pitfall P35: ${element.subject.id} pattern A`);
            }
        });
    }

    //Check pattern B and C
    if (range.length != 0) {
        range.forEach(element => {
            if (objectProperties.find(el => el == element.subject.id) == undefined && dataProperties.find(el => el == element.subject.id) == undefined) {
                console.log(`Pitfall P35: ${element.subject.id} pattern B and C`);
            }
        });
    }

    //Check pattern D, E
    if (subProperty.length != 0) {
        //console.log(subProperty);
        subProperty.forEach(element => {
            //Check pattern D
            if (objectProperties.find(el => el == element.subject.id) == undefined && dataProperties.find(el => el == element.subject.id) == undefined) {
                console.log(`Pitfall P35: ${element.subject.id} pattern D`);
            }
            //Check pattern E
            if (objectProperties.find(el => el == element.object.id) == undefined && dataProperties.find(el => el == element.object.id) == undefined) {
                console.log(`Pitfall P35: ${element.subject.id} pattern E`);
            }
        });
    }

    //Check pattern F, G
    if (disjointProperty.length != 0) {
        disjointProperty.forEach(element => {
            //Check pattern F
            if (objectProperties.find(el => el == element.subject.id) == undefined && dataProperties.find(el => el == element.subject.id) == undefined) {
                console.log(`Pitfall P35: ${element.subject.id} pattern F`);
            }
            //Check pattern G
            if (objectProperties.find(el => el == element.object.id) == undefined && dataProperties.find(el => el == element.object.id) == undefined) {
                console.log(`Pitfall P35: ${element.object.id} pattern G`);
            }
        });
    }

    //Check pattern H, I
    if (equivalentProperty.length != 0) {
        equivalentProperty.forEach(element => {
            //Check pattern H
            if (objectProperties.find(el => el == element.subject.id) == undefined && dataProperties.find(el => el == element.subject.id) == undefined) {
                console.log(`Pitfall P35: ${element.subject.id} pattern H`);
            }
            //Check pattern I
            if (objectProperties.find(el => el == element.object.id) == undefined && dataProperties.find(el => el == element.object.id) == undefined) {
                console.log(`Pitfall P35: ${element.object.id} pattern I`);
            }
        })
    }

    //Check pattern J, K
    if (inverseProperty.length != 0) {
        inverseProperty.forEach(element => {
            //Check pattern J
            if (objectProperties.find(el => el == element.subject.id) == undefined) {
                console.log(`Pitfall P35: ${element.subject.id} pattern J`);
            }
            //Check pattern K
            if (objectProperties.find(el => el == element.object.id) == undefined) {
                console.log(`Pitfall P35: ${element.object.id} pattern K`);
            }
        })
    }
}

function P36() {
    var ontology = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Ontology'));
    if (ontology.length != 0) {
        ontology = ontology[0].subject.id;
        if (ontology.includes('.ttl') || ontology.includes('.owl') || ontology.includes('.rdf') || ontology.includes('.n3') || ontology.includes('.rdfxml')) {
            console.log('Pitfall P36');
        }
    }

}

function P38() {
    var ontology = store.getQuads(null, namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://www.w3.org/2002/07/owl#Ontology'));
    if (ontology.length == 0) {
        console.log('Pitfall P38');
        P39();
    }
}

function P39() {
    if (!fileContents.includes('@base')) {
        console.log('Pitfall P39');
    }
}

function P41() {
    var license = store.getQuads(null, namedNode('http://purl.org/dc/terms/license'), null);
    //console.log(license.length);
    if (license.length == 0) {
        license = store.getQuads(null, namedNode('http://purl.org/dc/elements/1.1/rights'), null);
        if (license.length == 0) {
            license = store.getQuads(null, namedNode('http://purl.org/dc/terms/rights'), null);
            if (license.length == 0) {
                license = store.getQuads(null, namedNode('http://www.w3.org/1999/xhtml/vocab#license'), null);
                if (license.length == 0) {
                    console.log('Pitfall P41');
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
                //console.log(quad);
                quads.push(quad);
            }
            else {
                prefix = prefixes;
                //console.log(quads);
                store.addQuads(quads);
                //writer.addQuads(quads);
                //console.log("# That's all, folks!", prefixes);
            }
        });
        //writer.list
        return resolve(store);
    });
}

