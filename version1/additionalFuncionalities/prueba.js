import fs from 'fs-extra'

fs.readdir('./shapes', function (err, archivos) {
    if (err) {
        console.log(err);
        return;
    }
    archivos.forEach(file => {
        console.log(file)
    });
});