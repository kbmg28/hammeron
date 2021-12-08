const { exec } = require('child_process');

let command;

if (process.env.PROFILE === 'prod') {
    command = exec('ng build --aot --configuration=prod');
} else if (process.env.PROFILE === 'hml') {
    command = exec('ng build --aot --configuration=hml');
}

if (command != undefined) {
    command.stdout.on('data', (data) => {
        console.log(data);
    });

    command.stderr.on('data', (data) => {
        console.error(data);
    });

    command.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
} else {
    console.error('process.env.ENV: ' + process.env.ENV);
}
