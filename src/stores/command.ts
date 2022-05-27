import * as setCommands from "@/models/VaunchCommands";

export const commands = [
  new setCommands.VaunchMkdir(),
  new setCommands.VaunchRmdir(),
  new setCommands.VaunchFeh(),
  new setCommands.VaunchTouch(),
  new setCommands.VaunchToggleGui(),
  new setCommands.VaunchToggleCase(),
  new setCommands.VaunchRm(),
  new setCommands.VaunchSetColor()
]