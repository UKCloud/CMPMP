import { useConfigStore } from "@/stores/config";
import { useFolderStore } from "@/stores/folder";
import { VaunchFile } from "./VaunchFile";
import type { VaunchFolder } from "./VaunchFolder";
import { VaunchLink } from "./VaunchLink";
import { VaunchQuery } from "./VaunchQuery";

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
    let newFileName:string = args[0];
    let newFileContent:string = args[1];

    let filePath = newFileName.split('/');
    let folder:VaunchFolder = folders.getFolderByName(filePath[0]);
    folder.removeFile(filePath[1])
  }
}

export class VaunchFeh extends VaunchCommand {
  constructor() {
    super("feh");
  }
  aliases: string[] = ["set-bg", "set-background"];

  execute(args:string[]): void {
    const config = useConfigStore();
    let background:string = args[0]
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
  aliases: string[] = ["set-colour"];

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

  private calcTextColor(windowColor:string):string {
    // let rgb = windowColor.substr(4, windowColor.length - 5);
    let rgb:RegExpMatchArray|null = windowColor.match(/^rgba\((\d+),\s?(\d+),\s?(\d+),\s?\d+(\.\d+)?\)$/);
    if (rgb != null) {
      let contrast = (parseInt(rgb[1]) * 299 +
        parseInt(rgb[2]) * 587 +
        parseInt(rgb[3]) * 114) / 1000;
      return contrast < 255/2 ? 'white' : 'black'
    }
    return "black"
  }

  execute(args:string[]): void {
    const config = useConfigStore();
    let newWindowColor = args[0];
    let newTextColor = args[1];
    // If first arg is 'default' set back to default variables
    if (newWindowColor == "default") {
      config.color.window = 'var(--color-vaunch-window)';
      config.color.text = 'var(--color-vaunch-text)';
    } else {
      // Set the new window color
      config.color.window = this.calcWindowColor(newWindowColor);
      // If a second color is provided, set the text color to that
      // else calculate the text color based on the window color
      if (newTextColor) {
        config.color.text = newTextColor;
      } else config.color.text = this.calcTextColor(config.color.window);
    }
  }
}