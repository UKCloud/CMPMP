export abstract class VaunchFile {
  fileName: string
  aliases: string[];

  constructor(name:string) {
    this.fileName = name
    this.aliases = [];
  }

  getNames():string[] {
    let allNames:string[] = [...this.aliases, this.fileName]
    return allNames;
  }

  abstract execute(args:string[]): void
}