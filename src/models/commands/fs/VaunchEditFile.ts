import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { useFolderStore } from "@/stores/folder";

export class VaunchEditFile extends VaunchCommand {
  constructor() {
    let longDescription:string[] = ["Edits an existing files' content. If there is content in the file you do not want to change, a single '*' will leave that section the same",
    "The file extension must be supplied for the file to edit it."]
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