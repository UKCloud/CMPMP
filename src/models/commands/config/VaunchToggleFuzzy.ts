import { VaunchCommand } from "@/models/VaunchCommand";
import type { Example } from "@/models/VaunchManual";
import { useConfigStore } from "@/stores/config";

export class VaunchToggleFuzzy extends VaunchCommand {
  hasArgs: boolean = false;
  constructor() {
    let longDescription:string[] = [`Toggles if fuzzy searching is enabled. When enabled, typing in the command box will display
     a list of fuzzy matches files that can be executed, sorted by most used.`,`The list of matched files can be traversed with 
     the up and down arrow keys, and can be executed with Enter.`]
    let examples:Example[] = [{
      args: [],
      description: ["Toggles if fuzzy searching is enabled"]
    }]
    super("toggle-fuzzy", longDescription, [], examples);
  }
  description: string = "Toggles if fuzzy search is enabled"

  execute(args: string[]): void {
    const config = useConfigStore();
    config.fuzzy = !config.fuzzy;
  }
}