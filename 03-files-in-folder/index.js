const fs = require('fs');
const path = require('path');

try {
  fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true },
    (e, listFiles) => {
      if (e) return console.log(e);
      listFiles.forEach(
        file => {
          if (file.isFile()) {
            fs.stat(path.join(__dirname, 'secret-folder', file.name), (er, fileStats) => {
              if (er) return console.error(er);
              console.log(`${path.parse(file.name).name} / type=${path.parse(file.name).ext.replace(/^./, '')}  / size=${fileStats.size} bytes`);
            });
          }
        }
      );
    }
  );
} catch (e) {
  console.error(e);
}
