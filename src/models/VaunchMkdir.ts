import { VaunchFile } from "./VaunchFile";

export class VaunchMkdir extends VaunchFile {

  fileName: string = "mkdir";

  constructor() {
    super("mkdir");
  }

  execute(args:string[]): void {
      console.log("executing mkdir");
  }
}