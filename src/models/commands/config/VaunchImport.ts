import type { Dashboard } from "@/models/Dashboard";
import { VaunchCommand } from "@/models/VaunchCommand";
import { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useConfigStore } from "@/stores/config";
import { useDashboardStore } from "@/stores/dashboard";
import { readImportFile } from "@/utilities/exporter";

export class VaunchImport extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Imports an exported Vaunch configuration into this instance. Files/Folders will be imported by default, only adding new folders.",
      "Config can additionally be imported, as well as force importing all folders, deleting all of your current folders.",
      "Folder content can additionally be merged with the export file if desired",
    ];
    const parameters: Parameter[] = [
      {
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
      },
    ];
    const examples: Example[] = [
      {
        args: [],
        description: [
          "Imports only new folders from the exported file.",
          "If the export has a folder called 'sites' and so does your current instance, this folder will be skipped",
        ],
      },
      {
        args: ["files"],
        description: [
          "Functionally equivalent to running 'import' with no arguments",
        ],
      },
      {
        args: ["-c"],
        description: [
          "Imports only the config from the exported file, such as the colour scheme, GUI visibility, and default search file.",
        ],
      },
      {
        args: ["files", "config"],
        description: [
          "Imports both files/folders and config from the exported file.",
          "Existing folders will be skipped",
        ],
      },
      {
        args: ["-m"],
        description: [
          "Imports files/folders and merges existing folders from the export, adding new files into existing folders",
        ],
      },
      {
        args: ["-f"],
        description: [
          "Force imports files/folders into Vaunch, deleting all current folders before replacing them with the content of the exported file",
        ],
      },
    ];
    super("import", longDescription, parameters, examples);
  }
  description = "Imports vaunch from a file";

  async execute(args: string[]): Promise<VaunchResponse> {
    const importElem = document.createElement("input");
    importElem.type = "file";
    importElem.click();
    const importReader = readImportFile;

    const importedComponents: string[] = [];

    // If '-f' is passed to import, overwrite everything
    const overwrite: boolean = args.includes("-f") ? true : false;
    const mergeFiles: boolean = args.includes("-m") ? true : false;
    // After setting flag variables, remove them from args
    args = args.filter((e) => e !== "-f");
    args = args.filter((e) => e !== "-m");
    // If 'files' is passed to import import files, or if nothing was passed
    // (not including flags, which are now removed) import just files by default
    const importFolders: boolean =
      args.length == 0 || args.includes("files") ? true : false;
    const importConfig: boolean = args.includes("config") ? true : false;

    const dashboards = useDashboardStore();
    const currentDashboard: Dashboard = dashboards.currentDashboard;
    importElem.addEventListener("change", function () {
      if (this.files) {
        importReader(this.files[0]).then(function (importData) {
          const config = useConfigStore();

          // Delete all folders if -f is supplied to import
          if (overwrite) currentDashboard.removeAll();

          // Only import files/folders if importConfig is true
          if (importFolders) {
            for (const folder of (importData as any).folders) {
              // Set position to -1 to send all imported folders to the end if not overwriting
              if (!overwrite) folder["position"] = -1;
              const folderToImport: VaunchFolder = VaunchFolder.parse(currentDashboard.name, folder);
              // If this folder doesn't exist, import it. If overwriting, all folders will be gone by now
              if (!currentDashboard.getFolderByName(folderToImport.name)) {
                currentDashboard.insertFolder(folderToImport);
                importedComponents.push(folderToImport.name);
              } else if (mergeFiles) {
                // If the folder already exists, try and merge files into it
                importedComponents.push(`${folderToImport.name} (merged)`);
                for (const fileToImport of folderToImport.getFiles()) {
                  // Set position to -1 to send all imported files to the end if not overwriting
                  if (!overwrite) fileToImport["position"] = -1;
                  const existingFolder: VaunchFolder | undefined =
                    currentDashboard.getFolderByName(folderToImport.name);
                  existingFolder?.addFile(fileToImport);
                }
              }
            }
          }

          // Only import config if importConfig is true, and the export actually has config to import
          if (importConfig && (importData as Record<string, unknown>).config) {
            importedComponents.push("config");
            config.newConfig((importData as Record<string, unknown>).config);
          }
        });
      }
    });
    // After importing re-organise the folders so all positions definitely match up
    currentDashboard.organisePosition(currentDashboard.getItems());
    return this.makeResponse(
      ResponseType.Success,
      `Imported Vaunch components: ${importedComponents.join(", ")}`
    );
  }
}
