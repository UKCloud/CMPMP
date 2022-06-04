import { VaunchCommand } from "@/models/VaunchCommand";
import type { Parameter, Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useConfigStore } from "@/stores/config";

export class VaunchSetDefaultSearch extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Sets the default Query file to use when no matching file was found.",
      "Either the Query prefix of full filepath can be supplied",
    ];
    const parameters: Parameter[] = [
      {
        name: "filename|none",
        optional: true,
        repeatable: false,
      },
    ];
    const examples: Example[] = [
      {
        args: ["sites/example.qry"],
        description: ["Sets the default Query file to 'sites/example.qry'"],
      },
      {
        args: ["exl"],
        description: [
          "Sets the default Query file to the file associated with the 'exl' prefix",
        ],
      },
      {
        args: ["none"],
        description: [
          "Clears the default Query file, nothing will happen if no matching file was found",
        ],
      },
    ];
    super("set-search", longDescription, parameters, examples);
  }
  description = "Sets the default Query file to execute";

  execute(args: string[]): VaunchResponse {
    const config = useConfigStore();
    let newQueryName = "none";
    if (!args[0] || args[0] == "none") {
      config.defaultFile = "";
    } else {
      newQueryName = args[0];
      config.defaultFile = args[0];
    }
    return this.makeResponse(
      ResponseType.Success,
      `Set default Query file to: ${newQueryName}`
    );
  }
}
