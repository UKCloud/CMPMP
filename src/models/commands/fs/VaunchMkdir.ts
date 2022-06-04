import { VaunchCommand } from "@/models/VaunchCommand";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useFolderStore } from "@/stores/folder";

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

  execute(args: string[]): VaunchResponse {
    const folder = useFolderStore();
    args.forEach((newFolder) => {
      if (newFolder.length > 0 && !folder.folderNames.includes(newFolder)) {
        folder.add(newFolder);
      }
    });
    return this.makeResponse(
      ResponseType.Success,
      `Created folders: ${args.join(", ")}`
    );
  }
}
