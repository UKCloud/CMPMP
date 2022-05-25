import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import { VaunchFile } from "./VaunchFile";
import type { VaunchFolder } from "./VaunchFolder";
import { VaunchLink } from "./VaunchLink";

export class VaunchMkdir extends VaunchFile {
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

export class VaunchTouch extends VaunchFile {
  constructor() {
    super("touch");
  }
  aliases: string[] = ["make-file"];

  execute(args:string[]): void {
    const folders = useFolderStore();
    let newFileName:string = args[0];
    let newFileContent:string = args[1];

    let filePath = newFileName.split('/');
    let currentFolder:VaunchFolder = folders.get(filePath[0]);
  }
}

export class VaunchRmdir extends VaunchFile {
  constructor() {
    super("rmdir");
  }

  execute(args:string[]): void {
    const folders = useFolderStore();
    args.forEach(toDelete => {
      folders.remove(toDelete);
    })
  }
}

export class VaunchFeh extends VaunchFile {
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