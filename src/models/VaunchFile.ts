export abstract class VaunchFile {
  fileName: string
  aliases: string[];
  content:string;
  icon:string;
  iconClass:string;
  hits:number;
  extension:string = "";
  filetype:string = "VaunchFile";

  constructor(name:string, icon:string = "file", iconClass:string = "solid", hits:number = 0) {
    this.fileName = name
    this.aliases = [];
    this.content = "";
    this.icon = icon;
    this.iconClass = iconClass;
    this.hits = hits
  }

  titleCase(): string {
    let prettyString = this.getBaseName().replace(/[-_]/g, ' ');
    return prettyString.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

  getNames():string[] {
    let allNames:string[] = [this.fileName, ...this.aliases]
    return allNames;
  }

  setIcon(newIcon:string = this.icon, iconClass:string = "solid") {
    this.icon = newIcon;
    this.iconClass = iconClass;
  }

  abstract execute(args:string[]): string|void

  getBaseName(): string {
    return this.fileName.split('.')[0]
  }

  getIdSafeName():string {
    return this.fileName.replace('.','-')
  }

  getDescription(): string {
    return this.content;
  }

  setName(newName:string) {
    this.fileName = newName;
  }

  abstract info(): any;
  
  abstract edit(args:string[]): void;
}