import {Command, flags} from '@oclif/command'
import * as nosql from 'nosql'
import { CheatsheetDatabase, searchCheatsheet, loadCheatsheet } from '../classes/Cheatsheet';
import { log } from '../helpers/logger';
import inquirer = require('inquirer');
import { searchGuide, loadGuide } from '../classes/Guide';
import { generateSearchToInquirer } from '../helpers/generators';

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
            const tet: any[]  = await searchCheatsheet(args.search)
            if (tet && tet.length > 0) {
                let responses: any = await inquirer.prompt([{
                    name: 'cheatsheet',
                    message: 'Select a dust to execute',
                    type: 'list',
                    choices: generateSearchToInquirer(tet),
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
            const tet: any[]  = await searchGuide(args.search)
            if (tet && tet.length > 0) {
                let responses: any = await inquirer.prompt([{
                    name: 'guide',
                    message: 'Select a dust to execute',
                    type: 'list',
                    choices: generateSearchToInquirer(tet),
                }])
                const id = responses.guide.split("-")[0].trim();
                const target = await loadGuide(id)
                if (target) {
                    target.getActions();
                }
            }
        }
    } else {
        console.log(`please specify a search term for instance \n$ dust search "aws security policy"`)
    }
   
  }
}
