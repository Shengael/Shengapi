'use strict';

const _ = require('lodash');
const fs = require('fs');
const ColumnDatabase = require('./ColumnDatabase');


class TemplateBuilder {

    constructor(jsonConfig, projectName, projectDir, srcDir, attributes) {
        this.templateRules = JSON.parse(JSON.stringify(jsonConfig).replace(/\$name\$/g, projectName));
        if(attributes) this.columnDatabase = new ColumnDatabase(projectName, projectDir, srcDir, attributes);
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
