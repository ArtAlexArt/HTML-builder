const path = require('path');
const fs = require('fs');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');

const rl = readline.createInterface({input,output});
fs.writeFile(path.join(__dirname, 'text.txt'), '', (e)=> {if (e) throw e; });

rl.on('line', (text) => {
  text.includes('exit') 
    ? rl.close()
    : fs.appendFile(path.join(__dirname, 'text.txt'), text + '\n', (e)=> {if (e) throw e; });
});
rl.on('SIGINT', () => rl.close());
rl.on('close', () => console.log('Your keyboard typing is finished! Bye.'));

console.log('Please to push on the keyboard buttons:');