import { VaunchFile } from "./VaunchFile";

export abstract class VaunchUrlFile extends VaunchFile {

  protected prependHttps(urlString:string):string {
    let httpsTest:RegExp = /^https?:\/\//g;
    if (!httpsTest.test(urlString)) urlString = "https://" + urlString;
    return urlString;
  }

  protected createUrl(): URL|undefined {
    try {
      let urlString:string = this.prependHttps(this.content);
      return new URL(urlString);
    } catch (e) {
      return undefined
    }
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