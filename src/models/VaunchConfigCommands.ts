import { useConfigStore } from "@/stores/config";
import { VaunchCommand } from "./VaunchCommand";
import defaultBg from "@/assets/img/default.png";
import { defaultconfig } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import { exportVaunch, readImportFile } from "@/utilities/exporter";
import { VaunchFolder } from "./VaunchFolder";

export class VaunchFeh extends VaunchCommand {
  constructor() {
    super("feh");
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
    super("toggle-gui");
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
    super("toggle-case");
  }
  description = "Toggles if names are converted to titlecase";

  execute(args: string[]): void {
    const config = useConfigStore();
    config.titleCase = !config.titleCase;
  }
}

export class VaunchSetDefaultSearch extends VaunchCommand {
  constructor() {
    super("set-search");
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
    super("toggle-fuzzy");
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
    super("toggle-commands");
  }
  description: string = "Toggles if the commands window is visible"

  execute(args: string[]): void {
    const config = useConfigStore();
    config.showCommands = !config.showCommands;
  }
}

export class VaunchSetColor extends VaunchCommand {
  constructor() {
    super("set-color");
  }
  aliases: string[] = ["set-colour", "colo"];
  description: string = "Changes the color of Vaunch. Usage: window [text] [highlight]. * keeps current value"

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

  private calcWindowColor(newColor: string): string {
    let rgbColor: string = this.getRgbColor(newColor);
    // Convert rgb to rgba for background transparency
    let rgbaColor = rgbColor.replace(/(?:rgb)+/g, 'rgba');
    return rgbaColor.replace(/(?:\))+/g, ', 0.64)');
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
    super("export");
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
    super("import");
  }
  description = "Imports vaunch from a file";

  execute(args: string[]): void {
    let importElem = document.createElement('input');
    importElem.type = "file";
    importElem.click();
    let importReader = readImportFile
    importElem.addEventListener('change', function () {
      if (this.files) {
        importReader(this.files[0]).then(function (importData) {
          const folders = useFolderStore();
          const config = useConfigStore();
          if (args[0]) {
            folders.removeAll();
          }
          for (let folder of (importData as any).folders) {
            let vaunchFolder:VaunchFolder = VaunchFolder.parse(folder);
            // If this folder doesn't exist, import it. If overwriting, all folders will be gone by now
            if (!folders.getFolderByName(vaunchFolder.name)){
              folders.insert(vaunchFolder)
            }
            if (args[0]) {
              config.newConfig((importData as any).config);
            }
          }
        })
      }
    })
  }
}
