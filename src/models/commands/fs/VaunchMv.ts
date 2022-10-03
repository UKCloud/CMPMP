import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFile } from "@/models/VaunchFile";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import type { VaunchUrlFile } from "@/models/VaunchUrlFile";
import { useFolderStore } from "@/stores/folder";

export class VaunchMv extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Moves files and folders to new locations. Can also be used to rename files/folders",
      "The file extension must be supplied when moving a file.",
    ];
    const parameters: Parameter[] = [
      {
        name: "sourcePath",
        optional: false,
        repeatable: false,
      },
      {
        name: "destinationPath",
        optional: false,
        repeatable: false,
      },
    ];
    const examples: Example[] = [
      {
        args: ["sites/example.lnk", "other/"],
        description: [
          "Moves the file 'example.lnk' within the 'sites' folder to the 'other' folder, retaining its filename",
        ],
      },
      {
        args: ["sites/exmaple.lnk", "sites/example.lnk"],
        description: [
          "Renames the file 'exmaple.lnk' to 'example.lnk', staying in the same folder",
        ],
      },
      {
        args: ["sites/", "other/"],
        description: ["Renames the folder 'sites' to 'other'"],
      },
    ];
    super("mv", longDescription, parameters, examples);
  }
  aliases: string[] = ["move", "move-file", "move-folder"];
  description = "Moves or Renames files and folders";

  async execute(args: string[]): Promise<VaunchResponse> {
    if (args.length != 2) {
      return this.makeResponse(ResponseType.Error, "Not enough arguments");
    }

    const folders = useFolderStore();
    const source: string = args[0];
    const dest: string = args[1];

    const sourcePath = source.split("/");
    const folderToMove: string = sourcePath[0];
    const fileToMove: string = sourcePath[1];

    const destPath = dest.split("/");
    const newFolderDest: string = destPath[0];
    let newFileName: string = destPath[1];

    // Always need a folder, so get it now
    const folder: VaunchFolder = folders.getFolderByName(folderToMove);

    if (!folder) {
      return this.makeResponse(
        ResponseType.Error,
        `Source folder '${folderToMove}' does not exist`
      );
    }

    // If no source file was supplied, we're moving a folder
    // Remove the folder from the store, rename it, then add it back in
    // This is to update the underlying Maps key so we still get the folder with O(1)
    if (!fileToMove && folder) {

      // Check if a folder with that name already exists
      let existingFolder:VaunchFolder = folders.getFolderByName(newFolderDest);
      if (existingFolder) {
        return this.makeResponse(
          ResponseType.Error,
          `Destination folder '${newFolderDest}' already exists`
        );
      }
      folders.remove(folderToMove);
      folder.name = newFolderDest;
      folders.insert(folder);
      return this.makeResponse(
        ResponseType.Success,
        `Renamed folder ${folderToMove} to ${newFolderDest}`
      );
    }

    // If a source file was supplied, we're moving a file
    const file: VaunchUrlFile | undefined = folder.getFile(fileToMove);
    if (file) {
      // If no new filename is provided, set it to the same as the file
      if (!newFileName) newFileName = file.fileName;
      // Get the current file's extension and add it if the new name doesn't include it
      if (!newFileName.endsWith(file.extension)) {
        newFileName = `${newFileName}${file.extension}`;
      }

      // Get the new folder, and only continue if it exists
      const newFolder: VaunchFolder = folders.getFolderByName(newFolderDest);
      if (newFolder) {
        // If the new folder contains a file with the same name, return info that the dest file already exists
        if (newFolder.getFile(newFileName)) {
          return this.makeResponse(
            ResponseType.Info,
            `A file with the name ${newFileName} already exists in the destination folder. ${source} was not moved.`
          );
        }

        // Change the name, remove the file from the current folder, then add it to the new folder
        // If the folder hasn't, this essentially does the same as the folder move to update the Map's key
        file.setName(newFileName);
        folder.removeFile(fileToMove);
        newFolder.addFile(file);
        file.parent = newFolder;
      } else {
        return this.makeResponse(
          ResponseType.Error,
          `The folder ${newFolderDest} does not exist`
        );
      }
      return this.makeResponse(
        ResponseType.Success,
        `Moved file ${source} to ${dest}`
      );
    } else {
      // If the source file doesn't exist, return an error
      return this.makeResponse(
        ResponseType.Error,
        `The file ${fileToMove} does not exist`
      );
    }
  }
}
