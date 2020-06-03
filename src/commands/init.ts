import {Command, flags} from '@oclif/command'
import { FileHandler, configDirectoryPath } from './../classes/FileHandler'
import { log } from './../helpers/logger'
import * as chalk  from 'chalk'
import * as inquirer from 'inquirer'
import * as figlet from 'figlet'
import * as os from 'os'
import { LogType } from '../helpers/logger'
import { CheatsheetDatabase } from '../classes/Cheatsheet'
import { NoteDatabase } from '../classes/Note'
const { version } = require('./../../package.json');
const fs = new FileHandler()

export default class Init extends Command {
  static description = 'install the dust-cli'

  static examples = [
    `$ dust init "`,
  ]



  static args = [{name: 'author', description: `Specify the author's name`, default: false}]



  async run() {
    const {args} = this.parse(Init)
    console.log(figlet.textSync("DUST - CLI"));
    console.log(`VERSION: ${chalk.cyan(version)}`)
    console.log(`CONFIG: ${chalk.cyan(configDirectoryPath)}`)
    let author = args.author
    if (!author) {
        let responses: any = await inquirer.prompt([{
            name: 'author',
            message: "Specify the author's name: ",
            default: "anonymous",
            type: 'input',
          }])
          author = responses.author
    } else {
    }
    log(`Current author has been set to: ${chalk.cyan(author)}`, LogType.Update);
    if (fs.doesTempDirExist()) {
        log(`Config directory: ${configDirectoryPath} was created ${chalk.green("successfully")}`, LogType.Success);
        if (fs.isTempDirWritable()) {
            log(`Config directory: ${configDirectoryPath} is ${chalk.green("writable")}`, LogType.Success);
            if (this.initDatabases()) {
                log(`${chalk.cyan(`Dust`)} is ready for action!`, LogType.Success)
            } else {
                log(`Could not initialize ${chalk.cyan(`Dust`)}. Please look into opening an issue: `, LogType.Error)
            }
        } else {
            log(`Config directory: ${configDirectoryPath} is ${chalk.red("not writable")}`, LogType.Error);
        }
    } else {
        log(`Config directory: ${configDirectoryPath} was created ${chalk.red("unsuccessfully")}`, LogType.Error);
    }
  }

  initDatabases (): boolean {
        const databaseDir = fs.create_path(['databases'], true);
        const databaseTotal = 4;
        let databaseCreated = 0;
        fs.createDir(databaseDir)
        if (fs.exists(databaseDir)) {
            log(`Database directory: ${databaseDir} was created ${chalk.green("successfully")}`, LogType.Success);
            if (fs.isDirWritable(databaseDir)) {
                log(`Database directory: ${databaseDir} is ${chalk.green("writable")}`, LogType.Success);
                // Creating Note database
                if (fs.touch(NoteDatabase)) {
                    log(`Note database created ${chalk.green("successfully")}`, LogType.Success);
                    databaseCreated++
                } else {
                    log(`Note database created ${chalk.red("unsuccessfully")}`, LogType.Error);
                }
                // Creating Cheatsheet database
                if (fs.touch(CheatsheetDatabase)) {
                    log(`Cheatsheet database created ${chalk.green("successfully")}`, LogType.Success);
                    databaseCreated++
                } else {
                    log(`Cheatsheet database created ${chalk.red("unsuccessfully")}`, LogType.Error);
                }
                // Creating Guide database
                if (fs.touch(fs.create_path(['databases/guide.nosql'], true))) {
                    log(`Guide database created ${chalk.green("successfully")}`, LogType.Success);
                    databaseCreated++
                } else {
                    log(`Guide database created ${chalk.red("unsuccessfully")}`, LogType.Error);
                }
                // Creating ToDo database
                if (fs.touch(fs.create_path(['databases/todo.nosql'], true))) {
                    log(`To Do database created ${chalk.green("successfully")}`, LogType.Success);
                    databaseCreated++
                } else {
                    log(`To Do database created ${chalk.red("unsuccessfully")}`, LogType.Error);
                }
                if (databaseCreated === 4) {
                    return true
                }
            } else {
                log(`Database directory: ${databaseDir} is ${chalk.red("not writable")}`, LogType.Error);
            }
        } else {
            log(`Database directory: ${databaseDir} was created ${chalk.red("unsuccessfully")}`, LogType.Error);
        }
        return false
  }
}
