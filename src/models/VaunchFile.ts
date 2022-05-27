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

  titleCase(): string {
    return this.getBaseName().charAt(0).toUpperCase() + this.getBaseName().slice(1)
  }

  getNames():string[] {
    let allNames:string[] = [this.fileName, ...this.aliases]
    return allNames;
  }

  setIcon(newIcon:string) {
    this.icon = newIcon;
  }

  abstract execute(args:string[]): void

  getBaseName(): string {
    return this.fileName.split('.')[0]
  }

  getDescription(): string {
    return this.content;
  }

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