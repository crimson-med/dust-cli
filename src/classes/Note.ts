import { Dust, Platform } from './Dust'
import {FileHandler} from './FileHandler'
const fs = new FileHandler();
export const NoteDatabase = fs.create_path(['databases/note.nosql'], true)
export class Note extends Dust {
    constructor(title: string, isEncrypted: boolean = false,platform: Platform = Platform.Other, description: string = "", tags: string[] = [],) {
        super(title, isEncrypted, platform, description, tags);
    }
}