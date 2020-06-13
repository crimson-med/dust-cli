import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'

export const configDirectory = ".dust"

export const configDirectoryPath = path.join(os.homedir(), configDirectory)

export class FileHandler {
    
    constructor() {
        this.createTempDir()
    }

    doesTempDirExist = ():boolean => {
        const pathed = path.join(configDirectoryPath);
        if (fs.existsSync(pathed)) {
            return true
        }
        return false
    }

    isTempDirWritable = (): boolean => {
        return this.isDirWritable(configDirectoryPath)
    }

    isDirWritable = (path: string): boolean => {
        try {
            fs.accessSync(path, fs.constants.W_OK);
            return true
        }
        catch (err) {
            return false
        }
    }

    createTempDir = (): boolean => {
        return this.createDir(configDirectoryPath);
    }

    touch = (path: string) => {
        if (this.exists(path)) {
            return true;
        } else {
            try {
                fs.closeSync(fs.openSync(path, 'w'));
                return true
            } catch (error) {
                return false
            }
        }
    }

    delete = (path: string) => {
        if (this.exists(path)) {
            fs.unlinkSync(path)
        }
    } 

    read = (content: string) => fs.readFileSync(content,{encoding:'utf8', flag:'r'})

    save = (path: string, content: any) => {
        let formatedContent = ""
        switch (typeof content) {
            case "object":
                formatedContent = JSON.stringify(content)
                break;
        
            default:
                formatedContent = content
                break;
        }
        try {
            fs.writeFileSync(path, formatedContent);
            return true
        } catch (error) {
            return false
        }
    }

    exists = (path: string) => {
        return fs.existsSync(path)
    } 

    createDir = (path: string): boolean => {
        if (this.exists(path) === false) {
            fs.mkdirSync(path)
            if (this.exists(path) === false) {
                return false
            }
            return true
        }
        return true
    }

    create_path = (paths: string[], fromAppTempDir: boolean = true, fromRunningDir: boolean = false):string => {
        if (fromAppTempDir === true) {
            return path.join(configDirectoryPath, ...paths)
        } else if (fromRunningDir) {
            return path.join(__dirname, ...paths)
        } else {
            return path.join(...paths)
        }
    }

    
}