const path = require('path');
const fs = require('fs');

const txt = new fs.ReadStream(path.join(__dirname, 'text.txt'));
txt.on('readable', ()=>{
  const data = txt.read();
  if(data) console.log(data.toString());
});