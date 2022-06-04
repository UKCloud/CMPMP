import { VaunchCommand } from "@/models/VaunchCommand";
import type { Parameter, Example } from "@/models/VaunchManual";
import { useFolderStore } from "@/stores/folder";

export class VaunchRmdir extends VaunchCommand {
  constructor() {
    let longDescription:string[] = ["Deletes the folder specified. Folders with files within them will not be deleted unless the -f switch is supplied."]
    let parameters:Parameter[] = [{
      name: "-f",
      optional:true,
      repeatable:false
    },
    {
      name: "folder",
      optional: false,
      repeatable: true
    }]
    let examples:Example[] = [{
      args:["sites"],
      description: ["Deletes the folder 'sites', assuming it has no files within it"]
    },
    {
      args:["-f","sites"],
      description: ["Deletes the folder 'sites', even it has files within it"]
    },
    {
      args:["sites", "foo"],
      description: ["Deletes the folders 'sites', and 'foo'. If one of the folders has files within it, that folder will not be deleted"]
    }]
    super("rmdir", longDescription, parameters, examples);
  }
  description: string = "Deletes folders";

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
      if (folders.getFolderByName(toDelete)) {
        if (force) {
          folders.remove(toDelete);
        } else if (folders.getFolderByName(toDelete).files.size == 0 ) {
          folders.remove(toDelete);
        }
      }
    })
  }
}