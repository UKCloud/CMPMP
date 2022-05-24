import { VaunchFeh, VaunchMkdir, VaunchRmdir } from "@/models/VaunchCommands";

export const commands = [
  new VaunchMkdir(),
  new VaunchRmdir(),
  new VaunchFeh(),
]