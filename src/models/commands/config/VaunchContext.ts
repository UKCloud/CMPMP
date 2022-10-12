import { VaunchCommand } from "@/models/VaunchCommand";
import type { Example, Parameter } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useDashboardStore } from "@/stores/dashboard";

export class VaunchContext extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Changes the current dashboard context that is applied to all other commands.",
    ];
    const parameters: Parameter[] = [
      {
        name: "context",
        optional: false,
        repeatable: false,        
      }
    ]
    const examples: Example[] = [
      {
        args: ["foo"],
        description: [
          "Toggles if files/folders are displayed in Title Case, or displayed as their raw file/folder names",
        ],
      },
    ];
    super("switch-context", longDescription, parameters, examples);
  }
  aliases: string[] = ["use"];
  description = "Changes targeted dashboard for commands";

  async execute(args: string[]): Promise<VaunchResponse> {
    const dashboardStore = useDashboardStore();
    dashboardStore.setContext(args[0]);
    return this.makeResponse(
      ResponseType.Success,
      `Changed Context to: ${dashboardStore.context}`
    );
  }
}
