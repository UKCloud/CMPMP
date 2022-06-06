import type { VaunchFolder } from "./VaunchFolder";
import { ResponseType, type VaunchResponse } from "./VaunchResponse";
import { VaunchUrlFile } from "./VaunchUrlFile";

export class VaunchQuery extends VaunchUrlFile {
  prefix: string;
  extension = ".qry";
  filetype = "VaunchQuery";

  constructor(
    name: string,
    prefix: string,
    content: string,
    parent: VaunchFolder,
    icon = "magnifying-glass",
    iconClass = "solid",
    hits = 0,
    description = "",
    position=-1
  ) {
    if (!name.endsWith(".qry")) {
      name = name + ".qry";
    }
    super(name, parent, icon, iconClass, hits, description, position);
    this.prefix = prefix.replace(":", "");
    this.content = content;
  }

  getDescription(): string {
    if (this.description) return `${this.prefix}: ${this.description}`;
    return `Search: ${this.prefix}: ${this.content}`;
  }

  getNames(): string[] {
    return [this.fileName, this.prefix, ...this.aliases];
  }

  execute(args: string[]): VaunchResponse {
    // If no args are provided or ctrl clicking on the file, return the file's prefix
    if (args.length == 0 || args[0] == "_blank" || args[0] == "") {
      return this.makeResponse(ResponseType.UpdateInput, `${this.prefix}: `);
    }

    // If _black is the last arg, open this in a new window
    let newTab = false;
    if (args[args.length - 1] == "_blank") {
      newTab = true;
      // Remove the _blank from the args, otherwise _blank would also be searched
      args.pop();
    }

    let newLocation: string;
    // If file content contains multiple replacable sections
    // each arg will be used to replace each section
    if (this.content.includes("${1}")) {
      newLocation = this.content;
      for (let i = 0; i < args.length; i++) {
        const arg: string = args[i];
        newLocation = newLocation.replace(`\${${i + 1}}`, arg);
      }
    } else {
      // Else, replace all ${} instances with the single provided arg
      const combinedArgs = args.join(" ");
      const encodedargs = encodeURIComponent(combinedArgs).replace(/%20/g, "+");
      newLocation = this.content.replace(/\${}/g, encodedargs);
    }
    // Ensure the final file content is "linkable"
    const linkUrl: URL | undefined = this.createUrl(newLocation);
    if (linkUrl) {
      this.hits++;
      if (newTab) {
        window.open(linkUrl, "_blank");
      } else window.location.href = linkUrl.href;
      return this.makeResponse(
        ResponseType.Success,
        `Navigating to: ${linkUrl.href}`
      );
    }
    return this.makeResponse(
      ResponseType.Error,
      `Failed to execute file. Attempted URL was: ${newLocation}`
    );
  }

  info(): any {
    return {
      fileName: this.fileName,
      aliases: this.aliases,
      prefix: this.prefix,
      content: this.content,
      icon: this.icon,
      iconClass: this.iconClass,
      type: this.filetype,
      hits: this.hits,
      description: this.description,
      position: this.position,
    };
  }

  edit(args: string[]): void {
    if (args[0] && args[0] != "*") {
      this.prefix = args[0];
    }
    if (args[1] && args[1] != "*") {
      this.content = args[1];
    }
  }
}
