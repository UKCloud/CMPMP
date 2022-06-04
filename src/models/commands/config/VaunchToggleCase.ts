import { VaunchCommand } from "@/models/VaunchCommand";
import type { Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useConfigStore } from "@/stores/config";

export class VaunchToggleCase extends VaunchCommand {
  hasArgs = false;
  constructor() {
    const longDescription: string[] = [
      "Toggles if the names of files/folders are displayed in Title Case or not.",
    ];
    const examples: Example[] = [
      {
        args: [],
        description: [
          "Toggles if files/folders are displayed in Title Case, or displayed as their raw file/folder names",
        ],
      },
    ];
    super("toggle-case", longDescription, [], examples);
  }
  description = "Toggles if names are converted to Title Case";

  execute(args: string[]): VaunchResponse {
    const config = useConfigStore();
    config.titleCase = !config.titleCase;
    return this.makeResponse(
      ResponseType.Success,
      `Edited Titlecase to: ${config.titleCase}`
    );
  }
}
