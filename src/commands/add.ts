import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import { Cheatsheet } from '../classes/Cheatsheet'
import { Guide } from '../classes/Guide'

const types = ['cheatsheet', 'note', 'guide']

export default class Add extends Command {
  static description = 'Add a new  dust'
    
  static examples = [
    `$ dust add "aws security policy"`,
  ]

  static flags = {
    type: flags.string({char: 't', options: types})
  }

  static args = [{name: 'type'}, {name: 'title'}, {name: 'description'} ]

  async run() {
    const {args, flags} = this.parse(Add)
    let type: string | undefined = ""
    // check args for faster use
    if (args.type && types.includes(args.type)) {
        console.log(`from args`);
        
        type = args.type
    } else {
        // check flag
        if (flags.type && types.includes(flags.type)) {
            type = flags.type
        } else {
            // If no coreect value in args or flags, inquirer them
            let responses: any = await inquirer.prompt([{
                name: 'type',
                message: 'Select a type of dust to create',
                type: 'list',
                choices: [{name: 'cheatsheet'}, {name: 'note'}, {name: 'guide'}],
            }])
            type = responses.type
        }
    }
    let title, description, content;
    switch (type) {
        case "cheatsheet":
            if (args.title && args.description) {
                title = args.title
                description = args.description
            } else {
                let responses: any = await inquirer.prompt([
                    {name: 'title', message: 'Enter a title', type: 'input'},
                    {name: 'command', message: 'Enter a command', type: 'input'},
                ])
                title = responses.title
                description = responses.command
            }
            const cht = new Cheatsheet(title, description)
            cht.save()
            break;

        case "note":
        
            break;

        case "guide":
            if (args.title) {
                title = args.title
            } else {
                let responses: any = await inquirer.prompt([
                    {name: 'title', message: 'Enter a title', type: 'input'},
                    {
                        name: 'guide',
                        type: 'editor',
                        message: 'Create a guide?',
                        default: '# My Title \n---\n\nLorem ipsum'
                    }
                ])
                title = responses.title
                content = responses.guide
            }
            const guide = new Guide(title, content)
            guide.save()
            break;
    
        default:
            break;
    }

  }
}
