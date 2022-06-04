import { VaunchCommand } from "@/models/VaunchCommand";
import { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import { readImportFile } from "@/utilities/exporter";

export class VaunchImport extends VaunchCommand {
  constructor() {
    let longDescription:string[] = ["Imports an exported Vaunch configuration into this instance. Files/Folders will be imported by default, only adding new folders.",
      "Config can additionally be imported, as well as force importing all folders, deleting all of your current folders.",
      "Folder content can additionally be merged with the export file if desired"]
    let parameters:Parameter[] = [{
      name: "-f",
      optional: true,
      repeatable: false,
    },
    {
      name: "-m",
      optional: true,
      repeatable: false,
    },
    {
      name: "files",
      optional: true,
      repeatable: false,
    },
    {
      name: "config",
      optional: true,
      repeatable: false,
    }]
    let examples:Example[] = [{
      args: [],
      description: ["Imports only new folders from the exported file.",
        "If the export has a folder called 'sites' and so does your current instance, this folder will be skipped"]
    },
    {
      args: ["files"],
      description: ["Functionally equivalent to running 'import' with no arguments"]
    },
    {
      args: ["-c"],
      description: ["Imports only the config from the exported file, such as the colour scheme, GUI visibility, and default search file."]
    },
    {
      args: ["files", "config"],
      description: ["Imports both files/folders and config from the exported file.", "Existing folders will be skipped"]
    },
    {
      args: ["-m"],
      description: ["Imports files/folders and merges existing folders from the export, adding new files into existing folders"]
    },
    {
      args: ["-f"],
      description: ["Force imports files/folders into Vaunch, deleting all current folders before replacing them with the content of the exported file"]
    }]
    super("import", longDescription, parameters, examples);
  }
  description = "Imports vaunch from a file";

  execute(args: string[]): void {
    let importElem = document.createElement('input');
    importElem.type = "file";
    importElem.click();
    let importReader = readImportFile

    // If '-f' is passed to import, overwrite everything
    let overwrite:boolean = args.includes("-f") ? true:false;
    let mergeFiles:boolean = args.includes("-m") ? true:false;
    // After setting flag variables, remove them from args
    args = args.filter(e => e !== '-f')
    args = args.filter(e => e !== '-m')
    // If 'files' is passed to import import files, or if nothing was passed
    // (not including flags, which are now removed) import just files by default
    let importFolders:boolean = args.length == 0 || args.includes("files") ? true:false;
    let importConfig:boolean = args.includes("config") ? true:false;

    importElem.addEventListener('change', function () {
      if (this.files) {
        importReader(this.files[0]).then(function (importData) {
          const folders = useFolderStore();
          const config = useConfigStore();

          // Delete all folders if -f is supplied to import
          if (overwrite) folders.removeAll();

          // Only import files/folders if importConfig is true
          if (importFolders) {
            for (let folder of (importData as any).folders) {
              let folderToImport:VaunchFolder = VaunchFolder.parse(folder);
              // If this folder doesn't exist, import it. If overwriting, all folders will be gone by now
              if (!folders.getFolderByName(folderToImport.name)){
                folders.insert(folderToImport)
              } else if (mergeFiles) {
                // If the folder already exists, try and merge files into it
                for (let fileToImport of folderToImport.getFiles()) {
                  let existingFolder:VaunchFolder = folders.getFolderByName(folderToImport.name)
                  existingFolder.addFile(fileToImport);
                }
              }
            }
          }

          // Only import config if importConfig is true, and the export actually has config to import
          if (importConfig && (importData as any).config) {
            config.newConfig((importData as any).config);
          }
        })
      }
    })
  }
}