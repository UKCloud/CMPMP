import { VaunchCommand } from "@/models/VaunchCommand";
import type { Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useConfigStore } from "@/stores/config";

export class VaunchToggleGui extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Toggles if the Folders/Commands section of Vaunch will be visible.",
      "If the GUI is off, only the command box/fuzzy search results will be visible",
    ];
    const examples: Example[] = [
      {
        args: [],
        description: ["Toggles the GUI's visibility"],
      },
    ];
    super("toggle-gui", longDescription, [], examples);
  }
  description = "Toggles if Folders/Commands are visible";

  async execute(args: string[]): Promise<VaunchResponse> {
    const config = useConfigStore();
    config.showGUI = !config.showGUI;
    return this.makeResponse(
      ResponseType.Success,
      `Toggle GUI visibility to: ${config.showGUI}`
    );
  }
}
