import { VaunchCommand } from "@/models/VaunchCommand";
import type { Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useConfigStore } from "@/stores/config";

export class VaunchToggleCommands extends VaunchCommand {
  hasArgs = false;
  constructor() {
    const longDescription: string[] = [
      `Toggles if the command window is shows. The command window lists all available commands, and
      contains input boxes to execute the command. Commands without any parameters can just be clicked to be executed.`,
      `If the GUI has been toggled off, this command will have no visible effect until the GUI is toggled back on.`,
    ];
    const examples: Example[] = [
      {
        args: [],
        description: ["Toggles if the command window is shown"],
      },
    ];
    super("toggle-commands", longDescription, [], examples);
  }
  description = "Toggles if the commands window is visible";

  execute(args: string[]): VaunchResponse {
    const config = useConfigStore();
    config.showCommands = !config.showCommands;
    return this.makeResponse(
      ResponseType.Success,
      `Showing commands: ${config.titleCase}`
    );
  }
}
