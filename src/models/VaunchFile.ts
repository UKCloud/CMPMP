export abstract class VaunchFile {
  fileName: string
  aliases: string[];
  content:string;
  icon:string;
  iconClass:string;

  constructor(name:string, icon:string = "file", iconClass:string = "solid") {
    this.fileName = name
    this.aliases = [];
    this.content = "";
    this.icon = icon;
    this.iconClass = iconClass;
  }

  titleCase(): string {
    return this.getBaseName().charAt(0).toUpperCase() + this.getBaseName().slice(1)
  }

  getNames():string[] {
    let allNames:string[] = [this.fileName, ...this.aliases]
    return allNames;
  }

  setIcon(newIcon:string, iconClass:string = "solid") {
    this.icon = newIcon;
    this.iconClass = iconClass;
  }

  abstract execute(args:string[]): void

  getBaseName(): string {
    return this.fileName.split('.')[0]
  }

  getIdSafeName():string {
    return this.fileName.replace('.','-')
  }

  getDescription(): string {
    return this.content;
  }

  abstract info(): any;
}