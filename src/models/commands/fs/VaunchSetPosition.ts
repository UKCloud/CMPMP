import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useFolderStore } from "@/stores/folder";

export class VaunchSetPosition extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      `Sets the position of files/folders within the GUI. Position is set as an integer, and will displace other files/folders depending on the way it moved`,
    ];
    const parameters: Parameter[] = [
      {
        name: "folder|filepath",
        optional: false,
        repeatable: false,
      },
      {
        name: "position",
        optional: true,
        repeatable: false,
      }
    ];
    const examples: Example[] = [
      {
        args: ["sites", "1"],
        description: ["Sets the position of the folder 'sites' to 1, the top of the folder/file list"],
      },
      {
        args: ["sites"],
        description: ["Removes the set position for the 'sites' folder, causing it to go behind all sorted folders"],
      },
      {
        args: ["sites/example.lnk"],
        description: ["Set's the position of the file 'example.lnk' within the 'sites' folder to position 2, the second from the top"],
      }
    ];
    super("set-position", longDescription, parameters, examples);
  }

  description = "Changes file/folder position";
  aliases: string[] = ["set-pos"];

  execute(args: string[]): VaunchResponse {
    const folders = useFolderStore();
    if (args.length < 1) {
      return this.makeResponse(
        ResponseType.Error,
        `Not enough arguments`
      );
    }

    let folderName = args[0].split('/')[0];
    let fileName = args[0].split('/')[1];
    let position: number = parseInt(args[1]);

    if (fileName) {
      // Setting a file's position. Get the file's folder, if it exists
      let folder:VaunchFolder = folders.getFolderByName(folderName);
      if (folder) {
        // If position is unset, set it to -1
        if (position) {
          let fileRepos: boolean = folder.setFilePosition(fileName, position);
          if (!fileRepos) {
            return this.makeResponse(
              ResponseType.Error,
              `The file ${folderName}/${fileName} does not exist`
            );
          }
        } else folder.setFilePosition(folderName, -1);
      } else {
        return this.makeResponse(
          ResponseType.Error,
          `The folder ${folderName} does not exist`
        );
      }

      return this.makeResponse(
        ResponseType.Success,
        `Repositioned file: ${folderName}/${fileName} to position ${position}`
      );
    } else {
      // Setting a folder's position
      if (position) {
        let folderRepos: boolean = folders.setPosition(folderName, position);
        if (!folderRepos) {
          return this.makeResponse(
            ResponseType.Error,
            `The folder ${folderName} does not exist`
          );
        }
      } else folders.setPosition(folderName, -1);

      return this.makeResponse(
        ResponseType.Success,
        `Repositioned folder: ${folderName} to position ${position}`
      );
    }
  }
}
