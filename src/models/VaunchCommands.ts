import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import { VaunchFile } from "./VaunchFile";
import type { VaunchFolder } from "./VaunchFolder";
import { VaunchLink } from "./VaunchLink";
import { VaunchQuery } from "./VaunchQuery";
import defaultBg from "@/assets/img/default.png";

class VaunchCommand extends VaunchFile {
  execute(args: string[]): void {
    return
  }
  getBaseName(): string {
    return this.fileName;
  }

  info() {
    return {
      fileName: this.fileName,
      aliases: this.aliases,
    }
  }
}

export class VaunchMkdir extends VaunchCommand {
  constructor() {
    super("mkdir");
  }

  aliases: string[] = ["make-folder"];

  execute(args:string[]): void {
    const folder = useFolderStore();
    args.forEach((newFolder) => {
      if (newFolder.length > 0 && !folder.folderNames.includes(newFolder)){
        folder.add(newFolder);
      }
    })
  }
}

export class VaunchTouch extends VaunchCommand {
  constructor() {
    super("touch");
  }
  aliases: string[] = ["make-file"];

  execute(args:string[]): void {
    const folders = useFolderStore();
    let newFileName:string = args[0];

    let filePath = newFileName.split('/');
    let folderName:string = filePath[0];
    let fileName:string = filePath[1];

    let folder:VaunchFolder = folders.getFolderByName(folderName);
    if (folder) {
      let newFile:VaunchFile|undefined;
      let iconName:string|undefined;
      let iconClass:string|undefined;

      if (fileName.endsWith('.qry')) {
        let filePrefix:string = args[1];
        let fileContent:string = args[2];
        newFile = new VaunchQuery(fileName, filePrefix, fileContent);
        // Icon name/class is the fourth/fith arg provided for VaunchLink
        iconName = args[3];
        iconClass = args[4];
      } else {
        let fileContent:string = args[1];
        newFile = new VaunchLink(fileName, fileContent);
        // Icon name/class is the third/fourth arg provided for VaunchLink
        iconName = args[2];
        iconClass = args[3];
      }
      
      if (newFile) {
        // Set the file icon if a custom icon was provided
        if (iconName) newFile.setIcon(iconName, iconClass);
        folder.createFile(newFile);
      }
    }
  }
}

export class VaunchSetIcon extends VaunchCommand {
  constructor() {
    super("set-icon");
  }

  execute(args:string[]): void {
    const folders = useFolderStore();
    let deletePath:string = args[0];

    let filePath = deletePath.split('/');
    let folderName:string = filePath[0];
    let fileName:string = filePath[1];
    let folder:VaunchFolder = folders.getFolderByName(folderName);
    let file = folder.getFile(fileName);
    if (file) {
      let newIcon:string = args[1]
      let newIconclass:string = args[2]
      file.setIcon(newIcon, newIconclass)
    }
  }
}

export class VaunchRmdir extends VaunchCommand {
  constructor() {
    super("rmdir");
  }

  aliases: string[] = ["remove-folder", "delete-folder"];

  execute(args:string[]): void {
    const folders = useFolderStore();
    args.forEach(toDelete => {
      // Strip slashes from foldernames, if running from autocompleted value
      toDelete = toDelete.replace("/","");
      folders.remove(toDelete);
    })
  }
}

export class VaunchRm extends VaunchCommand {
  constructor() {
    super("rm");
  }
  aliases: string[] = ["remove-file", "delete-file"];

  execute(args:string[]): void {
    const folders = useFolderStore();
    let deletePath:string = args[0];

    let filePath = deletePath.split('/');
    let folderName:string = filePath[0];
    let fileToDelete:string = filePath[1];
    let folder:VaunchFolder = folders.getFolderByName(folderName);
    folder.removeFile(fileToDelete)
  }
}

export class VaunchFeh extends VaunchCommand {
  constructor() {
    super("feh");
  }
  aliases: string[] = ["set-bg", "set-background"];

  execute(args:string[]): void {
    const config = useConfigStore();
    let background:string = args[0];
    // If arg is 'default' set the background back to default
    if (background == "default") background = defaultBg;
    config.background = background;
  }
}

export class VaunchToggleGui extends VaunchCommand {
  constructor() {
    super("toggle-gui");
  }

  execute(args:string[]): void {
    const config = useConfigStore();
    config.showGUI = !config.showGUI;
  }
}

export class VaunchToggleCase extends VaunchCommand {
  constructor() {
    super("toggle-case");
  }

  execute(args:string[]): void {
    const config = useConfigStore();
    config.titleCase = !config.titleCase;
  }
}

export class VaunchSetColor extends VaunchCommand {
  constructor() {
    super("set-color");
  }
  aliases: string[] = ["set-colour", "colo"];

  private rgbToHsl(r:number, g:number, b:number){
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

  private getRgbColor(newColor:string):string {
    let fakeDiv = document.createElement("div");

    fakeDiv.style.color = newColor;
    document.body.appendChild(fakeDiv);
    // get RBG value of div from color passed. works with any valid CSS color,
    // even names such as green, orange, etc...
    let rgbColor:string = window.getComputedStyle(fakeDiv).getPropertyValue("color");
    // remove the fake div, no longer needed
    document.body.removeChild(fakeDiv);
    return rgbColor
  }

  private calcWindowColor(newColor:string):string {
    let rgbColor:string = this.getRgbColor(newColor);
    // Convert rgb to rgba for background transparency
    let rgbaColor = rgbColor.replace(/(?:rgb)+/g, 'rgba');
    return rgbaColor.replace(/(?:\))+/g, ', 0.64)');
  }

  private getRgbValue(rgbcolor:string):number[] {
    let rgb:RegExpMatchArray|null = rgbcolor.match(/^rgba?\((\d+),\s?(\d+),\s?(\d+)(,\s?\d+(\.\d+)?)?\)$/);
    if (rgb) {
      return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])]
    } else return [0,0,0]
  }

  private calcTextColor(windowColor:string):string {
    // let rgb = windowColor.substr(4, windowColor.length - 5);
    let rgb:number[] = this.getRgbValue(windowColor);
    let contrast = (rgb[0]) * 299 + rgb[1] * 587 + rgb[2] * 114 / 1000;
    return contrast < 255/2 ? 'white' : 'black'
  }

  execute(args:string[]): void {
    const config = useConfigStore();
    let newWindowColor = args[0];
    let newTextColor = args[1];
    let newHighlightColor = args[2];
    // If first arg is 'default' set back to default variables
    if (newWindowColor == "default") {
      config.color.window = 'var(--color-vaunch-window)';
      config.color.text = 'var(--color-vaunch-text)';
      config.color.highlight = 'var(--color-highlight)';
      config.color.autocomplete = 'var(--color-autocomplete)';
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
  calcAutocompleteColor(newTextColor: string): any {
    let rgb = this.getRgbColor(newTextColor);
    let rgbRaw = this.getRgbValue(rgb);
    let hsl = this.rgbToHsl(rgbRaw[0], rgbRaw[1], rgbRaw[2]);

    if (hsl[1] > 50) {
      hsl[1] = hsl[1] * 0.5;
    } else {
      hsl[1] = Math.round(hsl[1] / 0.2)
      hsl[2] = Math.round(hsl[2] * 0.5)
    }
    return `hsl(${hsl[0]},${hsl[1]}%,${hsl[2]}%)`;
  }
}