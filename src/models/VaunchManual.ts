export type Parameter = {
  name: string;
  optional: boolean;
  repeatable: boolean;
};
export type Example = {
  args: string[];
  description: string[];
};

export class VaunchManual {
  parameters: Parameter[];
  examples: Example[];
  description: string[];

  constructor(
    description: string[],
    parameters: Parameter[],
    examples: Example[]
  ) {
    this.parameters = parameters;
    this.examples = examples;
    this.description = description;
  }
}
