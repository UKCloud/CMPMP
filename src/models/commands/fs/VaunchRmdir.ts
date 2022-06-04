import { VaunchCommand } from "@/models/VaunchCommand";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useFolderStore } from "@/stores/folder";

export class VaunchRmdir extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Deletes the folder specified. Folders with files within them will not be deleted unless the -f switch is supplied.",
    ];
    const parameters: Parameter[] = [
      {
        name: "-f",
        optional: true,
        repeatable: false,
      },
      {
        name: "folder",
        optional: false,
        repeatable: true,
      },
    ];
    const examples: Example[] = [
      {
        args: ["sites"],
        description: [
          "Deletes the folder 'sites', assuming it has no files within it",
        ],
      },
      {
        args: ["-f", "sites"],
        description: [
          "Deletes the folder 'sites', even it has files within it",
        ],
      },
      {
        args: ["sites", "foo"],
        description: [
          "Deletes the folders 'sites', and 'foo'. If one of the folders has files within it, that folder will not be deleted",
        ],
      },
    ];
    super("rmdir", longDescription, parameters, examples);
  }
  description = "Deletes folders";

  aliases: string[] = ["remove-folder", "delete-folder"];

  execute(args: string[]): VaunchResponse {
    if (args.length == 0) {
      return this.makeResponse(ResponseType.Error, "Not enough arguments");
    }
    const folders = useFolderStore();
    let force = false;
    if (args[0] == "-f") {
      force = true;
      args.shift();
    }
    const failedToDelete: string[] = [];
    args.forEach((toDelete) => {
      // Strip slashes from folder names, if running from autocompleted value
      toDelete = toDelete.replace("/", "");
      if (folders.getFolderByName(toDelete)) {
        if (force) {
          folders.remove(toDelete);
        } else if (folders.getFolderByName(toDelete).files.size == 0) {
          folders.remove(toDelete);
        }
      } else failedToDelete.push(toDelete);
    });
    if (failedToDelete.length == 0) {
      return this.makeResponse(
        ResponseType.Success,
        `Deleted folder: ${args.join(", ")}`
      );
    } else {
      const plural = failedToDelete.length > 1 ? true : false;
      return this.makeResponse(
        ResponseType.Error,
        `Folder${plural ? "s" : ""}: ${failedToDelete.join(", ")} do${
          plural ? "" : "es"
        } not exist`
      );
    }
  }
}
