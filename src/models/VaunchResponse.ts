// Basic response type to handle returning information to the user
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
