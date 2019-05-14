'use strict';

const _ = require('lodash');
const fs = require('fs');
class TemplateBuilder {

    constructor(jsonConfig, projectName) {
        console.log(projectName)
        console.log(JSON.stringify(jsonConfig).replace(/\$name\$/g, projectName));
        this.templateRules = JSON.parse(JSON.stringify(jsonConfig).replace(/\$name\$/g, projectName));

    }

    static getContent(path) {
        return fs.readFileSync(path).toString();
    }

    apply(path) {
        let template = TemplateBuilder.getContent(path);
        _.forEach(this.templateRules, (rule, key) => {
            const s = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            template = template.replace(new RegExp(s, 'g'), rule.string);
        });

        return template;
    }
}

module.exports = TemplateBuilder;
