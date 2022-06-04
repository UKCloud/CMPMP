import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { useFolderStore } from "@/stores/folder";

export class VaunchRm extends VaunchCommand {
  constructor() {
    let longDescription:string[] = ["Deletes the file specified. The file extension must be supplied for the file to be deleted."]
    let parameters:Parameter[] = [{
      name: "file",
      optional: false,
      repeatable: true
    }]
    let examples:Example[] = [{
      args:["sites/example.lnk"],
      description: ["Deletes the file 'example.lnk' within the 'sites' folder"]
    },
    {
      args:["sites/example.lnk","other/foo.qry"],
      description: ["Deletes the files 'sites/example.lnk' and 'other/foo.qry"]
    }]
    super("rm", longDescription, parameters, examples);
  }
  aliases: string[] = ["remove-file", "delete-file"];
  description: string = "Deletes files"

  execute(args:string[]): void {
    const folders = useFolderStore();
    for (let filepath of args) {
      let filePath = filepath.split('/');
      let folderName:string = filePath[0];
      let fileToDelete:string = filePath[1];
      let folder:VaunchFolder = folders.getFolderByName(folderName);
      if (folder) folder.removeFile(fileToDelete)
    }
  }
}