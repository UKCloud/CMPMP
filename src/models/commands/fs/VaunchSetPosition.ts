import type { Dashboard } from "@/models/Dashboard";
import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFile } from "@/models/VaunchFile";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useDashboardStore } from "@/stores/dashboard";

export class VaunchSetPosition extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      `Sets the position of files/folders within the GUI. Position can be an integer, or string such as 'first', 'last', 'middle' etc...`,
      `When changing a file/folder's position it will displace other files/folders depending on the way it moved`,
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
      },
    ];
    const examples: Example[] = [
      {
        args: ["sites", "1"],
        description: [
          "Sets the position of the folder 'sites' to 1, the top of the folder/file list",
        ],
      },
      {
        args: ["sites", "top"],
        description: [
          "Sets the position of the folder 'sites' to the first position, equivalent to using '1'",
        ],
      },
      {
        args: ["sites"],
        description: [
          "Removes the set position for the 'sites' folder, causing it to go behind all sorted folders",
        ],
      },
      {
        args: ["sites/example.lnk", "2"],
        description: [
          "Set's the position of the file 'example.lnk' within the 'sites' folder to position 2, the second from the top",
        ],
      },
      {
        args: ["sites/example.lnk", "middle"],
        description: [
          "Set's the position of the file 'example.lnk' within the 'sites' folder to the central position in the folder",
        ],
      },
    ];
    super("set-position", longDescription, parameters, examples);
  }

  description = "Changes file/folder position";
  aliases: string[] = ["set-pos"];

  async execute(args: string[]): Promise<VaunchResponse> {
    const currentDashboard: Dashboard = useDashboardStore().currentDashboard;

    if (args.length < 1) {
      return this.makeResponse(ResponseType.Error, `Not enough arguments`);
    }

    const folderName = args[0].split("/")[0];
    const fileName = args[0].split("/")[1];
    let position: string = args[1];

    if (fileName) {
      // Setting a file's position. Get the file's folder, if it exists
      const folder: VaunchFolder | undefined =
        currentDashboard.getFolderByName(folderName);
      if (folder) {
        // If position is unset, set it to last
        if (!position) position = "last";
        const numberedPosition = stringPosToInt(
          position,
          folder.getFiles().length
        );

        const fileRepos: boolean = folder.setFilePosition(
          fileName,
          numberedPosition
        );
        if (!fileRepos) {
          return this.makeResponse(
            ResponseType.Error,
            `The file ${folderName}/${fileName} does not exist`
          );
        }
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
        const numberedPosition = stringPosToInt(
          position,
          currentDashboard.getItems().length
        );

        const folderRepos: boolean = currentDashboard.setPosition(
          folderName,
          numberedPosition
        );
        if (!folderRepos) {
          return this.makeResponse(
            ResponseType.Error,
            `The folder ${folderName} does not exist`
          );
        }
      } else currentDashboard.setPosition(folderName, -1);

      return this.makeResponse(
        ResponseType.Success,
        `Repositioned folder: ${folderName} to position ${position}`
      );
    }
  }
}

function stringPosToInt(stringPos: string, listLength: number): number {
  // Check if the position can be parsed to an int
  const parsed = parseInt(stringPos);
  if (parsed) return parsed;
  // Try and convert a word to a set position
  const firstPositions = ["first", "top", "beginning"];
  const middlePositions = ["middle", "center"];
  const lastPositions = ["last", "bottom", "end"];
  if (firstPositions.includes(stringPos)) return 0;
  if (middlePositions.includes(stringPos))
    return Math.round((listLength + 1) / 2);
  if (lastPositions.includes(stringPos)) return listLength + 1;
  // Else just send it to the back
  return listLength + 1;
}
