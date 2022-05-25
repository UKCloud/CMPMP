import { VaunchFeh, VaunchHideGui, VaunchMkdir, VaunchRmdir, VaunchTouch } from "@/models/VaunchCommands";

export const commands = [
  new VaunchMkdir(),
  new VaunchRmdir(),
  new VaunchFeh(),
  new VaunchTouch(),
  new VaunchHideGui()
]