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
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g dust-cli
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
* [`dust hello [FILE]`](#dust-hello-file)
* [`dust help [COMMAND]`](#dust-help-command)

## `dust hello [FILE]`

describe the command here

```
USAGE
  $ dust hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ dust hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/crimson-med/dust-cli/blob/v0.0.0/src/commands/hello.ts)_

## `dust help [COMMAND]`

display help for dust

```
USAGE
  $ dust help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.1/src/commands/help.ts)_
<!-- commandsstop -->
