const fs = require("fs");

const readFile = fs.readFile;

readFile('./home/node/app/config.json', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
});
