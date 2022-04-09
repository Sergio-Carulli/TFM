//const http = require('http');
const https = require('https');
const fs = require('fs');

//Program which dorwnload a ttl file from github and get the version of that ttl.
//Input: url with the raw file
//Output: version of the ttl file

//Function for downloading the ttl file with the last version
async function downloadFile(oldVersion){
    let data = '';
    return new Promise((resolve,reject)=>{
        https.get(oldVersion, res => {
            res.on('data', chunk => { data += chunk }) 
            res.on('end', () => {
               resolve(searchVersion(data));
            })
        }) 
    });
}

//Function for searching the neccesary information in the ontology last version
async function searchVersion(data){
    //console.log(data);
    var start = data.indexOf("owl:versionInfo");
    var end = data.indexOf("\n",start)
    console.log(data.substring(start+15,end).replace(/\s+\;/g, ""));
}

var oldVersion = "https://raw.githubusercontent.com/mariapoveda/wot-ontology/master/ontology/wot.ttl";
(async () => await downloadFile(oldVersion))()
