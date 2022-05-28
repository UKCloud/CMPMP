import { VaunchFile } from "./VaunchFile";

export class VaunchQuery extends VaunchFile {

  prefix:string

  constructor(name: string, prefix:string, content: string, icon: string = "magnifying-glass",
    iconClass: string = "solid") {
    if (!name.endsWith('.qry')) {
      name = name + ".qry"
    }
    super(name, icon, iconClass);
    this.prefix = prefix.replace(':','');
    this.content = content;
  }

  execute(args: string[]): void {
    throw new Error("Method not implemented.");
  }

  info(): any {
    return {
      fileName: this.fileName,
      aliases: this.aliases,
      prefix: this.prefix,
      content: this.content,
      icon: this.icon,
      iconClass: this.iconClass,
      type: this.constructor.name
    }
  }

}