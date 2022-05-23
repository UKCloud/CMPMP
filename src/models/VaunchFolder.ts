export class VaunchFolder {
  name: string;
  files: File[]

  constructor(name: string) {
    this.name = name;
    this.files = [];
  }
}