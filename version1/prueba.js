import child_process from 'child_process'
const { exec } = child_process;

var file = 'D:/master/pruebaInconsistencias/ontology.ttl';

exec(`java -jar HermiT.jar -ds owl:Thing ${file}`, function(err, stdout, stderr) {
    if (err) {
        console.log(err)
    }
    console.log(stdout)
})