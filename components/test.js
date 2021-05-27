const MessageComponent = require("../utils/interactions/MessageComponent");

const command = {
    name: "test",
    /**
     * @param {MessageComponent} component 
     */
    execute: async component => {
        const characters = "0123456789abcdef";

        let s = "";
        for (let i = 0; i < Math.ceil(Math.random() * 50); i++)
            s += characters.charAt(Math.floor(Math.random() * characters.length));
        
        component.message.edit(s);
    }
};

module.exports = command;