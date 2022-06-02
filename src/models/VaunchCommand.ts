import { VaunchFile } from "./VaunchFile";
import { VaunchManual, type Example, type Parameter } from "./VaunchManual";

export abstract class VaunchCommand extends VaunchFile {
  hasArgs:boolean = true;
  filetype:string = "VaunchCommand";
  manual:VaunchManual;

  constructor(fileName:string, parameter:Parameter[]=[], examples:Example[]=[]) {
    super(fileName);
    this.manual = new VaunchManual(parameter, examples);
  }

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