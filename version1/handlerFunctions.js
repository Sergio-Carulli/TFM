module.exports.requiredInformation = (lines,line) => {
    console.log("Iniciar Require Information");
    while(lines[line] !="#Prefix\r"){
        //console.log(lines[line]);
        line++;
    }
    return line-1;
}

module.exports.prefix = (lines,line,content) => {
    console.log("Iniciar Prefix");
    var contenta = "";
    var aux;
    var aux2 = "";
    while(lines[line] !="#Class\r"){
        //console.log(lines[line]);
        aux = lines[line].split("=",2);
        //console.log(aux[0]);
        //console.log(aux[1]);
        aux2 = `@prefix ${aux[0]}: <${aux[1]}> .`;
        console.log(aux2);
        contenta += "hola";
        line++;
    }
    console.log(contenta);
    return line-1;
}

module.exports.class = (lines,line) => {
    console.log("Iniciar Class");
    while(lines[line] !="#Object Properties\r"){
        //console.log(lines[line]);
        line++;
    }
    return line-1;
}

module.exports.objectProperties = (lines,line) => {
    console.log("Iniciar Object Properties");
    while(lines[line] !="#Data Properties\r"){
        //console.log(lines[line]);
        line++;
    }
    return line-1;
}

module.exports.dataProperties = (lines,line) => {
    console.log("Iniciar Data Properties");
    while(lines[line] != null){
        //console.log(lines[line]);
        line++;
    }
    return line;
}