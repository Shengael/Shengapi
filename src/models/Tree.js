'use strict';

const _               = require('lodash');
const fs              = require('fs');
const TemplateBuilder = require('./TemplateBuilder');
const templateJSON    = require('../../Config/template.json');

class Tree {

    constructor(name, templateDir, projectDir) {
        this.templateDir     = templateDir;
        this.templateBuilder = new TemplateBuilder(templateJSON, name);
        this.projectDir = projectDir;
    }

    /**
     *
     * @param current
     * @param struct
     * @param struct.directories
     */
    createDir(current, struct) {
        _.forEach(struct, dir => {
            let newCurrent = current;
            if(dir.root) newCurrent = `${this.projectDir}\\${dir.root}`;
            if(dir.name) {
                newCurrent = `${newCurrent}${dir.name}\\`;
                fs.mkdirSync(newCurrent);
            }
            if (dir.files) this.createFiles(newCurrent, dir.files);
            if (dir.templates) this.createTemplates(newCurrent, dir.templates);
            if (dir.directories) this.createDir(newCurrent, dir.directories);
        });
    }

    createFiles(current, filesArray) {
        _.forEach(filesArray, f => {
            Tree.createFile(current, f);
        });
    }

    static createFile(current, name) {
        fs.writeFileSync(`${current}${name}`, "'use strict';");
        return true;
    }

    createTemplates(current, templatesArray) {
        _.forEach(templatesArray, t => {
            this.createTemplate(current, t);
        });
    }

    /**
     *
     * @param current
     * @param template
     * @param template.name
     * @param template.dest
     */
    createTemplate(current, template) {
        const templatePath = `${this.templateDir}\\${template.name}`;
        if (fs.existsSync(templatePath)) {
            fs.writeFileSync(`${current}${template.dest}`, this.templateBuilder.apply(templatePath));
        }
    }
}

module.exports = Tree;
