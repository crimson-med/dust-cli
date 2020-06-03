import { generateHash } from '../helpers/generators'

export enum Platform {
    Windows,
    Mac,
    Linux,
    Other
}
export class Dust {
    id: string
    title: string
    isEncrypted: boolean
    platform: Platform
    description: string
    tags: string[]
    created: number
    constructor(title: string, isEncrypted: boolean = false, platform: Platform = Platform.Other, description: string = "",  tags: string[] = []) {
        this.title = title;
        this.isEncrypted = isEncrypted;
        this.platform = platform
        this.description = description
        this.tags = tags
        this.id = generateHash(10)
        this.created = + new Date()
    }
 
}