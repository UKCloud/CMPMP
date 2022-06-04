export enum ResponseType {
  Error,
  Success,
  UpdateInput,
  Info,
}

export type VaunchResponse = {
  type: ResponseType;
  message: string;
  name: string;
  filetype: string;
};
