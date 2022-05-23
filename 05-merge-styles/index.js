const fs = require('fs');
const path = require('path');


const out = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

const streamEach = (files = [], resStream) => {

  if (!files.length) return resStream.end();

  const cssFile = path.resolve( __dirname, 'styles', files.shift().name);
  
  // console.log('add ' + cssFile);
  
  const cssStream = fs.createReadStream(cssFile);
  cssStream.pipe(resStream, { end: false });
  cssStream.on('end', () => { streamEach(files, resStream); });
  cssStream.on('error',
    e => {
      console.error(e);
      resStream.close();
    });
};


fs.readdir(
  path.join(__dirname, 'styles'), { withFileTypes: true },
  (e, listFiles) => {
    if (e) return console.log(e);
    streamEach(
      listFiles.filter(
        (f) => f.isFile() && path.extname(f.name).toLowerCase() === '.css'), out);
  }
);


