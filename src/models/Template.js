'use strict';

class Template {

    constructor() {

    }

    static getContent(path) {
        return fs.readFileSync(path).toString();
    }
}
