import { VaunchFile } from "./VaunchFile";

export abstract class VaunchCommand extends VaunchFile {
  hasArgs:boolean = true;
  description:string = "";
  filetype:string = "VaunchCommand";

  execute(args: string[]): void {
    return
  }
  getBaseName(): string {
    return this.fileName;
  }

  info() {
    return {
      fileName: this.fileName,
      aliases: this.aliases,
    }
  }

  edit(args:string[]): void {
    // Commands cannot be edited
    return;
  }

  getDescription(): string {
    return this.description;
  }
}