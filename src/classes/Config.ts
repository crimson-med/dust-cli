import { FileHandler } from './FileHandler';
import { log, LogType } from '../helpers/logger';
import chalk = require('chalk');
const fs = new FileHandler();
export const ConfigFile = fs.create_path(['/config.json'], true)

export interface configObject {
    author: string,
    version: string,
    encryptionKey: string,
}
export class Config {
    author: string
    version: string
    encryptionKey: string
    constructor(config: configObject) {
        this.author = config.author
        this.version = config.version
        this.encryptionKey = config.encryptionKey
    }

    getData() {
        return {author: this.author, version: this.version, encryptionKey: this.encryptionKey }
    }

    save() {
        if (fs.save(ConfigFile, this.getData())) {
            log(`Config for ${chalk.cyan(this.author)} was saved to the database`, LogType.Success)
            return true
        } else {
            return false
        }
    }
}

export const loadConfig = () => {
    const config = JSON.parse(fs.read(ConfigFile, {encoding:'utf8', flag:'r'}));
    if (config) {
        return new Config(config as configObject);
    } else {
        return null
    }
}   