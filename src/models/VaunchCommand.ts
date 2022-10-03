import { VaunchFile } from "./VaunchFile";
import { VaunchManual, type Example, type Parameter } from "./VaunchManual";
import { ResponseType, type VaunchResponse } from "./VaunchResponse";

export abstract class VaunchCommand extends VaunchFile {
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

  hasArgs():boolean {
    return this.manual.parameters.length > 0;
  }

  async execute(args: string[]): Promise<VaunchResponse> {
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
