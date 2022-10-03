import type { VaunchResponse, ResponseType } from "./VaunchResponse";

// Base class for all Files within Vaunch
export abstract class VaunchFile {
  fileName: string;
  aliases: string[];
  content: string;
  icon: string;
  iconClass: string;
  hits: number;
  extension = "";
  description = "";
  filetype = "VaunchFile";
  position:number;

  constructor(name: string, icon = "file", iconClass = "solid", hits = 0, position=-1) {
    this.fileName = name;
    this.aliases = [];
    this.content = "";
    this.icon = icon;
    this.iconClass = iconClass;
    this.hits = hits;
    this.position = position;
  }

  titleCase(): string {
    // Converts a filename to Title Case. replacing _ and - with spaces
    const prettyString = this.getBaseName().replace(/[-_]/g, " ");
    return prettyString
      .toLowerCase()
      .split(" ")
      .map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  getNames(): string[] {
    // Gets all names for the file, including any aliases (in the case of command files)
    const allNames: string[] = [this.fileName, ...this.aliases];
    return allNames;
  }

  namesStartWith(search: string): boolean {
    for (const name of this.getNames()) {
      if (name.startsWith(search)) return true;
    }
    return false;
  }

  setIcon(newIcon: string = this.icon, iconClass = "solid") {
    this.icon = newIcon;
    this.iconClass = iconClass;
  }

  // Abstract execution method, to be implemented by concrete classes
  // to define what happens when they are ran
  abstract execute(args: string[]): Promise<VaunchResponse>;

  makeResponse(type: ResponseType, message: string) {
    // Creates a VaunchResponse for this file, given a ResponseType and a message string
    return {
      type: type,
      message: message,
      name: this.fileName,
      filetype: this.filetype,
    };
  }

  getBaseName(): string {
    return this.fileName.split(".")[0];
  }

  getIdSafeName(): string {
    return this.fileName.replace(".", "-");
  }

  getDescription(): string {
    return this.content;
  }

  setName(newName: string) {
    this.fileName = newName;
  }

  abstract info(): any;

  abstract edit(args: string[]): void;
}
