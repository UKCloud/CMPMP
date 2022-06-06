import type { VaunchResponse, ResponseType } from "./VaunchResponse";

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

  abstract execute(args: string[]): VaunchResponse;

  makeResponse(type: ResponseType, message: string) {
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
