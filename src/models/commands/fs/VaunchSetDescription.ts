import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFile } from "@/models/VaunchFile";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useFolderStore } from "@/stores/folder";

export class VaunchSetDescription extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Sets the description for a file. Descriptions are displayed as a tooltip when hovering over the file's entry.",
      "The file extension must be supplied to set the file's description.",
    ];
    const parameters: Parameter[] = [
      {
        name: "filename",
        optional: false,
        repeatable: false,
      },
      {
        name: "description",
        optional: false,
        repeatable: false,
      },
    ];
    const examples: Example[] = [
      {
        args: ["sites/example.lnk", "Goes to an example site"],
        description: [
          "Changes the description of the file 'example.lnk' within the 'sites' folder",
        ],
      },
    ];
    super("set-description", longDescription, parameters, examples);
  }
  aliases: string[] = ["set-desc"];
  description = "Sets the description of a file's tooltip";

  async execute(args: string[]): Promise<VaunchResponse> {
    const folders = useFolderStore();
    const fullPath: string | undefined = args.shift();
    if (!fullPath)
      return this.makeResponse(ResponseType.Error, `Please provide a file`);

    const filePath = fullPath.split("/");
    const folderName: string = filePath[0];
    const fileName: string = filePath[1];
    const folder: VaunchFolder = folders.getFolderByName(folderName);

    if (folder) {
      const file: VaunchFile | undefined = folder.getFile(fileName);
      if (file) {
        file.description = args.join(" ");
      } else {
        return this.makeResponse(
          ResponseType.Error,
          `The file ${fullPath} does not exist`
        );
      }
      
      return this.makeResponse(
        ResponseType.Success,
        `Edited description of file ${filePath}`
      );
    } else {
      return this.makeResponse(
        ResponseType.Error,
        `The folder ${folderName} does not exist`
      );
    }
  }
}
