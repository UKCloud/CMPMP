import type { VaunchFile } from "@/models/VaunchFile";

export class VaunchFolder {
  name: string;
  files: VaunchFile[]

  constructor(name: string) {
    this.name = name;
    this.files = [];
  }
}