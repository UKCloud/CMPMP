import { VaunchFile } from "./VaunchFile";
import { VaunchManual, type Example, type Parameter } from "./VaunchManual";
import { ResponseType, type VaunchResponse } from "./VaunchResponse";

export abstract class VaunchCommand extends VaunchFile {
  hasArgs = true;
  filetype = "VaunchCommand";
  manual: VaunchManual;

  constructor(
    fileName: string,
    longDescription: string[] = [""],
    parameter: Parameter[] = [],
    examples: Example[] = []
  ) {
    super(fileName);
    this.manual = new VaunchManual(longDescription, parameter, examples);
  }

  execute(args: string[]): VaunchResponse {
    return this.makeResponse(ResponseType.Success, "");
  }
  getBaseName(): string {
    return this.fileName;
  }

  info() {
    return {
      fileName: this.fileName,
      aliases: this.aliases,
    };
  }

  edit(args: string[]): void {
    // Commands cannot be edited
    return;
  }

  getDescription(): string {
    return this.description;
  }
}
