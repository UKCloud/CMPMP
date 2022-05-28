import { VaunchFile } from "./VaunchFile";

export class VaunchCommand extends VaunchFile {
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
}