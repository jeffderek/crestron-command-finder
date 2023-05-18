const fs = require('fs');

let data = {
    models: [],
    accessors: [],
    actions: [],
};
let actions = [];
let userCommands = [];

let commandRegex = /(?<command>\S+)\s+(?<access>\S*)\s+(?<description>.*)/m;
let userCommandRegex = /(?<command>\S+):\d+\s+(?<access>\S*)\s+(?<description>.*)/m;

function readFiles(dirname, onFileContent, onError) {
    fs.readdirSync(dirname).forEach((filename) => {
        let content = fs.readFileSync(dirname + filename, 'utf-8');
        readFileContent(content);
    });
}

function readFileContent(content) {
    let modelRegex = /^(?<model>\S*)>/m;
    let modelMatches = content.match(modelRegex);

    if (modelMatches && modelMatches.groups) {
        let model = modelMatches.groups.model;

        userCommands = [];
        let userCommandListRegex = /help user\r?\n(?<commandList>(?:^(\S+)\s*(\S+)\s*(.+)\r?\n)+)/m;
        let userCommandMatches = content.match(userCommandListRegex);
        if (userCommandMatches && userCommandMatches.groups) {
            parseUserCommandList(userCommandMatches.groups.commandList);
        }

        let commandListRegex = /help all\r?\n(?<commandList>(?:^(\S+)\s*(\S+)\s*(.+)\r?\n)+)/m;
        let commandListMatches = content.match(commandListRegex);
        if (commandListMatches && commandListMatches.groups) {
            parseCommandList(model, commandListMatches.groups.commandList);
        }
    }
}

function parseUserCommandList(commandList) {
    let commands = commandList.split('\n');

    commands.forEach((command) => {
        let matches = command.match(userCommandRegex);
        if (matches) {
            if (!userCommands.includes(matches.groups.command)) {
                userCommands.push(matches.groups.command);
            }
        }
    });
}

function parseCommandList(model, commandList) {
    let commands = commandList.split('\n');

    commands.forEach((command) => {
        let matches = command.match(commandRegex);
        if (matches) {
            // Check to make sure this isn't a custom user command for the specific program running on this machine.
            if (!userCommands.includes(matches.groups.command)) {
                addAction(matches.groups.command, matches.groups.access, matches.groups.description, model);
            }
        }
    });
}

function addAction(command, access, description, model) {
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
