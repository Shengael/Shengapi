# Shengapi [![npm version](https://badge.fury.io/js/%40shengael%2Fshengapi.svg)](https://badge.fury.io/js/%40shengael%2Fshengapi)

An API helper for node.js command Line Interface (CLI)

## Table of Contents
- [Installation](#installation)
- [Usage](#Usage)

## Installation

### Globally
Install CLI globally with

```bash
$ npm install -g @shengael/shengapi
```

Now you can run CLI using following command anywhere

```bash
$ shengapi
```

### Locally
Install CLI locally to your `node_modules` folder with

```bash
$ npm install --save @shengapi/shengael
```

You should be able to run CLI with

```bash
$ node_modules/.bin/sehngapi
```

## Usage
```
Shengapi

 Commands:
   shengapi init      create new project API
   shengapi generate  generate new element
 
 Options:
   --version   Show version number                                      [boolean]
   -h, --help  Show help                                                [boolean]
 
 Examples:
   shengapi init -n Shengapi -a mongoose     create basic project with basic
   -vv                                       installs
   shengapi generate -n User                 create model, route and controller
                                             for User


```

###shengapi init
```
Usage: shengapi init -n project Name [-i] [-d] [-a] [-v]

Options:
  --version         Show version number                                [boolean]
  -n, --name        Project name                             [string] [required]
  -i, --install     Packages to install                                  [array]
  -d, --devinstall  Dev Packages to install                              [array]
  -a, --auto        create basic structure for api (-a mongoose || -a sequelize)
                                                                        [string]
  -v, --verbose     verbose level                                        [count]
  -h, --help        Show help                                          [boolean]

```
- If you use --auto, --install and --devinstall are ignored
- -v show you WARN messages and -vv show you INFO messages

 ###shengapi generate

```
Usage: shengapi generate -n element Name [-a] [-v]

Options:
  --version         Show version number                                [boolean]
  -n, --name        Element name                             [string] [required]
  -a, --attributes  model attributes (name:string age:number ...)        [array]
  -v, --verbose     verbose level                                        [count]
  -h, --help        Show help                                          [boolean]

```
