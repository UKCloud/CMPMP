import { VaunchCommand } from "@/models/VaunchCommand";
import type { Parameter, Example } from "@/models/VaunchManual";
import { useSessionStore } from "@/stores/sessionState";

export class VaunchHelp extends VaunchCommand {
  hasArgs: boolean = false;
  constructor() {
    let longDescription:string[] = ["Shows this help page. Passing an argument will automatically search for the command."]
    let parameters:Parameter[] = [{
      name: "command",
      optional: false,
      repeatable: false,
    }]
    let examples:Example[] =[{
      args: [],
      description: ["Shows the help page, showing all commands"],
    },
    {
      args: ["touch"],
      description: ["Shows the help page, only showing help for the 'touch' command."],
    }]
    super("help", longDescription, parameters, examples);
  }
  aliases: string[] = ["show-help", "man"];
  description: string = "Shows the help window for all Vaunch commands"

  execute(args: string[]): void {
    const sessionConfig = useSessionStore()
    if (args[0]) {
      sessionConfig.helpCommand = args[0];
    } else sessionConfig.helpCommand = "";
    sessionConfig.showHelp = true;
  }
}