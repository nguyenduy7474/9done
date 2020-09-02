const chokidar = require('chokidar');

// Initialize watcher.
const watcher = chokidar.watch('./public', { persistent: true });
watcher
    .on('add', path => console.log(`File ${path} has been added`))
    .on('change', path => console.log(`File ${path} has been changed`))
    .on('unlink', path => console.log(`File ${path} has been removed`));