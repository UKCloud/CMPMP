import { useFolderStore } from "@/stores/folder";
import { VaunchCommand } from "./VaunchCommand";
import type { VaunchFile } from "./VaunchFile";
import type { VaunchFolder } from "./VaunchFolder";
import { VaunchLink } from "./VaunchLink";
import type { Example, Parameter } from "./VaunchManual";
import { VaunchQuery } from "./VaunchQuery";

export class VaunchMkdir extends VaunchCommand {
  constructor() {
    let longDescription:string[] = [`Creates new folder(s), if the provided folders do not already exist.`]
    let parameters:Parameter[] = [{
      name:"folder",
      optional: false,
      repeatable: true,
    }]
    let examples:Example[] = [{
      args: ["media", "social"],
      description: ["Creates two folders: media and social"],
    }]
    super("mkdir", longDescription, parameters, examples);
  }
  
  description: string = "Creates folders"
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
    let longDescription:string[] = [`Creates new file(s) within a folder. A file will only be created in the folder name exists,
    and a file does not already exist with the provided name. Two types of files can be made: Link files (.lnk) and Query files (.qry)`, 
    `Link files redirect to the page within the file's content. Query files allow additional arguments to be passed when running,
    to search using that URL, or navigate to a defined page, by replacing '\${}' within the file's content with the provided arguments.`,
    `Query files can be ran either by typing the full filepath, or using a defined shortened prefix, followed by a colon.`,
    `If no file extension is specified, a link file will be created by default.`]
    let parameters:Parameter[] = [{
      name:"filepath",
      optional: false,
      repeatable: false,
    },
    {
      name:"prefix",
      optional: true,
      repeatable: false,
    },
    {
      name:"content",
      optional: false,
      repeatable: false,
    }]
    let examples:Example[] = [{
      args: ["sites/example", "example.com"],
      description: ["Creates a Link file within the 'sites' folder. The file will navigate to https://example.com"],
    },
    {
      args: ["sites/example.qry", "ex", "example.com/search?q=${}"],
      description: ["Creates a Query file within the 'sites' folder.",
      "Can be executed with: 'sites/example.qry foo', or 'ex: foo'"],
    }]
    super("touch", longDescription, parameters, examples);
  }
  aliases: string[] = ["make-file"];
  description: string = "Creates new files";

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
    let longDescription:string[] = ["Edits an existing files' content. If there is content in the file you do not want to change, a single '*' will leave that section the same"]
    let parameters:Parameter[] = [{
      name:"filepath",
      optional: false,
      repeatable: false,
    },
    {
      name:"prefix",
      optional: true,
      repeatable: false,
    },
    {
      name:"content",
      optional: false,
      repeatable: false,
    }]
    let examples:Example[] = [{
      args: ["sites/example", "newsite.com"],
      description: ["Edits the Link file 'sites/example.lnk'. The file will now navigate to https://newsite.com"],
    },
    {
      args: ["sites/example.qry", "exl", "example.com/lists?q=${}"],
      description: ["Edits the Query file 'sites/example.qry'. The file will now search example.com/lists?q=${}, and uses the prefix exl:"]
    },
    {
      args: ["sites/example.qry", "*", "example.com/lists?q=${}"],
      description: ["Edits the Query file 'sites/example.qry'. The file will now search example.com/lists?q=${}, leaving the prefix the same"]
    },
    {
      args: ["sites/example.qry", "exl", "*"],
      description: ["Edits the Query file 'sites/example.qry'. The file will now use the prefix exl: leaving the search link the same"]
    }]
    super("edit", longDescription, parameters, examples);
  }

  aliases: string[] = ["edit-file"];
  description: string = "Edits an existing file";

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
    let longDescription:string[] = ["Changes the icon of a file or folder from its currently set icon.","Can be any Font Awesome Free icon, i.e solid, or brands",
    "If the Icon Class is not provided, it will default to the solid icon class"]
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

export class VaunchRmdir extends VaunchCommand {
  constructor() {
    super("rmdir");
  }
  description: string = "Deletes directories and files inside";

  aliases: string[] = ["remove-folder", "delete-folder"];

  execute(args:string[]): void {
    const folders = useFolderStore();
    let force: boolean = false;
    if (args[0] == "-f") {
      force = true;
      args.shift();
    }
    args.forEach(toDelete => {
      // Strip slashes from folder names, if running from autocompleted value
      toDelete = toDelete.replace("/","");
      if (force) {
        folders.remove(toDelete);
      } else if (folders.getFolderByName(toDelete).files.size == 0 ) {
        folders.remove(toDelete);
      }
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
  description: string = "Sets the description of a file's tooltip";

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