import { VaunchUrlFile } from "./VaunchUrlFile";

export class VaunchQuery extends VaunchUrlFile {

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

  getNames():string[] {
    let nameAndPrefix:string[] = [this.fileName, this.prefix]
    return nameAndPrefix;
  }

  execute(args: string[]): void|string {
    if (args.length == 0) {
      return this.prefix
    }

    let newLocation:string;
    // If file content contains multiple replacable sections
    // each arg will be used to replace each section
    if (this.content.includes('${1}')) {
        newLocation = this.content;
        for (let i = 0; i < args.length; i++ ) {
            let arg:string = args[i];
            newLocation = newLocation.replace(`\${${i+1}}`, arg)
        }
    } else {
      // Else, replace all ${} instances with the single provided arg
      let encodedargs = encodeURIComponent(args[0]).replace(/%20/g, "+");
      newLocation = this.content.replace(/\${}/g, encodedargs)
    }

    // Ensure the final file content is "linkable"
    let linkUrl:string|undefined = this.createUrl(newLocation);
    if (linkUrl) {
      window.location.href = linkUrl;
    }
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