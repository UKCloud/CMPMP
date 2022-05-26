export abstract class VaunchFile {
  fileName: string
  aliases: string[];
  content:string;
  icon:string;

  constructor(name:string, icon:string = "file") {
    this.fileName = name
    this.aliases = [];
    this.content = "";
    this.icon = icon;
  }

  getNames():string[] {
    let allNames:string[] = [this.fileName, ...this.aliases]
    return allNames;
  }

  getContent():string {
    return this.content
  }

  setIcon(newIcon:string) {
    this.icon = newIcon;
  }

  abstract execute(args:string[]): void

  abstract displayName(): string

  info(): any {
    return {
      fileName: this.fileName,
      aliases: this.aliases,
      content: this.content,
      icon: this.icon,
      type: this.constructor.name
    }
  }
}