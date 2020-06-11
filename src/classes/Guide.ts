import { Dust, Platform } from './Dust'
import {FileHandler} from './FileHandler'
import { log, LogType } from '../helpers/logger';
import { spawnSync } from 'child_process';
import * as nosql from 'nosql'
import * as chalk from 'chalk'
import inquirer = require('inquirer');
import { generateFilename } from '../helpers/generators';
const fs = new FileHandler();
export const GuideDatabase = fs.create_path(['databases/guide.nosql'], true)
const dbGuide = nosql.load(GuideDatabase);

export class Guide extends Dust {
    content: string
    filename: string
    db: any
    constructor(title: string, content: string, isEncrypted: boolean = false,  platform: Platform = Platform.Other, description: string = "", tags: string[] = [], id: string = '') {
        super(title,isEncrypted,  platform, description, tags);
        this.content  = content
        this.db = nosql.load(GuideDatabase);
        this.filename = fs.create_path(['guides', generateFilename(this.title, ".md")], true)
        if (id && id !== '') {
            this.id = id
        }
    }

    save() {
        // extrapolate tags for easier search
        let result = false;
        if (fs.save(this.filename, this.content)) {
            log(`Guide ${chalk.cyan(this.id)} - ${chalk.cyan(this.title)} was saved at the following location: ${chalk.cyan(this.filename)}`, LogType.Success)
            this.db.insert({
                id: this.id,
                title: this.title,
                content: this.content,
                filename: this.filename,
                isEncrypted: this.isEncrypted,
                platform: this.platform,
                description: this.description,
                tags: this.tags,
            })
            result = true
            log(`Guide ${chalk.cyan(this.id)} - ${chalk.cyan(this.title)} was saved to the database`, LogType.Update)
        } else {
            log(`Guide ${chalk.red(this.id)} - ${chalk.red(this.title)} could not be saved at the following location: ${chalk.red(this.filename)}`, LogType.Error)
        }
        return result
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
            choices: [ {name: 'edit'}, {name: 'rename'}, {name: 'open'}, {name: 'delete'}],
        }])
        switch (responses.action) {
            case "execute":
                //this.execute()
                break;
        
            default:
                break;
        }
    }

}


export const searchGuide = (title: null|string = null, id: null|string = null): Promise<any[]> => {
    let results: any[] = []
    return new Promise( (resolutionFunc,rejectionFunc) => {
        dbGuide.find().make((builder: any) => {
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

export const loadGuide = async  (id: string): Promise<Guide|undefined> => {
    const db = nosql.load(GuideDatabase);
    const cht = await searchGuide(null, id)
    if (cht && cht.length > 0) {
        return new Guide(
            cht[0].title,
            cht[0].content,
            cht[0].isEncrypted,
            cht[0].platform,
            cht[0].description,
            cht[0].tags,
            cht[0].moreInfo,
        )
    } else {
        return undefined
    }
}
