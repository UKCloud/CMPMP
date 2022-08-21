// Parameters are the named arguments for a command
export type Parameter = {
  name: string;
  optional: boolean;
  repeatable: boolean;
};
// Examples container a list of arguments for the command
// and contains a description of what this execution would do
export type Example = {
  args: string[];
  description: string[];
};

// A VaunchManual contains a description of the command
// the list of available parameters, and example usage of the command
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
