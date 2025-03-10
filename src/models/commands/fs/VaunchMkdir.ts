import type { Dashboard } from "@/models/Dashboard";
import { VaunchCommand } from "@/models/VaunchCommand";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useDashboardStore } from "@/stores/dashboard";

export class VaunchMkdir extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      `Creates new folder(s), if the provided folders do not already exist.`,
    ];
    const parameters: Parameter[] = [
      {
        name: "folder",
        optional: false,
        repeatable: true,
      },
    ];
    const examples: Example[] = [
      {
        args: ["media", "social"],
        description: ["Creates two folders: media and social"],
      },
    ];
    super("mkdir", longDescription, parameters, examples);
  }

  description = "Creates folders";
  aliases: string[] = ["make-folder"];

  async execute(args: string[]): Promise<VaunchResponse> {
    const currentDashboard: Dashboard = useDashboardStore().currentDashboard;

    const existingFolders: string[] = [];
    args.forEach((newFolder) => {
      // Strip any trailing slashes from the foldername
      newFolder = newFolder.replace("/", "");
      if (
        newFolder.length > 0 &&
        !currentDashboard.getFolderNames().includes(newFolder)
      ) {
        currentDashboard.addFolder(newFolder);
      } else existingFolders.push(newFolder);
    });
    if (existingFolders.length != 0) {
      const plural = existingFolders.length > 1;
      return this.makeResponse(
        ResponseType.Info,
        `The folder${plural ? "s" : ""} ${existingFolders.join(
          ", "
        )} already exist${plural ? "" : "s"} and ${plural ? "were" : "was"
        } not made.`
      );
    }
    return this.makeResponse(
      ResponseType.Success,
      `Created folders: ${args.join(", ")}`
    );
  }
}
