let prompt = require("prompt"),
    unirest = require("unirest");


let command = new (require("./command.js"))("test", function(cmd, words) {
    console.log("Called " + cmd);
    console.log("Words " + words);
});

command.addVariable("url", "http://localhost:81/login");
command.addVariable("params", {});

command.addCommand("url", function(cmd, words) {
    if(words.length == 0)
        return command.getVariable("url");
    if(words[0] == "-p")
        return console.log(command.getVariable("url"));
    command.setVariable("url", words[0]);
});

command.addCommand("var", function(cmd, words) {
    if(words.length == 0)
        return console.log("Send a variable name");
    if(words.length == 1)
        return command.getVariable(words[0]);
    else
    {
        if(words[1].charAt(0) == "{")
            words[1] = JSON.parse(words[1]);
        command.setVariable(words[0], words[1]);
    }
});

command.addCommand("get", function(cmd, words, callback) {
    unirest.get(command.getVariable("url"))
    .send(command.getVariable("params"))
    .end(function(response) {
        if(!callback) {
            console.log("\n");
            console.log(response.body);
        }
        else callback(response.body);
    });
});
command.addCommand("post", function(cmd, words, callback) {
    unirest.post(command.getVariable("url"))
    .send(command.getVariable("params"))
    .end(function(response) {
        if(!callback) {
            console.log("\n");
            console.log(response.body);
        }
        else callback(response.body);
    });
});

console.log(command.callCommand("url", []));
command.callCommand("post", [], (res) => {
    console.log("\n" + res);
});

var ask = function() {
    prompt.get(["command"], function(err, result) {
        if(!result) return;
        let cont = true;
        if(result.command == "") {console.log("Enter a command"); cont = false;}

        if(cont == true)
        {
            var words = result.command.split(" ");
            let cmd = words[0];
            let inter = [];
            for(let i=1; i<words.length; i++)
                inter.push(words[i]);
            
            parsing(cmd, inter);
        }
        ask();
    });
}

ask();
function parsing(cmd, inter)
{
    for(let i=0; i<command.commands.length; i++)
    {
        if(command.commands[i] == cmd)
        {
            command.functions[i](cmd, inter);
            return;
        }
    }
    console.log("\"" + cmd + "\" is not recognized as a command");
}