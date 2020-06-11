import { Dust, Platform } from './Dust'
import {FileHandler} from './FileHandler'
import { log, LogType } from '../helpers/logger';
import { spawnSync } from 'child_process';
import * as nosql from 'nosql'
import * as chalk from 'chalk'
import inquirer = require('inquirer');
const fs = new FileHandler();
export const CheatsheetDatabase = fs.create_path(['databases/cheatsheet.nosql'], true)
const dbCheatsheet = nosql.load(CheatsheetDatabase);

export class Cheatsheet extends Dust {
    command: string
    moreInfo: string
    db: any
    constructor(title: string, command: string, isEncrypted: boolean = false,  platform: Platform = Platform.Other, description: string = "", tags: string[] = [], moreInfo: string = "", id: string = '') {
        super(title,isEncrypted,  platform, description, tags);
        this.command  = command
        this.moreInfo = moreInfo
        this.db = nosql.load(CheatsheetDatabase);
        if (id && id !== '') {
            this.id = id
        }
    }

    save() {
        this.db.insert({
            id: this.id,
            title: this.title,
            command: this.command,
            isEncrypted: this.isEncrypted,
            platform: this.platform,
            description: this.description,
            tags: this.tags,
            moreInfo: this.moreInfo,
        })
        log(`Cheatsheet ${this.id} - ${this.title} was saved to the database`, LogType.Update)
    }

    async getActions() {
        log(`ID: ${chalk.green(this.id)}`)
        log(`Title: ${chalk.green(this.title)}`)
        if (this.description) {
            log(`Description: ${chalk.green(this.description)}`)
        }
        if (this.tags && this.tags.length > 0) {
            log(`Description: ${chalk.green(this.description)}`)
        }
        let responses: any = await inquirer.prompt([{
            name: 'action',
            message: 'What do you want to do?',
            type: 'list',
            choices: [{name: 'execute'}, {name: 'modify'}, {name: 'delete'}],
        }])
        switch (responses.action) {
            case "execute":
                this.execute()
                break;
        
            default:
                break;
        }
    }

    execute() {
        const args = this.command.split(" ");
        let command: any;
        if (args && args.length > 0) {
            if (args.length > 1) {
                command = spawnSync( args[0], args.slice(1) );
            } else {
                command = spawnSync(args[0]);
            }
        }
        if (command) {
            console.log( `stderr: ${command.stderr.toString()}` );
            console.log( `stdout: ${command.stdout.toString()}` );
        }
    }
}


export const searchCheatsheet = (title: null|string = null, id: null|string = null): Promise<any[]> => {
    let results: any[] = []
    return new Promise( (resolutionFunc,rejectionFunc) => {
        dbCheatsheet.find().make((builder: any) => {
            if (title !== null) {
                builder.search('title', title)
            }
            if (id !== null) {
                builder.search('id', id)
            }
            builder.callback((err: any, response: any[]) => {
              //const res = response.filter(e => e.title.includes(title))
              resolutionFunc(response)
          });
       });
    });
}

export const loadCheatsheet = async  (id: string): Promise<Cheatsheet|undefined> => {
    const db = nosql.load(CheatsheetDatabase);
    const cht = await searchCheatsheet(null, id)
    if (cht && cht.length > 0) {
        return new Cheatsheet(
            cht[0].title,
            cht[0].command,
            cht[0].isEncrypted,
            cht[0].platform,
            cht[0].description,
            cht[0].tags,
            cht[0].moreInfo,
            cht[0].id
        )
    } else {
        return undefined
    }
}
