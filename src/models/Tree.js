'use strict';

const _               = require('lodash');
const fs              = require('fs');
const TemplateBuilder = require('./TemplateBuilder');
const templateJSON    = require('../../Config/template.json');

class Tree {

    constructor(name, templateDir) {
        this.templateDir     = templateDir;
        this.templateBuilder = new TemplateBuilder(templateJSON, name);
    }

    createDir(current, struct) {
        _.forEach(struct, dir => {
            const newCurrent = `${current}${dir.name}\\`;
            fs.mkdirSync(newCurrent);
            if (dir.files) this.createFiles(newCurrent, dir.files);
            if (dir.templates) this.createTemplates(newCurrent, dir.templates);
            if (dir.directories) this.createDir(newCurrent, dir.directories);
        });
    }

    createFiles(current, filesArray) {
        _.forEach(filesArray, f => {
            this.createFile(current, f);
        });
    }

    createFile(current, name) {
        fs.writeFileSync(`${current}${name}`, "'use strict';");
        return true;
    }

    createTemplates(current, templatesArray) {
        _.forEach(templatesArray, t => {
            this.createTemplate(current, t);
        });
    }

    createTemplate(current, template) {
        const templatePath = `${this.templateDir}\\${template.name}`;
        if (fs.existsSync(templatePath)) {
            fs.writeFileSync(`${current}${template.dest}`, this.templateBuilder.apply(templatePath));
        }
    }
}

module.exports = Tree;
