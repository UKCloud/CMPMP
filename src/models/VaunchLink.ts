import { VaunchUrlFile } from "./VaunchUrlFile";

export class VaunchLink extends VaunchUrlFile {

  constructor(name:string, content:string, icon:string = "file",
   iconClass:string = "solid", hits:number = 0) {
    if (!name.endsWith('.lnk')) {
      name = name+".lnk"
    }
    super(name, icon, iconClass, hits);
    this.content = content;
  }

  getDescription(): string {
    return "Naviagte to: " + this.getCorrectURL();
  }

  execute(args:string[]): void {
    this.hits++;
    // Ensure file content is "linkable"
    let linkUrl:URL|undefined = this.createUrl();
    if (linkUrl) {
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
      type: this.constructor.name,
      hits: this.hits
    }
  }

  edit(args: string[]): void {
    if (args[0]) {
      this.content = args[0]
    }
  }
}