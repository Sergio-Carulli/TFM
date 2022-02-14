//Create files in windows
const fs = require('fs');
const { exec } = require("child_process");

var inputFile = "pruebaCrearRepo.txt";
var path = "D:/master/TFM/prueba";
var repo = "https://github.com/Sergio-Carulli/pruebasCrearRepo.git";
var archivo = fs.readFileSync(inputFile,"utf-8");
var lines = archivo.split('\n');
var content = [`cd ${path}`];
var aux;
for(line = 0;line<lines.length;line++){
    //Skip blank lines and comments
    if(lines[line] == '\r' | lines[line].startsWith("#")){
        continue;
    }
    //Split the line in two using the "=". First the spaces in the line are removed
    aux = lines[line].replace(/\s+/g, "").split("=",2);
    //If there was a "=" in the line, and it is marked as "y". Create the folder.
    if(aux.length == 2 && aux[1] == "y"){
        content.push(`mkdir ${aux[0]}`);
    }
}

/*
//Commands to push an existing repository from the command line
content.push("git init -b master");
content.push("git add .");
content.push('git commit -m "Initial Commit"');
content.push(`git remote add origin ${repo}`);
content.push("git push origin master");
*/

var commands = content.join(" && ");
console.log(commands);

exec(commands, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});