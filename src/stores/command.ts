import * as fsCommands from "@/models/VaunchFsCommands";
import * as configCommands from "@/models/VaunchConfigCommands";

export const commands = [
  new fsCommands.VaunchMkdir(),
  new fsCommands.VaunchRmdir(),
  new fsCommands.VaunchRm(),
  new fsCommands.VaunchTouch(),
  new fsCommands.VaunchSetIcon(),
  new fsCommands.VaunchEditFile(),
  new configCommands.VaunchFeh(),
  new configCommands.VaunchToggleGui(),
  new configCommands.VaunchToggleFuzzy(),
  new configCommands.VaunchToggleCase(),
  new configCommands.VaunchToggleCommands(),
  new configCommands.VaunchSetColor(),
  new configCommands.VaunchSetDefaultSearch(),
]