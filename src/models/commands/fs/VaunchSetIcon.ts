import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { useFolderStore } from "@/stores/folder";

export class VaunchSetIcon extends VaunchCommand {
  constructor() {
    let longDescription:string[] = ["Changes the icon of a file or folder from its currently set icon.","Can be any Font Awesome Free icon, i.e solid, or brands",
    "If the Icon Class is not provided, it will default to the solid icon class", "The file extension must be supplied for the file to set its icon."]
    let parameters:Parameter[] = [{
      name:"filepath",
      optional: false,
      repeatable: false,
    },
    {
      name:"iconName",
      optional: true,
      repeatable: false,
    },
    {
      name:"iconClass",
      optional: true,
      repeatable: false,
    }]
    let examples:Example[] = [{
      args: ["sites/example.lnk", "newspaper"],
      description: ["Edits the icon for the file 'sites/example.lnk' to the newspaper icon, using the 'solid' icon class"],
    },
    {
      args: ["sites/example.qry", "ubuntu", "brands"],
      description: ["Edits the icon for the file 'sites/example.qry' to the ubuntu icon, using the 'brands' icon class"]
    },
    {
      args: ["sites", "ethernet"],
      description: ["Edits the icon for the folder 'sites' to the ethernet icon, using the 'solid' icon class"]
    }]
    super("set-icon", longDescription, parameters, examples);
  }
  description: string = "Changes the icon of an existing file/folder";

  execute(args:string[]): void {
    const folders = useFolderStore();
    let fullPath:string = args[0];
    let newIcon:string = args[1]
    let newIconClass:string = args[2]
    let splitPath = fullPath.split('/');

    let folderName:string = splitPath[0];
    let fileName:string = splitPath[1];
    let folder:VaunchFolder = folders.getFolderByName(folderName);

    if (folder && fileName) {
      let file = folder.getFile(fileName);
      if (file) {
        file.setIcon(newIcon, newIconClass);
      }
    } else if (folder) {
      // Assume we're attempting to set the folder's icon
      folder.setIcon(newIcon, newIconClass);
    }
  }
}