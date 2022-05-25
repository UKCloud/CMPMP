export abstract class VaunchFile {
  fileName: string
  aliases: string[];
  content:string;

  constructor(name:string) {
    this.fileName = name
    this.aliases = [];
    this.content = "";
  }

  getNames():string[] {
    let allNames:string[] = [this.fileName, ...this.aliases]
    return allNames;
  }

  abstract execute(args:string[]): void

  info(): any {
    return {
      fileName: this.fileName,
      aliases: this.aliases,
      content: this.content,
      type: this.constructor.name
    }
  }
}