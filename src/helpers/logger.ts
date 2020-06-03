import * as chalk from 'chalk'
export enum LogType {
    Success = "✔ ",
    Error = "❌",
    Warning = "⚠ ",
    Update = "👻",
    Default = "☕"
}

export enum  LogColor {
    Success = "green",
    Error = "red",
    Warning = "yellow",
    Update = "cyan",
    Default = ""
}

export enum  LogPrefix {
    Success = "SUCCESS:",
    Error = "ERROR:",
    Warning = "WARNING:",
    Update = "UPDATE:",
    Default = "INFO:"
}

export const generatePrefix = (logType: LogType, logPrefix: LogPrefix): string => {
    return `${logType} - ${logPrefix.padEnd(9, ' ')} `
}

export const getPrefixFromType = (logType: LogType): LogPrefix => {
    switch (logType) {
        case LogType.Success: return LogPrefix.Success; break;
        case LogType.Error: return LogPrefix.Error; break;
        case LogType.Warning: return LogPrefix.Warning; break;
        case LogType.Update: return LogPrefix.Update; break;
        default: return LogPrefix.Default; break;
    }
}

export const generateColor = (logType: LogType, content: string): string => {
    let colorized = content;
    switch (logType) {
        case LogType.Success: return chalk.green(colorized); break;
        case LogType.Error: return chalk.red(colorized); break;
        case LogType.Warning: return chalk.yellow(colorized); break;
        case LogType.Update: return chalk.cyan(colorized); break;
        default: return colorized; break;
    }
}

export const log = (content: string, logType: LogType = LogType.Default) => {
    const prefix = generatePrefix(logType, getPrefixFromType(logType));
    console.log(`${generateColor(logType, prefix)}${content}`)
}
