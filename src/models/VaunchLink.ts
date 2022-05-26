import { VaunchFile } from "./VaunchFile";

export class VaunchLink extends VaunchFile {

  constructor(name:string, content:string, icon:string = "file") {
    if (!name.endsWith('.lnk')) {
      name = name+".lnk"
    }
    super(name, icon);
    this.content = content;
  }

  private prependHttps(urlString:string):string {
    let httpsTest:RegExp = /^https?:\/\//g;
    if (!httpsTest.test(urlString)) urlString = "https://" + urlString;
    return urlString;
  }

  private createUrl(urlString:string): string|undefined {
    try {
      urlString = this.prependHttps(urlString);
      return new URL(urlString).href;
    } catch (e) {
      return undefined
    }
  }

  getContent(): string {
    let linkUrl:string|undefined = this.createUrl(this.content);
    if (linkUrl) {
      return linkUrl
    } else {
      return this.content;
    }
  }

  execute(): void {
    // Ensure file content is "linkable"
    let linkUrl:string|undefined = this.createUrl(this.content);
    if (linkUrl) {
      window.location.href = linkUrl;
    }
  }

  displayName():string {
    return this.fileName
  }

  prettyName():string {
    return this.fileName.split('.')[0]
  }
}