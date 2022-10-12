import type { Dashboard } from "@/models/Dashboard";
import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useDashboardStore } from "@/stores/dashboard";

export class VaunchRm extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Deletes the file specified. The file extension must be supplied for the file to be deleted.",
    ];
    const parameters: Parameter[] = [
      {
        name: "file",
        optional: false,
        repeatable: true,
      },
    ];
    const examples: Example[] = [
      {
        args: ["sites/example.lnk"],
        description: [
          "Deletes the file 'example.lnk' within the 'sites' folder",
        ],
      },
      {
        args: ["sites/example.lnk", "other/foo.qry"],
        description: [
          "Deletes the files 'sites/example.lnk' and 'other/foo.qry",
        ],
      },
    ];
    super("rm", longDescription, parameters, examples);
  }
  aliases: string[] = ["remove-file", "delete-file"];
  description = "Deletes files";

  async execute(args: string[]): Promise<VaunchResponse> {
    if (args.length == 0) {
      return this.makeResponse(ResponseType.Error, "Not enough arguments");
    }
    const currentDashboard: Dashboard = useDashboardStore().currentDashboard;

    const failedToDelete: string[] = [];
    for (const filepath of args) {
      const filePath = filepath.split("/");
      const folderName: string = filePath[0];
      const fileToDelete: string = filePath[1];
      const folder: VaunchFolder | undefined =
        currentDashboard.getFolderByName(folderName);
      if (folder) {
        const deleted = folder.removeFile(fileToDelete);
        if (!deleted) failedToDelete.push(filePath.join("/"));
        // After deleting the file, re-organise the file's positions
        // to update them after a deletion
        folder.organiseFiles(folder.getFiles());
      } else failedToDelete.push(filePath.join("/"));
    }

    if (failedToDelete.length == 0) {
      return this.makeResponse(
        ResponseType.Success,
        `Deleted files: ${args.join(", ")}`
      );
    } else {
      const plural = failedToDelete.length > 1 ? true : false;
      return this.makeResponse(
        ResponseType.Error,
        `The file${plural ? "s" : ""}: 
          ${failedToDelete.join(", ")} do${plural ? "" : "es"} not exist and ${plural ? "were" : "was"
        } not deleted`
      );
    }
  }
}
