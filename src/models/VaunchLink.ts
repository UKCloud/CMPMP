import { VaunchFile } from "./VaunchFile";

export class VaunchLink extends VaunchFile {

  constructor(name:string, content:string) {
    super(name);
    this.content = content
  }

  execute(args:string[]): void {
    window.location.href = this.content;
  }
}