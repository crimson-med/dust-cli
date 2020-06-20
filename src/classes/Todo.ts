import { Dust, Platform } from './Dust'
import {FileHandler} from './FileHandler'
import { log, LogType } from '../helpers/logger';
import { spawnSync } from 'child_process';
import * as nosql from 'nosql'
import * as chalk from 'chalk'
import inquirer = require('inquirer');
import { generateFilename, generateHash } from '../helpers/generators';
const fs = new FileHandler();
export const TodoDatabase = fs.create_path(['databases/todo.nosql'], true)
const dbTodo = nosql.load(TodoDatabase);

export class Todo extends Dust {
    content: string
    db: any
    constructor(title: string, content: string, isEncrypted: boolean = false,  platform: Platform = Platform.Other, description: string = "", tags: string[] = [], id: string = '') {
        super(title,isEncrypted,  platform, description, tags);
        this.content  = content
        this.db = nosql.load(TodoDatabase);
        if (id && id !== '') {
            this.id = id
        }
    }

    async save() {
        // extrapolate tags for easier search
        let result = false;
        log(`Todo ${chalk.cyan(this.id)} - ${chalk.cyan(this.title)} was saved at the following location: ${chalk.cyan(this.filename)}`, LogType.Success)
        const exists  = await this.exists()
        if (exists) {
            this.db.update({
                id: this.id,
                title: this.title,
                isEncrypted: this.isEncrypted,
                platform: this.platform,
                description: this.description,
                tags: this.tags,
                updated: this.created
            }).where('id', this.id)
            result = true;
        } else {
            this.db.insert({
                id: this.id,
                title: this.title,
                isEncrypted: this.isEncrypted,
                platform: this.platform,
                description: this.description,
                tags: this.tags,
                created: this.created
            })
            result = true;
        }
        log(`Todo ${chalk.cyan(this.id)} - ${chalk.cyan(this.title)} was saved to the database`, LogType.Update)
        return result
    }

    async exists() {
        let result = false
        const self = await searchTodo(null, this.id, true)
        if (self) {
            result = true
        }
        return result
    }

    async delete() {
        log(`Deleting ${chalk.cyan(this.id)} - ${chalk.cyan(this.title)}`, LogType.Warning)
        await this.db.remove().where('id', this.id)
    }

    async rename() {
        const info = await searchTodo(null, this.id);
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
            name: 'todo',
            type: 'editor',
            message: (isNew)?'Create a todo?':'Edit a todo',
            default: (isNew)? baseDefault : defaultContent
        }
    ])
    if (responses.todo) {
        content = responses.todo
    }
    return content
}


export const searchTodo = (title: null|string = null, id: null|string = null, onlyOne: boolean = false): Promise<any[]> => {
    let results: any[] = []
    return new Promise( (resolutionFunc,rejectionFunc) => {
        dbTodo.find().make((builder: any) => {
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

export const loadTodo = async  (id: string): Promise<Todo|undefined> => {
    const db = nosql.load(TodoDatabase);
    const cht = await searchTodo(null, id)
    if (cht && cht.length > 0) {
        let content = fs.read(cht[0].filename);
        if (!content) {
            content = ""
        }
        return new Todo(
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
