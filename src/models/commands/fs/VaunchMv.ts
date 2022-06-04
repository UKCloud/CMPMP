import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFile } from "@/models/VaunchFile";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { useFolderStore } from "@/stores/folder";

export class VaunchMv extends VaunchCommand {
  constructor() {
    let longDescription:string[] = ["Moves files and folders to new locations. Can also be used to rename files/folders",
      "The file extension must be supplied when moving a file."]
    let parameters:Parameter[] = [{
      name: "sourcePath",
      optional: false,
      repeatable: false
    },
    {
      name: "destinationPath",
      optional: false,
      repeatable: false
    }]
    let examples:Example[] = [{
      args:["sites/example.lnk", "other/"],
      description: ["Moves the file 'example.lnk' within the 'sites' folder to the 'other' folder, retaining its filename"]
    },
    {
      args:["sites/exmaple.lnk","sites/example.lnk"],
      description: ["Renames the file 'exmaple.lnk' to 'example.lnk', staying in the same folder"]
    },
    {
      args:["sites/","other/"],
      description: ["Renames the folder 'sites' to 'other'"]
    }]
    super("mv", longDescription, parameters, examples);
  }
  aliases: string[] = ["move", "move-file", "move-folder"];
  description: string = "Moves or Renames files and folders";

  execute(args:string[]): void {
    if (args.length != 2) return;

    const folders = useFolderStore();
    let source:string = args[0];
    let dest:string = args[1];

    let sourcePath = source.split('/');
    let folderToMove:string = sourcePath[0];
    let fileToMove:string = sourcePath[1];

    let destPath = dest.split('/');
    let newFolderDest:string = destPath[0];
    let newFileName:string = destPath[1];

    // Always need a folder, so get it now
    let folder:VaunchFolder = folders.getFolderByName(folderToMove);

    // If no source file was supplied, we're moving a folder
    // Remove the folder from the store, rename it, then add it back in
    // This is to update the underlying Maps key so we still get the folder with O(1)
    if (!fileToMove && folder) {
      folders.remove(folderToMove);
      folder.name = newFolderDest;
      folders.insert(folder);
    } else {
      // If a source file was supplied, we're moving a file
      let file:VaunchFile|undefined = folder.getFile(fileToMove);
      if (file) {
        // If no new filename is provided, set it to the same as the file
        if (!newFileName) newFileName = file.fileName;
        // Get the current file's extenion and add it if the new name doesn't include it
        if (!newFileName.endsWith(file.extension)) {
          newFileName = `${newFileName}${file.extension}`;
        }

        // Get the new folder, and only continue if it exists
        let newFolder:VaunchFolder = folders.getFolderByName(newFolderDest);
        if (newFolder){
          // If the new folder contains a file with the same name, exit
          if (newFolder.getFile(newFileName)) return
  
          // Change the name, remove the file from the current folder, then add it to the new folder
          // If the folder hasnt, this essentially does the same as the folder move to update the Map's key
          file.setName(newFileName);
          folder.removeFile(fileToMove)
          newFolder.addFile(file);
        }
      }
    }
  }
}