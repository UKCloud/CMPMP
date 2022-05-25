export abstract class VaunchFile {
  fileName: string
  aliases: string[];

  constructor(name:string) {
    this.fileName = name
    this.aliases = [];
  }

  getNames():string[] {
    let allNames:string[] = [this.fileName, ...this.aliases]
    return allNames;
  }

  abstract execute(args:string[]): void
}