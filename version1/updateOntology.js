function updateOntology(templatePath){
    var fileContents = fs.readFileSync(templatePath, 'utf8');
    var data = yaml.loadAll(fileContents);
}