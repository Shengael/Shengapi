'use strict';

const _  = require('lodash');
const fs = require('fs');


class TemplateBuilder {

    constructor(jsonConfig, projectName, attributes) {
        this.templateRules = JSON.parse(JSON.stringify(jsonConfig).replace(/\$name\$/g, projectName));
        this.attributes    = attributes;
        let attrsList      = '';
        let attrsJSON      = '';
        if (attributes) {
            attrsJSON = this.getAttributesJSON();
            attrsList = this.getAttributesList();
        }

        this.templateRules = JSON.parse(JSON.stringify(this.templateRules).replace(/\$attrsList\$/g, attrsList));
        this.templateRules = JSON.parse(JSON.stringify(this.templateRules).replace(/\$attrsJSON\$/g, attrsJSON));
    }

    static getContent(path) {
        return fs.readFileSync(path).toString();
    }

    apply(path) {
        let template = TemplateBuilder.getContent(path);
        _.forEach(this.templateRules, (rule, key) = > {
            const s = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        template = template.replace(new RegExp(s, 'g'), rule.string);
    })
        ;

        return template;
    }

    getAttributesList() {
        return this.attributes.map(attr = > attr.toString().split(':')[0]
    ).
        join(',');
    }

    getAttributesJSON() {
        return this.attributes.map(attr = > {
            const attrString = attr.toString().split(':')[0];
        return `${attrString}:${attrString}`;
    }).
        join(',');
    }

}

module.exports = TemplateBuilder;
