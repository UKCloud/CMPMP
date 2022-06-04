import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useFolderStore } from "@/stores/folder";

export class VaunchEditFile extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Edits an existing files' content. If there is content in the file you do not want to change, a single '*' will leave that section the same",
      "The file extension must be supplied for the file to edit it.",
    ];
    const parameters: Parameter[] = [
      {
        name: "filepath",
        optional: false,
        repeatable: false,
      },
      {
        name: "prefix",
        optional: true,
        repeatable: false,
      },
      {
        name: "content",
        optional: false,
        repeatable: false,
      },
    ];
    const examples: Example[] = [
      {
        args: ["sites/example", "newsite.com"],
        description: [
          "Edits the Link file 'sites/example.lnk'. The file will now navigate to https://newsite.com",
        ],
      },
      {
        args: ["sites/example.qry", "exl", "example.com/lists?q=${}"],
        description: [
          "Edits the Query file 'sites/example.qry'. The file will now search example.com/lists?q=${}, and uses the prefix exl:",
        ],
      },
      {
        args: ["sites/example.qry", "*", "example.com/lists?q=${}"],
        description: [
          "Edits the Query file 'sites/example.qry'. The file will now search example.com/lists?q=${}, leaving the prefix the same",
        ],
      },
      {
        args: ["sites/example.qry", "exl", "*"],
        description: [
          "Edits the Query file 'sites/example.qry'. The file will now use the prefix exl: leaving the search link the same",
        ],
      },
    ];
    super("edit", longDescription, parameters, examples);
  }

  aliases: string[] = ["edit-file"];
  description = "Edits an existing file";

  execute(args: string[]): VaunchResponse {
    const folders = useFolderStore();
    const fullPath: string = args[0];
    // If fullPath is not defined, no path was passed
    if (!fullPath)
      return this.makeResponse(ResponseType.Error, `Please provide a file`);
    // Remove the first arg, the filepath
    args.shift();

    const filePath = fullPath.split("/");
    const folderName: string = filePath[0];
    const fileName: string = filePath[1];
    const folder: VaunchFolder = folders.getFolderByName(folderName);
    if (folder) {
      const file = folder.getFile(fileName);
      if (file) {
        // Send remaining args to the file to edit
        file.edit(args);
        return this.makeResponse(
          ResponseType.Success,
          `Edited file: ${fullPath}`
        );
      } else {
        return this.makeResponse(
          ResponseType.Error,
          `Could not find file: ${fullPath}`
        );
      }
    } else {
      return this.makeResponse(
        ResponseType.Error,
        `Could not find folder: ${folderName}`
      );
    }
  }
}
