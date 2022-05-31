import { VaunchFile } from "./VaunchFile";
import type { VaunchFolder } from "./VaunchFolder";

export abstract class VaunchUrlFile extends VaunchFile {

  parent:VaunchFolder;
  filetype:string = "VaunchUrlFile";

  constructor(name:string, parent:VaunchFolder, icon:string, iconClass:string, hits:number = 0) {
    super(name, icon, iconClass, hits);
    this.parent = parent;
  }

  protected prependHttps(urlString:string):string {
    let httpsTest:RegExp = /^https?:\/\//g;
    if (!httpsTest.test(urlString)) urlString = "https://" + urlString;
    return urlString;
  }

  protected createUrl(url:string = this.content): URL|undefined {
    try {
      let urlString:string = this.prependHttps(url);
      return new URL(urlString);
    } catch (e) {
      return undefined
    }
  }

  protected getParentName(titleCase:boolean=false):string {
    if (titleCase) {
      return this.parent.titleCase();
    }
    return this.parent.name;
  }

  getCorrectURL(): string {
    let linkUrl:URL|undefined = this.createUrl();
    if (linkUrl) {
      return linkUrl.href
    } else {
      return this.content;
    }
  }
}