import {Command, flags} from '@oclif/command'
import * as nosql from 'nosql'
import { CheatsheetDatabase, searchCheatsheet, searchToInquirer, loadCheatsheet } from '../classes/Cheatsheet';
import { log } from '../helpers/logger';
import inquirer = require('inquirer');

export default class Search extends Command {
  static description = 'search your dust for anything'

  static examples = [
    `$ dust search "aws security policy"`,
  ]

  static flags = {
    cheatsheets : flags.boolean({char: 'c',  description: 'search in cheatsheets only', default: false}),
    notes : flags.boolean({char: 'n',  description: 'search in notes only', default: false}),
    guides : flags.boolean({char: 'g',  description: 'search in guides only', default: false}),
  }

  static args = [{name: 'search'}]

  async run() {
    const {args, flags} = this.parse(Search)

    if (args.search) {
        console.log(`searching for: ${args.search}`)
        if (flags.cheatsheets) {
            console.log(`should only search cheatsheets`)
            const tet: any[]  = await searchCheatsheet(args.search)
            if (tet && tet.length > 0) {
                console.log(searchToInquirer(tet))
                let responses: any = await inquirer.prompt([{
                    name: 'cheatsheet',
                    message: 'Select a dust to execute',
                    type: 'list',
                    choices: searchToInquirer(tet),
                }])
                const id = responses.cheatsheet.split("-")[0].trim();
                const target = await loadCheatsheet(id)
                if (target) {
                    target.getActions();
                }
            }
        }
        if (flags.notes) {
            console.log(`should only search notes`)
        }
        if (flags.guides) {
            console.log(`should only search guides`)
        }
    } else {
        console.log(`please specify a search term for instance \n$ dust search "aws security policy"`)
    }
   
  }
}
