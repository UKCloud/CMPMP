import { VaunchFile } from "./VaunchFile";
import type { VaunchFolder } from "./VaunchFolder";

export abstract class VaunchUrlFile extends VaunchFile {

  parent:VaunchFolder|undefined;
  filetype:string = "VaunchUrlFile";

  constructor(name:string, parent:VaunchFolder|undefined, icon:string, iconClass:string, hits:number = 0, description:string="") {
    super(name, icon, iconClass, hits);
    this.description = description
    if (parent) {
      this.parent = parent;
      this.aliases.push(`${this.parent.name}/${this.fileName}`);
    }
  }

  protected prependHttps(urlString:string):string {
    let httpsTest:RegExp = /^https?:\/\//g;
    if (!httpsTest.test(urlString)) urlString = "https://" + urlString;
    return urlString;
  }

  protected createUrl(url:string = this.content): URL|undefined {
    try {
      // If passed url starts with http/https already, attempt to return it as a URL
      // otherwise prepend https:// to it.
      let httpPrefixedTest:RegExp = /^https?:\/\//g
      if (httpPrefixedTest.test(url)) {
        return new URL(url);
      } else url = this.prependHttps(url);
      
      // Now with https:// prepended, run an additional URL test against the string
      let fullUrlTest:RegExp = /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=\(\)]*)$/g
      if (fullUrlTest.test(url)) {
        return new URL(url);
      } else return undefined;
    } catch (e) {
      return undefined
    }
  }

  protected getParentName(titleCase:boolean=false):string {
    if (this.parent) {
      if (titleCase) {
        return this.parent.titleCase();
      }
      return this.parent.name;
    } else return "";
  }

  getCorrectURL():string {
    let linkUrl:URL|undefined = this.createUrl();
    if (linkUrl) {
      return linkUrl.href
    } else {
      return this.content;
    }
  }

  hasValidURL():boolean {
    let linkUrl:URL|undefined = this.createUrl();
    if (linkUrl) return true;
    return false
  }
}