export abstract class VaunchFile {
  fileName: string

  constructor(name:string) {
    this.fileName = name
  }

  abstract execute(args:string[]): void
}