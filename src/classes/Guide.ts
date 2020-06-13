import { Dust, Platform } from './Dust'
import {FileHandler} from './FileHandler'
import { log, LogType } from '../helpers/logger';
import { spawnSync } from 'child_process';
import * as nosql from 'nosql'
import * as chalk from 'chalk'
import inquirer = require('inquirer');
import { generateFilename, generateHash } from '../helpers/generators';
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

    async save() {
        this.filename = fs.create_path(['guides', generateFilename(this.title, ".md")], true)
        // extrapolate tags for easier search
        //TODO: if exist in db then update else insert
        let result = false;
        if (fs.save(this.filename, this.content)) {
            log(`Guide ${chalk.cyan(this.id)} - ${chalk.cyan(this.title)} was saved at the following location: ${chalk.cyan(this.filename)}`, LogType.Success)
            const exists  = await this.exists()
            if (exists.existsDatabase) {
                this.db.update({
                    id: this.id,
                    title: this.title,
                    filename: this.filename,
                    isEncrypted: this.isEncrypted,
                    platform: this.platform,
                    description: this.description,
                    tags: this.tags,
                }).where('id', this.id)
            } else {
                this.db.insert({
                    id: this.id,
                    title: this.title,
                    filename: this.filename,
                    isEncrypted: this.isEncrypted,
                    platform: this.platform,
                    description: this.description,
                    tags: this.tags,
                })
            }
            
           
            result = true
            log(`Guide ${chalk.cyan(this.id)} - ${chalk.cyan(this.title)} was saved to the database`, LogType.Update)
        } else {
            log(`Guide ${chalk.red(this.id)} - ${chalk.red(this.title)} could not be saved at the following location: ${chalk.red(this.filename)}`, LogType.Error)
        }
        return result
    }

    async exists() {
        let result = {existsDatabase: false, existsFile: false}
        const self = await searchGuide(null, this.id, true)
        if (self) {
            result.existsDatabase = true
        }
        if (fs.exists(this.filename)) {
            result.existsFile = true
        }
        return result
    }

    async delete() {
        log(`Deleting ${chalk.cyan(this.id)} - ${chalk.cyan(this.title)}`, LogType.Warning)
        await this.db.remove().where('id', this.id)
        fs.delete(this.filename)
    }

    async rename() {
        const info = await searchGuide(null, this.id);
        if (info && info.length > 0) {
            let responses: any = await inquirer.prompt([
                {name: 'title', message: 'Enter a title', type: 'input'},
            ])
            if (responses.title) {
                await this.delete()
                this.title = responses.title
                this.id = generateHash(10)
                await this.save()
            }
        }
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
            choices: [ {name: 'edit'}, {name: 'rename'}, {name: 'open'}, {name: 'view'}, {name: 'delete'}],
        }])
        switch (responses.action) {
            case "edit":
                const newContent = await getContent(this.content)
                if (newContent) {
                    this.content = newContent
                    await this.save()
                }
                break;
            case "open": 
                log(`Opening ${chalk.cyan(this.id)} - ${chalk.cyan(this.title)}`)
                break
            case "rename": 
                //log(`Opening ${chalk.cyan(this.id)} - ${chalk.cyan(this.title)}`)
                await this.rename()
                break
            case "delete":
                this.delete()
                break;
            // view
            default:
                log(`Viewing ${chalk.cyan(this.id)} - ${chalk.cyan(this.title)}`)
                console.log(this.content)
                break;
        }
    }

}

export const getContent = async (defaultContent: string = ''): Promise<string> => {
    const baseDefault = '# My Title \n---\n\nLorem ipsum'
    let isNew = true
    if (defaultContent !== '' && defaultContent !== baseDefault ) {
        isNew = false
    }
    let content = ""
    let responses: any = await inquirer.prompt([
        {
            name: 'guide',
            type: 'editor',
            message: (isNew)?'Create a guide?':'Edit a guide',
            default: (isNew)? baseDefault : defaultContent
        }
    ])
    if (responses.guide) {
        content = responses.guide
    }
    return content
}


export const searchGuide = (title: null|string = null, id: null|string = null, onlyOne: boolean = false): Promise<any[]> => {
    let results: any[] = []
    return new Promise( (resolutionFunc,rejectionFunc) => {
        dbGuide.find().make((builder: any) => {
            if (title !== null) {
                builder.search('title', title)
            }
            if (id !== null) {
                builder.search('id', id)
            }
            if (onlyOne) {
                builder.first()
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
        let content = fs.read(cht[0].filename);
        if (!content) {
            content = ""
        }
        return new Guide(
            cht[0].title,
            content,
            cht[0].isEncrypted,
            cht[0].platform,
            cht[0].description,
            cht[0].tags,
            cht[0].id,
        )
    } else {
        return undefined
    }
}
