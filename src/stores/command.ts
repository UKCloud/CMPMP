import { VaunchExport } from "@/models/commands/config/VaunchExport";
import { VaunchFeh } from "@/models/commands/config/VaunchFeh";
import { VaunchHelp } from "@/models/commands/config/VaunchHelp";
import { VaunchImport } from "@/models/commands/config/VaunchImport";
import { VaunchSetColor } from "@/models/commands/config/VaunchsetColor";
import { VaunchSetDefaultSearch } from "@/models/commands/config/VaunchSetDefaultSearch";
import { VaunchToggleCase } from "@/models/commands/config/VaunchToggleCase";
import { VaunchToggleCommands } from "@/models/commands/config/VaunchToggleCommands";
import { VaunchToggleFuzzy } from "@/models/commands/config/VaunchToggleFuzzy";
import { VaunchToggleGui } from "@/models/commands/config/VaunchToggleGui";
import { VaunchEditFile } from "@/models/commands/fs/VaunchEditFile";
import { VaunchMkdir } from "@/models/commands/fs/VaunchMkdir";
import { VaunchMv } from "@/models/commands/fs/VaunchMv";
import { VaunchRm } from "@/models/commands/fs/VaunchRm";
import { VaunchRmdir } from "@/models/commands/fs/VaunchRmdir";
import { VaunchSetDescription } from "@/models/commands/fs/VaunchSetDescription";
import { VaunchSetIcon } from "@/models/commands/fs/VaunchSetIcon";
import { VaunchTouch } from "@/models/commands/fs/VaunchTouch";

export const commands = [
  new VaunchMkdir(),
  new VaunchRmdir(),
  new VaunchTouch(),
  new VaunchRm(),
  new VaunchSetIcon(),
  new VaunchEditFile(),
  new VaunchMv(),
  new VaunchSetDescription(),
  new VaunchFeh(),
  new VaunchToggleGui(),
  new VaunchToggleFuzzy(),
  new VaunchToggleCase(),
  new VaunchToggleCommands(),
  new VaunchSetColor(),
  new VaunchSetDefaultSearch(),
  new VaunchExport(),
  new VaunchImport(),
  new VaunchHelp(),
]