import { VaunchCommand } from "@/models/VaunchCommand";
import type { Parameter, Example } from "@/models/VaunchManual";
import { useConfigStore } from "@/stores/config";
import defaultBg from "@/assets/img/default.png";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";

export class VaunchFeh extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Sets the background of Vaunch to the URL specified.",
    ];
    const parameters: Parameter[] = [
      {
        name: "URL|default",
        optional: true,
        repeatable: false,
      },
    ];
    const examples: Example[] = [
      {
        args: ["https://example.com/image.png"],
        description: [
          "Sets the background of Vaunch to the image available at: https://example.com/image.png",
        ],
      },
      {
        args: ["default"],
        description: ["Resets the background of Vaunch to the default image"],
      },
    ];
    super("feh", longDescription, parameters, examples);
  }
  aliases: string[] = ["set-bg", "set-background"];
  description = "Changes the background";

  execute(args: string[]): VaunchResponse {
    const config = useConfigStore();
    let background: string = args[0];
    let newBackgroundString: string = background;
    // If arg is 'default' set the background back to default
    if (background == "default") {
      background = defaultBg;
      newBackgroundString = "default background";
    }
    config.background = background;
    return this.makeResponse(
      ResponseType.Success,
      `Set background to: ${newBackgroundString}`
    );
  }
}
