export enum ResponseType {
  Error = "error",
  Success = "success",
  UpdateInput = "update",
  Info = "info",
}

export type VaunchResponse = {
  type: ResponseType;
  message: string;
  name: string;
  filetype: string;
};
