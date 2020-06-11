export const generateHash = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}

export const generateFilename = (content: string, extension: string, toLowerCase: boolean = true) => {
    let result = content
    result = result.replace(/[^a-z0-9]/gi, '_')
    if (toLowerCase) {
        result = result.toLowerCase()
    }
    if (extension[0] === ".") {
        result = result+extension
    } else {
        result = result+"."+extension
    }
    return result
}

export const generateSearchToInquirer = (list: any[]) => {
    return list.map(e => {return {name: e.id+' - '+e.title}})
}