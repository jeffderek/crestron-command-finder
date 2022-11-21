const fs = require('fs');

let data = {
    models: [],
    accessors: [],
    actions: [],
};
let actions = [];

function readFiles(dirname, onFileContent, onError) {
    fs.readdirSync(dirname).forEach((filename) => {
        let content = fs.readFileSync(dirname + filename, 'utf-8');
        readFileContent(content);
    });
}

function readFileContent(content) {
    let commandListRegex = /^(?<model>\S*)>help all\r?\n(?<commandList>(?:^(\S+)\s*(\S+)\s*(.+)\r?\n)+)/m;
    let matches = content.match(commandListRegex);
    if (matches && matches.groups) {
        parseCommandList(matches.groups.model, matches.groups.commandList);
    } else {
        console.log('nope');
    }
}

function parseCommandList(model, commandList) {
    let commands = commandList.split('\r\n');
    let commandRegex = /(?<command>\S+)\s+(?<access>\S*)\s+(?<description>.*)/m;
    commands.forEach((command) => {
        let matches = command.match(commandRegex);
        if (matches) {
            addAction(matches.groups.command, matches.groups.access, matches.groups.description, model);
        }
    });
}

function addAction(command, access, description, model) {
    if (description.startsWith('(*)')) {
        // These are custom user commands for specific projects
        return;
    }

    let action = data.actions.find((action) => action.command == command);
    if (action) {
        if (!action.models.includes(model)) {
            action.models.push(model);
        }
    } else {
        data.actions.push({
            command,
            access,
            description,
            models: [model],
        });
    }

    if (!data.models.includes(model)) {
        data.models.push(model);
    }

    if (!data.accessors.includes(access)) {
        data.accessors.push(access);
    }
}

readFiles(`${__dirname}/info/`, readFileContent, (err) => {
    console.log(err);
});
fs.writeFileSync('src/assets/data.json', JSON.stringify(data));
console.log(data);
