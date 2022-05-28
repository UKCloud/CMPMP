import { VaunchFile } from "./VaunchFile";

export abstract class VaunchUrlFile extends VaunchFile {

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

  getCorrectURL(): string {
    let linkUrl:URL|undefined = this.createUrl();
    if (linkUrl) {
      return linkUrl.href
    } else {
      return this.content;
    }
  }
}