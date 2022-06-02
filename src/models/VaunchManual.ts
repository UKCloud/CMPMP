export type Parameter = {
  name: string,
  optional: boolean
}
export type Example = [{
  argument: string,
  description: string
}]

export class VaunchManual {
  parameters:Parameter[];
  examples:Example[];

  constructor(parameters:Parameter[]=[], examples:Example[]=[]) {
    this.parameters = parameters;
    this.examples = examples;
  }
}