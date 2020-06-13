dust-cli
========

A simple note, cheatsheet taking cli with easy search

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dust-cli.svg)](https://npmjs.org/package/dust-cli)
[![Downloads/week](https://img.shields.io/npm/dw/dust-cli.svg)](https://npmjs.org/package/dust-cli)
[![License](https://img.shields.io/npm/l/dust-cli.svg)](https://github.com/crimson-med/dust-cli/blob/master/package.json)

<!-- toc -->

* [Usage](#usage)
* [Commands](#commands)
* [Guides](doc/)
  
  
  
  <!-- tocstop -->
  
  # Usage
  
  <!-- usage -->
  
  ```sh-session
  $ yarn global add dust-cli
  $ dust init
  $ dust COMMAND
  running command...
  $ dust (-v|--version|version)
  dust-cli/0.0.0 darwin-x64 node-v12.9.1
  $ dust --help [COMMAND]
  USAGE
  $ dust COMMAND
  ...
  ```
  
  <!-- usagestop -->
  
  # Commands
  
  <!-- commands -->
* [`dust init`](#dust-init)
* [`dust search [TITLE]`](#dust-search-title)
* [`dust add [TYPE] [TITLE] [DESCRIPTION]`](#dust-add-type-title-description)
* [`dust help [COMMAND]`](#dust-help-command)

## `dust init`

This only needs to be ran after installation or upgrade. It will initialize all databases and local storage.

You can directly pass the auhor to not get promped by the interactive CLI.

```
USAGE
  $ dust init
  $ dust init [USERNAME]

EXAMPLE
  $ dust init crimson-med
```

## `dust search [TITLE]`

```
USAGE
  $ dust search [SEARCH]

OPTIONS
  -c, --cheatsheets  search in cheatsheets only
  -g, --guides       search in guides only
  -n, --notes        search in notes only

EXAMPLE
  $ dust search "aws security"
  $ dust search mystring -n
```

## `dust add [TYPE] [TITLE] [DESCRIPTION]`

Add new dust, you can select the type and title and the command / description.

```
USAGE
  $ dust add [TYPE] [TITLE] [DESCRIPTION]

OPTIONS
  -t, --type=cheatsheet|note|guide

EXAMPLE
  $ dust add "aws security policy" "another test" --t=note 
  $ dust add cheatsheet la "ls -a"
```

## `dust help [COMMAND]`

View the help or the help for a specific command

```
USAGE
  $ dust help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

<!-- commandsstop -->

# Dev Usage

A few commands to dev

```
$ ./bin/run init
$ ./bin/run add cheatsheet la "ls -a"
$ ./bin/run search la -c
```
