import { VaunchFeh, VaunchToggleGui, VaunchMkdir, VaunchRm, VaunchRmdir, VaunchTouch, VaunchToggleCase } from "@/models/VaunchCommands";

export const commands = [
  new VaunchMkdir(),
  new VaunchRmdir(),
  new VaunchFeh(),
  new VaunchTouch(),
  new VaunchToggleGui(),
  new VaunchToggleCase(),
  new VaunchRm()
]