import { useFolderStore } from "@/stores/folder";
import { VaunchCommand } from "./VaunchCommand";
import type { VaunchFile } from "./VaunchFile";
import type { VaunchFolder } from "./VaunchFolder";
import { VaunchLink } from "./VaunchLink";
import { VaunchQuery } from "./VaunchQuery";
import type { VaunchUrlFile } from "./VaunchUrlFile";

export class VaunchMkdir extends VaunchCommand {
  constructor() {
    super("mkdir");
  }

  aliases: string[] = ["make-folder"];
  description: string = "Creates folders"

  execute(args:string[]): void {
    const folder = useFolderStore();
    args.forEach((newFolder) => {
      if (newFolder.length > 0 && !folder.folderNames.includes(newFolder)){
        folder.add(newFolder);
      }
    })
  }
}

export class VaunchTouch extends VaunchCommand {
  constructor() {
    super("touch");
  }
  aliases: string[] = ["make-file"];
  description: string = "Creates new files"

  execute(args:string[]): void {
    const folders = useFolderStore();
    let newFileName:string = args[0];

    let filePath = newFileName.split('/');
    let folderName:string = filePath[0];
    let fileName:string = filePath[1];

    let folder:VaunchFolder = folders.getFolderByName(folderName);
    if (folder) {
      let newFile:VaunchFile|undefined;
      let iconName:string|undefined;
      let iconClass:string|undefined;

      if (fileName.endsWith('.qry')) {
        let filePrefix:string = args[1];
        let fileContent:string = args[2];
        if (filePrefix && fileContent) {
          newFile = new VaunchQuery(fileName, filePrefix, fileContent, folder);
          // Icon name/class is the fourth/fith arg provided for VaunchLink
          iconName = args[3];
          iconClass = args[4];
        }
      } else {
        let fileContent:string = args[1];
        newFile = new VaunchLink(fileName, fileContent, folder);
        // Icon name/class is the third/fourth arg provided for VaunchLink
        iconName = args[2];
        iconClass = args[3];
      }
      
      if (newFile) {
        // Set the file icon if a custom icon was provided
        if (iconName) newFile.setIcon(iconName, iconClass);
        folder.addFile(newFile);
      }
    }
  }
}

export class VaunchEditFile extends VaunchCommand {
  constructor() {
    super("edit");
  }

  aliases: string[] = ["edit-file"];
  description: string = "Edits an existing file"

  execute(args:string[]): void {
    const folders = useFolderStore();
    let fullPath:string = args[0];
    // Remove the first arg, the filepath
    args.shift()

    let filePath = fullPath.split('/');
    let folderName:string = filePath[0];
    let fileName:string = filePath[1];
    let folder:VaunchFolder = folders.getFolderByName(folderName);

    let file = folder.getFile(fileName);
    if (file) {
      // Send remaining args to the file to edit
      file.edit(args)
    }
  }
}

export class VaunchSetIcon extends VaunchCommand {
  constructor() {
    super("set-icon");
  }
  description: string = "Changes the icon of an existing file/folder"

  execute(args:string[]): void {
    const folders = useFolderStore();
    let fullPath:string = args[0];
    let newIcon:string = args[1]
    let newIconclass:string = args[2]
    let splitPath = fullPath.split('/');

    let folderName:string = splitPath[0];
    let fileName:string = splitPath[1];
    let folder:VaunchFolder = folders.getFolderByName(folderName);

    if (folder && fileName) {
      let file = folder.getFile(fileName);
      if (file) {
        file.setIcon(newIcon, newIconclass);
      }
    } else if (folder) {
      // Assume we're attempting to set the folder's icon
      folder.setIcon(newIcon, newIconclass);
    }
  }
}

export class VaunchRmdir extends VaunchCommand {
  constructor() {
    super("rmdir");
  }
  description: string = "Deletes directories and files inside"

  aliases: string[] = ["remove-folder", "delete-folder"];

  execute(args:string[]): void {
    const folders = useFolderStore();
    args.forEach(toDelete => {
      // Strip slashes from foldernames, if running from autocompleted value
      toDelete = toDelete.replace("/","");
      folders.remove(toDelete);
    })
  }
}

export class VaunchRm extends VaunchCommand {
  constructor() {
    super("rm");
  }
  aliases: string[] = ["remove-file", "delete-file"];
  description: string = "Deletes files"

  execute(args:string[]): void {
    const folders = useFolderStore();
    let fullPath:string = args[0];

    let filePath = fullPath.split('/');
    let folderName:string = filePath[0];
    let fileToDelete:string = filePath[1];
    let folder:VaunchFolder = folders.getFolderByName(folderName);
    folder.removeFile(fileToDelete)
  }
}

export class VaunchMv extends VaunchCommand {
  constructor() {
    super("mv");
  }
  aliases: string[] = ["move", "move-file", "move-folder"];
  description: string = "Moves or Renames files and folders"

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

    if (!fileToMove && folder) {
      // If no source file was supplied, we're moving a folder
      // Remove the folder from the store, rename it, then add it back in
      // This is to update the underlying Maps key so we still get the folder with O(1)
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
  
          // Chnage the name, remove the file from the current folder, then add it to the new folder
          // If the folder hasnt, this essentially does the same as the folder move to update the Map's key
          file.setName(newFileName);
          folder.removeFile(fileToMove)
          newFolder.addFile(file);
        }
      }
    }
  }
}

export class VaunchSetDescription extends VaunchCommand {
  constructor() {
    super("set-description");
  }
  aliases: string[] = ["set-desc"];
  description: string = "Sets the description of a file's tooltip"

  execute(args:string[]): void {
    const folders = useFolderStore();
    let fullPath:string|undefined = args.shift();
    if (fullPath) {
      let filePath = fullPath.split('/');
      let folderName:string = filePath[0];
      let fileName:string = filePath[1];
      let folder:VaunchFolder = folders.getFolderByName(folderName);
      let file:VaunchFile|undefined = folder.getFile(fileName);
      if (file) file.description = args.join(' ');
    }
  }
}