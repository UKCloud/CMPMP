import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import { VaunchFile } from "./VaunchFile";

export class VaunchMkdir extends VaunchFile {
  constructor() {
    super("mkdir");
  }

  execute(args:string[]): void {
    const folder = useFolderStore();
    args.forEach((newFolder) => {
      if (!folder.folderNames.includes(newFolder)) {
        folder.add(newFolder);
      }
    })
  }
}

export class VaunchRmdir extends VaunchFile {
  constructor() {
    super("rmdir");
  }

  execute(args:string[]): void {
    const folder = useFolderStore();
    args.forEach((toDelete) => {
      folder.remove(toDelete);
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