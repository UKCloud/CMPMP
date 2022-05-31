import type { VaunchFolder } from "./VaunchFolder";
import { VaunchUrlFile } from "./VaunchUrlFile";

export class VaunchLink extends VaunchUrlFile {

  extension:string = ".lnk"
  filetype:string = "VaunchLink";

  constructor(name:string, content:string, parent:VaunchFolder, icon:string = "file",
   iconClass:string = "solid", hits:number = 0, description:string="") {
    if (!name.endsWith('.lnk')) {
      name = name+".lnk"
    }
    super(name, parent, icon, iconClass, hits, description);
    this.content = content;
    this.parent = parent;
  }

  trimString(stringTotrim:string, trimTo:number=50): string {
    if (stringTotrim.length > (trimTo - 3)) {
      return `${stringTotrim.substring(0,trimTo)}...`
    } else return stringTotrim;
  }

  getDescription(): string {
    if (this.description) return `Navigate to: ${this.description}`;
    return "Naviagte to: " + this.trimString(this.getCorrectURL());
  }

  execute(args:string[]): void {
    // Ensure file content is "linkable"
    let linkUrl:URL|undefined = this.createUrl();
    if (linkUrl) {
      this.hits++;
      // Navigate to page, in new tab if "_blank" is an argument
      if (args[0] == "_blank") {
        window.open(linkUrl,'_blank');
      } else window.location.href = linkUrl.href;
    }
  }

  info(): any {
    return {
      fileName: this.fileName,
      aliases: this.aliases,
      content: this.content,
      icon: this.icon,
      iconClass: this.iconClass,
      type: this.filetype,
      hits: this.hits,
      description: this.description,
    }
  }

  edit(args: string[]): void {
    if (args[0]) {
      this.content = args[0]
    }
  }

  setName(newName:string) {
    if (!newName.endsWith('.lnk')) {
      this.fileName = newName+".lnk"
    } else this.fileName = newName;
  }
}