function CommandLine(cmd, func)
{
    this.commands = [cmd];
    this.functions = [func];

    this.variables = [];

    this.addCommand = function(cmd, func) {
        if(!cmd || cmd == "") throw Error("You must set a command name");
        if(!func) throw Error("You must set a function to call");

        for(let i in this.commands)
            if(this.commands[i] == cmd)
                throw Error("Command name already exists");

        this.commands.push(cmd);
        this.functions.push(func);
    };
    this.callCommand = function(name, words) {
        for(let i=0; i<this.commands.length; i++)
            if(this.commands[i] == name)
                return this.functions[i](name, words);
    }
    this.deleteCommand = function(name) {
        for(let i in this.commands)
            if(this.commands[i] == name)
            {
                this.commands.splice(i, 1);
                this.functions.splice(i, 1);
            }
    };

    
    this.addVariable = function(name, value){
        this.variables.push({name: name, value: value});
        return this.variables[this.variables.length];
    };

    this.getVariable = function(name) {
        for(let i in this.variables)
            if(this.variables[i].name == name)
                return this.variables[i].value;
        return null;
    };
    this.setVariable = function(name, value) {
        for(let i in this.variables)
            if(this.variables[i].name == name)
                return this.variables[i].value = value;
        return null;
    };
    this.deleteVariable = function(name) {
        for(let i in this.variables)
            if(this.variables[i].name == name)
                this.variables.splice(i, 1);
    };


    return this;
}

module.exports = CommandLine;