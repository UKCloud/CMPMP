import { VaunchCommand } from "@/models/VaunchCommand";
import type { VaunchFolder } from "@/models/VaunchFolder";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import { exportVaunch } from "@/utilities/exporter";

export class VaunchExport extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Exports your Vaunch data/config to a file to download. This file can then be imported to other Vaunch instances.",
      "The export format is in a standard, editable JSON file. The exported config can be modified in an external editor and re-imported if desired.",
    ];
    const parameters: Parameter[] = [
      {
        name: "-n filename",
        optional: true,
        repeatable: false,
      },
      {
        name: "-f folder",
        optional: true,
        repeatable: true,
      },
      {
        name: "-c",
        optional: true,
        repeatable: false,
      },
    ];
    const examples: Example[] = [
      {
        args: [],
        description: [
          "Exports your current Vaunch instance to a file called 'vaunch.json', includes all folders and excludes personalisation config",
        ],
      },
      {
        args: ["-n myExport"],
        description: [
          "Exports your current Vaunch instance to a file called 'vaunch.json', includes all folders and excludes personalisation config",
        ],
      },
      {
        args: ["-f sites foo "],
        description: [
          "Exports your current Vaunch instance to a file called 'vaunch.json', includes only the folders 'sites' and 'foo'",
        ],
      },
      {
        args: ["-c"],
        description: [
          "Exports your current Vaunch instance to a file called 'vaunch.json', includes all folders and personalisation config",
        ],
      },
    ];
    super("export", longDescription, parameters, examples);
  }
  description = "Exports vaunch to a file";

  execute(args: string[]): VaunchResponse {
    const config = useConfigStore();
    const folders = useFolderStore();

    const componentsExported: string[] = [];

    // Setup variables to export
    let foldersToExport: VaunchFolder[] = [];
    let configToExport: unknown = undefined;
    let exportFile = "vaunch";

    // Check if config wil be exported. config is not exported by default
    const exportConfig: boolean = args.includes("-c") ? true : false;
    args = args.filter((e) => e !== "-c");
    if (exportConfig) {
      configToExport = config.currentConfig;
      componentsExported.push("config");
    }

    // Set custom export filename if -n flag is passed
    const nameIndex: number = args.indexOf("-n");
    if (nameIndex != -1) {
      exportFile = args[nameIndex + 1];
      args.slice(nameIndex);
      args.slice(nameIndex + 1);
    }

    // If -f is passed, export the provided folders, else export them all
    const exportSetFolders: boolean = args.includes("-f") ? true : false;
    args = args.filter((e) => e !== "-f");
    if (exportSetFolders) {
      for (const name of args) {
        const folderName: string = name.split("/")[0];
        const folder: VaunchFolder = folders.getFolderByName(folderName);
        if (folder) {
          foldersToExport.push(folder);
          componentsExported.push(folderName);
        }
      }
    } else {
      componentsExported.push("all folders");
      foldersToExport = folders.items;
    }

    const exportedConfig: string = exportVaunch(
      foldersToExport,
      configToExport
    );

    const hiddenElement = document.createElement("a");
    hiddenElement.href =
      "data:attachment/text," + encodeURIComponent(exportedConfig);
    hiddenElement.target = "_blank";
    hiddenElement.download = `${exportFile}.json`;
    hiddenElement.click();
    return this.makeResponse(
      ResponseType.Success,
      `Exported Vaunch components: ${componentsExported.join(
        ", "
      )}, as ${exportFile}.json`
    );
  }
}
