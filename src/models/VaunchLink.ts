import { VaunchFile } from "./VaunchFile";

export class VaunchLink extends VaunchFile {

  url:string

  constructor(name:string, content:string) {
    super(name);
    this.url = content
  }

  aliases: string[] = ["make-folder"];

  execute(args:string[]): void {
    window.location.href = this.url;
  }
}