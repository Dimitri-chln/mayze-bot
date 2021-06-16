function parse(text, ...args) {
    text = text
        .replace(/\{\d+?\}/g, a => args[parseInt(a.replace(/[\{\}]/g, "")) - 1]);

    while (/\[\d+?\?[^\[\]]*?:.*?\]/gs.test(text)) {
        text = text
            .replace(/\[\d+?\?[^\[\]]*?:.*?\]/gs, a => {
                let m = a.match(/\[(\d+?)\?([^\[\]]*?):(.*?)\]/s);
                if (args[parseInt(m[1]) - 1]) return m[2];
                else return m[3];
            });
    }

    text = text
        .replace(/~c/g, "{")
        .replace(/~b/g, "}")
        .replace(/~s/g, "[")
        .replace(/~t/g, "]")
        .replace(/~d/g, ":")
        .replace(/~q/g, "?");

    return text;
}

module.exports = parse;