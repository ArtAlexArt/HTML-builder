const fs = require('fs');
const path = require('path');


var global = '';
const htmlStream = new fs.ReadStream(path.join(__dirname, 'template.html'));
const stylesStream = fs.createWriteStream( path.join(__dirname, 'project-dist', 'style.css'));

const dist_assets=path.join(__dirname, 'project-dist', 'assets');
const source_assets=path.join(__dirname, 'assets');



const htmlEach=(files = [], global)=>{
  if (!files.length) 
    return fs.writeFile( path.join(__dirname, 'project-dist', 'index.html'), global, (e)=>{if (e) throw e;});
  
  let fileName = files.shift().name;
  
  fs.readFile( path.join(__dirname, 'components', fileName),
    (e, data) => {
      if (e) return console.log(e);
      global = global.replace( `{{${path.parse(fileName).name}}}`, data.toString() );
      htmlEach(files, global);
    }
  );  
};

const streamEach = (files = [], stylesStream) => {
  if (!files.length) return stylesStream.end();
  
  const cssStream = fs.createReadStream(path.resolve( __dirname, 'styles', files.shift().name));
  cssStream.pipe(stylesStream, { end: false });
  cssStream.on('end', () => { streamEach(files, stylesStream); });
  cssStream.on('error', e => {
    console.error(e);
    stylesStream.close();
  });
};


const removeFolder = async (pathF) => {
  try {
    await fs.promises.rm(
      pathF,
      { recursive: true, force: true }, (e) => { if (e) console.log(e); })
      .then(console.log('folder is removed'));
  } catch (e) {
    console.log(e);
  }
};

const copyFolder=async (sourceDir, destDir)=>{
  fs.mkdir(destDir, ()=>{ 
    fs.readdir( sourceDir,  { withFileTypes: true },
      (e, listFiles) => { 
        if (e) return console.log(e);
        listFiles.forEach((f) => {
          // console.log(f.name);
          if (f.isFile()) {
            fs.copyFile( path.join(sourceDir, f.name), path.join(destDir, f.name),
              (e) => {if (e) {console.error(e);}});
            return;
          } else if (f.isDirectory()){
            copyFolder(path.join(sourceDir, f.name), path.join(destDir, f.name));
          }
        });
      }
    );
  });
};
 

//********************************************************************* 

fs.mkdir(
  path.join(__dirname, 'project-dist'), { recursive: false }, () => { }
);

fs.readdir(
  path.join(__dirname, 'styles'), { withFileTypes: true },
  (e, listFiles) => {
    if (e) return console.log(e);
    streamEach(
      listFiles.filter((f) => f.isFile() && path.extname(f.name).toLowerCase() === '.css'), stylesStream);
  }
);

htmlStream.on('readable', () => {
  const data = htmlStream.read();
  if (data) {
    fs.writeFile( path.join(__dirname, 'project-dist', 'index.html'), data.toString(),  (e) => { if (e) throw e; });
    global = data.toString();
    fs.readdir( path.join(__dirname, 'components'), { withFileTypes: true },
      (e, listFiles) => { 
        if (e) return console.log(e);
        htmlEach( listFiles.filter((f) => f.isFile() && path.extname(f.name).toLowerCase() === '.html'), global );
      }
    );
  }
});

fs.access(
  dist_assets,
  async (e) => {
    e
      ? (copyFolder(source_assets, dist_assets))
      : (await removeFolder(dist_assets),copyFolder(source_assets, dist_assets));
  }
);