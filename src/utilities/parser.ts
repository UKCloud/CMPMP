import { Dashboard } from "@/models/Dashboard";
import { VaunchFolder } from "@/models/VaunchFolder";

export function parseDashboard(name:string, data:string):Dashboard {
  // Parse the read JSON from localstorage
  const rawData = JSON.parse(data);
  // Create a new map to return, matching the type of rawFolders
  const folders = new Map<string, VaunchFolder>();
  for (const folder of rawData) {
    // Parse each JSON representation as a VaunchFolder, and add it to the map
    // using the folder name as the map key
    const vaunchFolder = VaunchFolder.parse(folder);
    folders.set(vaunchFolder.name, vaunchFolder);
  }

  const dash = new Dashboard(name, folders)
  return dash;
}

export function stringifyDashboard(data:Map<string,VaunchFolder>) {
  // Convert all folders into a JSON compatible format and return the JSON string to store
  const storeData: any[] = [];
  for (const folder of data) {
    // VaunchFolder.info() returns a JS Object representing the folder and its files
    storeData.push(folder[1].info());
  }
  return JSON.stringify(storeData);
}