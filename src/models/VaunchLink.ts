import type { VaunchFolder } from "./VaunchFolder";
import { ResponseType, type VaunchResponse } from "./VaunchResponse";
import { VaunchUrlFile } from "./VaunchUrlFile";

export class VaunchLink extends VaunchUrlFile {
  extension = ".lnk";
  filetype = "VaunchLink";

  constructor(
    name: string,
    content: string,
    parent: VaunchFolder | undefined = undefined,
    icon = "file",
    iconClass = "solid",
    hits = 0,
    description = ""
  ) {
    if (!name.endsWith(".lnk")) {
      name = name + ".lnk";
    }
    super(name, parent, icon, iconClass, hits, description);
    this.content = content;
  }

  trimString(stringTotrim: string, trimTo = 50): string {
    if (stringTotrim.length > trimTo - 3) {
      return `${stringTotrim.substring(0, trimTo)}...`;
    } else return stringTotrim;
  }

  getDescription(): string {
    if (this.description) return this.description;
    return "Navigate to: " + this.trimString(this.getCorrectURL());
  }

  execute(args: string[]): VaunchResponse {
    // Ensure file content is "linkable"
    const linkUrl: URL | undefined = this.createUrl();
    if (linkUrl) {
      this.hits++;
      // Navigate to page, in new tab if "_blank" is an argument
      if (args[0] == "_blank") {
        window.open(linkUrl, "_blank");
      } else window.location.href = linkUrl.href;
      return this.makeResponse(
        ResponseType.Success,
        `Navigating to: ${linkUrl.href}`
      );
    }
    return this.makeResponse(
      ResponseType.Error,
      `Failed to execute file. Attempted URL was: ${this.content}`
    );
  }

  info(): any {
    return {
      fileName: this.fileName,
      aliases: this.aliases,
      content: this.content,
      icon: this.icon,
      iconClass: this.iconClass,
      type: this.filetype,
      hits: this.hits,
      description: this.description,
    };
  }

  edit(args: string[]): void {
    if (args[0]) {
      this.content = args[0];
    }
  }

  setName(newName: string) {
    if (!newName.endsWith(".lnk")) {
      this.fileName = newName + ".lnk";
    } else this.fileName = newName;
  }
}
