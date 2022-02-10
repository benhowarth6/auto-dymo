const { stdout, stderr } = require('process');

const exec = require('child_process').exec;

module.exports = function processChecker(query){
    let platform = process.platform;
    let cmd = '';
    switch(platform){
        case 'win32': cmd = `tasklist`; break;
        case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }
    exec(cmd, (err, stdout, stderr) => {
        return (stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}