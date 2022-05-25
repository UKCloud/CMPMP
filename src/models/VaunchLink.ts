import { VaunchFile } from "./VaunchFile";

export class VaunchLink extends VaunchFile {

  constructor(name:string, content:string, icon:string = "file") {
    super(name, icon);
    this.content = content;
  }

  execute(args:string[]): void {
    window.location.href = this.content;
  }

  displayName():string {
    return this.fileName + ".lnk"
  }
}