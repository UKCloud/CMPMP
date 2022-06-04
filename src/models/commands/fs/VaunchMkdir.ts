import { VaunchCommand } from "@/models/VaunchCommand";
import type { Parameter, Example } from "@/models/VaunchManual";
import { useFolderStore } from "@/stores/folder";

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