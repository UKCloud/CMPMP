import { VaunchFile } from "./VaunchFile";

export abstract class VaunchUrlFile extends VaunchFile {

  protected prependHttps(urlString:string):string {
    let httpsTest:RegExp = /^https?:\/\//g;
    if (!httpsTest.test(urlString)) urlString = "https://" + urlString;
    return urlString;
  }

  protected createUrl(urlString:string): string|undefined {
    try {
      urlString = this.prependHttps(urlString);
      return new URL(urlString).href;
    } catch (e) {
      return undefined
    }
  }

  getCorrectURL(): string {
    let linkUrl:string|undefined = this.createUrl(this.content);
    if (linkUrl) {
      return linkUrl
    } else {
      return this.content;
    }
  }
}