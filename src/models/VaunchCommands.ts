import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import { VaunchFile } from "./VaunchFile";
import type { VaunchFolder } from "./VaunchFolder";
import { VaunchLink } from "./VaunchLink";

class VaunchCommand extends VaunchFile {
  execute(args: string[]): void {
    return
  }
  displayName(): string {
    return this.fileName
  }
}

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
    let newFileContent:string = args[1];

    let filePath = newFileName.split('/');
    let folder:VaunchFolder = folders.getFolderByName(filePath[0]);
    let newFile:VaunchLink = new VaunchLink(filePath[1], newFileContent);
    folder.createFile(newFile);
    console.log(folder.getFiles());
  }
}

export class VaunchRmdir extends VaunchCommand {
  constructor() {
    super("rmdir");
  }

  execute(args:string[]): void {
    const folders = useFolderStore();
    args.forEach(toDelete => {
      // Strip slashes from foldernames, if running from autocompleted value
      toDelete = toDelete.replace("/","");
      folders.remove(toDelete);
    })
  }
}

export class VaunchFeh extends VaunchCommand {
  constructor() {
    super("feh");
  }
  aliases: string[] = ["set-bg", "set-background"];

  execute(args:string[]): void {
    const config = useConfigStore();
    let background:string = args[0]
    config.background = background;
  }
}

export class VaunchHideGui extends VaunchCommand {
  constructor() {
    super("toggle-gui");
  }

  execute(args:string[]): void {
    const config = useConfigStore();
    config.showGUI = !config.showGUI;
  }
}