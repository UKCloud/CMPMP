import { useConfigStore } from "@/stores/config";
import { VaunchCommand } from "./VaunchCommand";
import defaultBg from "@/assets/img/default.png";
import { defaultconfig } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import { exportVaunch, readImportFile } from "@/utilities/exporter";
import { VaunchFolder } from "./VaunchFolder";
import type { Example, Parameter } from "./VaunchManual";

export class VaunchFeh extends VaunchCommand {
  constructor() {
    let longDescription:string[] = ["Sets the background of Vaunch to the URL specified."];
    let parameters:Parameter[] = [{
      name: "URL|default",
      optional:true,
      repeatable:false
    }]
    let examples:Example[] = [{
      args:["https://example.com/image.png"],
      description: ["Sets the background of Vaunch to the image available at: https://example.com/image.png"]
    },
    {
      args:["default"],
      description: ["Resets the background of Vaunch to the default image"]
    }]
    super("feh", longDescription, parameters, examples);
  }
  aliases: string[] = ["set-bg", "set-background"];
  description = "Changes the background";

  execute(args: string[]): void {
    const config = useConfigStore();
    let background: string = args[0];
    // If arg is 'default' set the background back to default
    if (background == "default") background = defaultBg;
    config.background = background;
  }
}

export class VaunchToggleGui extends VaunchCommand {
  hasArgs: boolean = false;
  constructor() {
    let longDescription:string[] = ["Toggles if the Folders/Commands section of Vaunch will be visible.",
      "If the GUI is off, only the command box/fuzzy search results will be visible"]
    let examples:Example[] = [{
      args:[],
      description: ["Toggles the GUI's visibility"]
    }]
    super("toggle-gui", longDescription, [], examples);
  }
  description = "Toggles if Folders/Commands are visible";

  execute(args: string[]): void {
    const config = useConfigStore();
    config.showGUI = !config.showGUI;
  }
}

export class VaunchToggleCase extends VaunchCommand {
  hasArgs: boolean = false;
  constructor() {
    let longDescription:string[] = ["Toggles if the names of files/folders are displayed in Title Case or not."]
    let examples:Example[] = [{
      args:[],
      description: ["Toggles if files/folders are displayed in Title Case, or displayed as their raw file/folder names"]
    }]
    super("toggle-case", longDescription, [], examples);
  }
  description = "Toggles if names are converted to Title Case";

  execute(args: string[]): void {
    const config = useConfigStore();
    config.titleCase = !config.titleCase;
  }
}

export class VaunchSetDefaultSearch extends VaunchCommand {
  constructor() {
    let longDescription:string[] = ["Sets the default Query file to use when no matching file was found.", "Either the Query prefix of full filepath can be supplied"]
    let parameters:Parameter[] = [{
      name: "filename|none",
      optional: true,
      repeatable: false
    }]
    let examples:Example[] = [{
      args: ["sites/example.qry"],
      description: ["Sets the default Query file to 'sites/example.qry'"]
    },
    {
      args: ["exl"],
      description: ["Sets the default Query file to the file associated with the 'exl' prefix"]
    },
    {
      args: ["none"],
      description: ["Clears the default Query file, nothing will happen if no matching file was found"]
    }]
    super("set-search", longDescription, parameters, examples);
  }
  description: string = "Sets the default Query file to execute"

  execute(args: string[]): void {
    const config = useConfigStore();
    if (args[0] == "none") {
      config.defaultFile = "";
    } else config.defaultFile = args[0];
  }
}

export class VaunchToggleFuzzy extends VaunchCommand {
  hasArgs: boolean = false;
  constructor() {
    let longDescription:string[] = [`Toggles if fuzzy searching is enabled. When enabled, typing in the command box will display
     a list of fuzzy matches files that can be executed, sorted by most used.`,`The list of matched files can be traversed with 
     the up and down arrow keys, and can be executed with Enter.`]
    let examples:Example[] = [{
      args: [],
      description: ["Toggles if fuzzy searching is enabled"]
    }]
    super("toggle-fuzzy", longDescription, [], examples);
  }
  description: string = "Toggles if fuzzy search is enabled"

  execute(args: string[]): void {
    const config = useConfigStore();
    config.fuzzy = !config.fuzzy;
  }
}

export class VaunchToggleCommands extends VaunchCommand {
  hasArgs: boolean = false;
  constructor() {
    let longDescription:string[] = [`Toggles if the command window is shows. The command window lists all available commands, and
      contains input boxes to execute the command. Commands without any parameters can just be clicked to be executed.`, 
      `If the GUI has been toggled off, this command will have no visible effect until the GUI is toggled back on.`]
   let examples:Example[] = [{
     args: [],
     description: ["Toggles if the command window is shown"]
   }]
    super("toggle-commands", longDescription, [], examples);
  }
  description: string = "Toggles if the commands window is visible"

  execute(args: string[]): void {
    const config = useConfigStore();
    config.showCommands = !config.showCommands;
  }
}

export class VaunchSetColor extends VaunchCommand {
  constructor() {
    let longDescription:string[] = ["Changes the colours of Vaunch. The window colour, text color, and highlight color can be customised. Colors can either be a css colour name, or hex-code.",
      "Supplying * at any of the parameters will leave that element's colour unchanged.",
      "If the window colour is changed, and text colour is not specified Vaunch will set the text colour to either black or white, based on the window colour.",
      "If 'default' is supplied, Vaunch will be reset to the default colour scheme, based on your preferred OS colour theme."]
    let parameters:Parameter[] = [{
      name: "windowColor|default",
      optional: true,
      repeatable: false
    },
    {
      name: "textColor",
      optional: true,
      repeatable: false
    },
    {
      name: "highlightColor",
      optional: true,
      repeatable: false
    }]

    let examples:Example[] = [{
      args: ["cornflowerblue"],
      description: ["Sets the window color to the css colour 'cornflowerblue'",
        "Vaunch will additionally set the text colour to black, as textColor was not specified"]
    },
    {
      args: ["cornflowerblue", "#ffffff"],
      description: ["Sets the window color to the css colour 'cornflowerblue' and the text colour to #ffffff (white)"]
    },
    {
      args: ["*", "*", "orange"],
      description: ["Sets the highlight colour to 'orange' while preserving the current window and text colour"]
    },
    {
      args: ["default"],
      description: ["Changes the colour scheme to Vaunch's default, which is based on your OS colour scheme"]
    }]
    super("set-color", longDescription, parameters, examples);
  }
  aliases: string[] = ["set-colour", "colo"];
  description: string = "Changes the colour of Vaunch"

  private rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
          ? 2 + (b - r) / s
          : 4 + (r - g) / s
      : 0;
    return [
      Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
      Math.round(100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
      Math.round((100 * (2 * l - s)) / 2),
    ];
  }

  private getRgbColor(newColor: string): string {
    let fakeDiv = document.createElement("div");

    fakeDiv.style.color = newColor;
    document.body.appendChild(fakeDiv);
    // get RBG value of div from color passed. works with any valid CSS color,
    // even names such as green, orange, etc...
    let rgbColor: string = window.getComputedStyle(fakeDiv).getPropertyValue("color");
    // remove the fake div, no longer needed
    document.body.removeChild(fakeDiv);
    return rgbColor
  }

  private calcWindowColor(newColor: string, opacity:number=0.70): string {
    let rgbColor: string = this.getRgbColor(newColor);
    // Convert rgb to rgba for background transparency
    let rgbaColor = rgbColor.replace(/(?:rgb)+/g, 'rgba');
    return rgbaColor.replace(/(?:\))+/g, `, ${opacity})`);
  }

  private getRgbValue(rgbcolor: string): number[] {
    let rgb: RegExpMatchArray | null = rgbcolor.match(/^rgba?\((\d+),\s?(\d+),\s?(\d+)(,\s?\d+(\.\d+)?)?\)$/);
    if (rgb) {
      return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])]
    } else return [0, 0, 0]
  }

  private calcTextColor(windowColor: string): string {
    // let rgb = windowColor.substr(4, windowColor.length - 5);
    let rgb: number[] = this.getRgbValue(windowColor);
    let contrast = (rgb[0]) * 299 + rgb[1] * 587 + rgb[2] * 114 / 1000;
    return contrast < 255 / 2 ? 'white' : 'black'
  }

  private calcAutocompleteColor(newTextColor: string): any {
    let rgb = this.getRgbColor(newTextColor);
    let rgbRaw = this.getRgbValue(rgb);
    let hsl = this.rgbToHsl(rgbRaw[0], rgbRaw[1], rgbRaw[2]);

    if (hsl[1] > 50) {
      hsl[1] = hsl[1] * 0.5;
    } else {
      hsl[1] = Math.round(hsl[1] / 0.2)
      hsl[2] = Math.round(hsl[2] * 0.5)
    }
    return `hsla(${hsl[0]},${hsl[1]}%,${hsl[2]}%, 0.75)`;
  }

  execute(args: string[]): void {
    const config = useConfigStore();
    let newWindowColor = args[0];
    let newTextColor = args[1];
    let newHighlightColor = args[2];
    // If first arg is 'default' set back to default variables
    if (newWindowColor == "default") {
      config.color = defaultconfig.color;
    } else {
      // Set the new window color
      if (newWindowColor != "*") {
        config.color.window = this.calcWindowColor(newWindowColor);
        config.color.windowOpaque = this.calcWindowColor(newWindowColor,1);
      }

      // If a second color is provided, set the text color to that
      // else calculate the text color based on the window color
      if (newTextColor) {
        if (newTextColor != "*") {
          config.color.text = newTextColor;
        }
        // Calculate the 'best' highlight color for this text color
        config.color.autocomplete = this.calcAutocompleteColor(newTextColor)
      } else config.color.text = this.calcTextColor(config.color.window);
      if (newHighlightColor) {
        if (newHighlightColor != "*") {
          config.color.highlight = newHighlightColor;
        }
      }
    }
  }
}

export class VaunchExport extends VaunchCommand {
  constructor() {
    let longDescription:string[] = ["Exports your Vaunch data/config to a file to download. This file can then be imported to other Vaunch instances.",
    "The export format is in a standard, editable JSON file. The exported config can be modified in an external editor and re-imported if desired."]
    let parameters:Parameter[] = [{
      name: "exportFileName",
      optional: true,
      repeatable: false
    }]
    let examples:Example[] = [{
      args: [],
      description: ["Exports your current Vaunch instance to a file called 'vaunch.json'"]
    },
    {
      args: ["myExport"],
      description: ["Exports your current Vaunch instance to a file called 'myExport.json'"]
    }]
    super("export", longDescription, parameters, examples);
  }
  description = "Exports vaunch to a file";

  execute(args: string[]): void {
    const config = useConfigStore();
    const folders = useFolderStore();
    let exportFile = args[0] ? args[0] : "vaunch"

    let exportedConfig: string = exportVaunch(folders.items, config.currentConfig);
    var hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(exportedConfig);
    hiddenElement.target = '_blank';
    hiddenElement.download = `${exportFile}.json`;
    hiddenElement.click();
  }
}

export class VaunchImport extends VaunchCommand {
  constructor() {
    let longDescription:string[] = ["Imports an exported Vaunch configuration into this instance. Files/Folders will be imported by default, only adding new folders.",
      "Config can additionally be imported, as well as force importing all folders, deleting all of your current folders.",
      "Folder content can additionally be merged with the export file if desired"]
    let parameters:Parameter[] = [{
      name: "-f",
      optional: true,
      repeatable: false,
    },
    {
      name: "-m",
      optional: true,
      repeatable: false,
    },
    {
      name: "files",
      optional: true,
      repeatable: false,
    },
    {
      name: "config",
      optional: true,
      repeatable: false,
    }]
    let examples:Example[] = [{
      args: [],
      description: ["Imports only new folders from the exported file.",
        "If the export has a folder called 'sites' and so does your current instance, this folder will be skipped"]
    },
    {
      args: ["files"],
      description: ["Functionally equivalent to running 'import' with no arguments"]
    },
    {
      args: ["config"],
      description: ["Imports only the config from the exported file, such as the colour scheme, GUI visibility, and default search file."]
    },
    {
      args: ["files", "config"],
      description: ["Imports both files/folders and config from the exported file.", "Existing folders will be skipped"]
    },
    {
      args: ["-m"],
      description: ["Imports files/folders and merges existing folders from the export, adding new files into existing folders"]
    },
    {
      args: ["-f"],
      description: ["Force imports files/folders into Vaunch, deleting all current folders before replacing them with the content of the exported file"]
    }]
    super("import", longDescription, parameters, examples);
  }
  description = "Imports vaunch from a file";

  execute(args: string[]): void {
    let importElem = document.createElement('input');
    importElem.type = "file";
    importElem.click();
    let importReader = readImportFile

    // If '-f' is passed to import, overwrite everything
    let overwrite:boolean = args.includes("-f") ? true:false;
    let mergeFiles:boolean = args.includes("-m") ? true:false;
    // After setting flag variables, remove them from args
    args = args.filter(e => e !== '-f')
    args = args.filter(e => e !== '-m')
    // If 'files' is passed to import import files, or if nothing was passed
    // (not including flags, which are now removed) import just files by default
    let importFolders:boolean = args.length == 0 || args.includes("files") ? true:false;
    let importConfig:boolean = args.includes("config") ? true:false;

    importElem.addEventListener('change', function () {
      if (this.files) {
        importReader(this.files[0]).then(function (importData) {
          const folders = useFolderStore();
          const config = useConfigStore();

          // Delete all folders if -f is supplied to import
          if (overwrite) folders.removeAll();

          // Only import files/folders if importConfig is true
          if (importFolders) {
            for (let folder of (importData as any).folders) {
              let folderToImport:VaunchFolder = VaunchFolder.parse(folder);
              // If this folder doesn't exist, import it. If overwriting, all folders will be gone by now
              if (!folders.getFolderByName(folderToImport.name)){
                folders.insert(folderToImport)
              } else if (mergeFiles) {
                // If the folder already exists, try and merge files into it
                for (let fileToImport of folderToImport.getFiles()) {
                  let existingFolder:VaunchFolder = folders.getFolderByName(folderToImport.name)
                  existingFolder.addFile(fileToImport);
                }
              }
            }
          }

          // Only import config if importConfig is true
          if (importConfig) {
            config.newConfig((importData as any).config);
          }
        })
      }
    })
  }
}

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
    const config = useConfigStore();
    if (args[0]) {
      config.helpCommand = args[0];
    } else config.helpCommand = "";
    config.showHelp = true;
  }
}