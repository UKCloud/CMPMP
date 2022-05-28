import { useFolderStore } from "@/stores/folder";
import { VaunchCommand } from "./VaunchCommand";
import type { VaunchFile } from "./VaunchFile";
import type { VaunchFolder } from "./VaunchFolder";
import { VaunchLink } from "./VaunchLink";
import { VaunchQuery } from "./VaunchQuery";

export class VaunchMkdir extends VaunchCommand {
  constructor() {
    super("mkdir");
  }

  aliases: string[] = ["make-folder"];

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
        newFile = new VaunchQuery(fileName, filePrefix, fileContent);
        // Icon name/class is the fourth/fith arg provided for VaunchLink
        iconName = args[3];
        iconClass = args[4];
      } else {
        let fileContent:string = args[1];
        newFile = new VaunchLink(fileName, fileContent);
        // Icon name/class is the third/fourth arg provided for VaunchLink
        iconName = args[2];
        iconClass = args[3];
      }
      
      if (newFile) {
        // Set the file icon if a custom icon was provided
        if (iconName) newFile.setIcon(iconName, iconClass);
        folder.createFile(newFile);
      }
    }
  }
}

export class VaunchSetIcon extends VaunchCommand {
  constructor() {
    super("set-icon");
  }

  execute(args:string[]): void {
    const folders = useFolderStore();
    let deletePath:string = args[0];

    let filePath = deletePath.split('/');
    let folderName:string = filePath[0];
    let fileName:string = filePath[1];
    let folder:VaunchFolder = folders.getFolderByName(folderName);
    let file = folder.getFile(fileName);
    if (file) {
      let newIcon:string = args[1]
      let newIconclass:string = args[2]
      file.setIcon(newIcon, newIconclass)
    }
  }
}

export class VaunchRmdir extends VaunchCommand {
  constructor() {
    super("rmdir");
  }

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

  execute(args:string[]): void {
    const folders = useFolderStore();
    let deletePath:string = args[0];

    let filePath = deletePath.split('/');
    let folderName:string = filePath[0];
    let fileToDelete:string = filePath[1];
    let folder:VaunchFolder = folders.getFolderByName(folderName);
    folder.removeFile(fileToDelete)
  }
}