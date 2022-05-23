
const fs = require('fs');
const path = require('path');

const removeFolder = async () => {
  try {
    await fs.promises.rm(
      path.join(__dirname, 'files_copy'), { recursive: true, force: true }, (e) => { if (e) console.log(e); });
    // .then(console.log('folder is removed'));
  } catch (e) {
    console.log(e);
  }
};

const newFolder = () => {
  fs.mkdir(path.join(__dirname, 'files_copy'), { recursive: false }, (e) => { if (e) console.log(e); });
};

const copyFiles = () => {
  fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true },
    (e, listFiles) => {
      if (e) return console.log(e);
      
      listFiles.forEach(
        (file) => {
          if (file.isFile()) {
            fs.copyFile(
              path.join(__dirname, 'files', file.name),
              path.join(__dirname, 'files_copy', file.name),
              // (e) => {
              //   e ? console.log(`File ${file.name} is not found: `, e)
              //     : console.log(file.name, ' is copied!');
              (e) => {if (e) console.log(`File ${file.name} is not found: `, e);}
            // }
            );
          }
        }
      );
    }
  );
};


fs.access(
  path.join(__dirname, 'files_copy'),
  async (e) => {
    e
      ? (newFolder(), copyFiles())
      : (await removeFolder(), newFolder(), copyFiles());
  }
);

