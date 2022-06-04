import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useFolderStore } from "@/stores/folder";

export class VaunchSetIcon extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Changes the icon of a file or folder from its currently set icon.",
      "Can be any Font Awesome Free icon, i.e solid, or brands",
      "If the Icon Class is not provided, it will default to the solid icon class",
      "The file extension must be supplied for the file to set its icon.",
    ];
    const parameters: Parameter[] = [
      {
        name: "filepath",
        optional: false,
        repeatable: false,
      },
      {
        name: "iconName",
        optional: true,
        repeatable: false,
      },
      {
        name: "iconClass",
        optional: true,
        repeatable: false,
      },
    ];
    const examples: Example[] = [
      {
        args: ["sites/example.lnk", "newspaper"],
        description: [
          "Edits the icon for the file 'sites/example.lnk' to the newspaper icon, using the 'solid' icon class",
        ],
      },
      {
        args: ["sites/example.qry", "ubuntu", "brands"],
        description: [
          "Edits the icon for the file 'sites/example.qry' to the ubuntu icon, using the 'brands' icon class",
        ],
      },
      {
        args: ["sites", "ethernet"],
        description: [
          "Edits the icon for the folder 'sites' to the ethernet icon, using the 'solid' icon class",
        ],
      },
    ];
    super("set-icon", longDescription, parameters, examples);
  }
  description = "Changes the icon of an existing file/folder";

  execute(args: string[]): VaunchResponse {
    const folders = useFolderStore();
    const fullPath: string = args[0];
    const newIcon: string = args[1];
    const newIconClass: string = args[2];
    const splitPath = fullPath.split("/");

    const folderName: string = splitPath[0];
    const fileName: string = splitPath[1];
    const folder: VaunchFolder = folders.getFolderByName(folderName);

    if (folder && fileName) {
      const file = folder.getFile(fileName);
      if (file) {
        file.setIcon(newIcon, newIconClass);
        return this.makeResponse(
          ResponseType.Success,
          `Changed the icon of ${fullPath}`
        );
      } else {
        return this.makeResponse(
          ResponseType.Error,
          `The file ${fullPath} does not exist`
        );
      }
    } else if (folder) {
      // Assume we're attempting to set the folder's icon
      folder.setIcon(newIcon, newIconClass);
    }
    return this.makeResponse(
      ResponseType.Error,
      `The folder ${folderName} does not exist`
    );
  }
}
