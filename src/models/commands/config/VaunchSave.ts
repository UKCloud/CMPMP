import { VaunchCommand } from "@/models/VaunchCommand";
import type { Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useFolderStore } from "@/stores/folder";
import { useSessionStore } from "@/stores/sessionState";
import { stringifyDashboard } from "@/utilities/parser";

export class VaunchSave extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Saves the current dashboard to the backend. This dashboard will then be loaded by users that have access to it.",
    ];
    const examples: Example[] = [
      {
        args: [],
        description: [
          "Overwrites the current dashboard stored on remote with the current local dashboard",
        ],
      },
    ];
    super("save", longDescription, [], examples);
  }
  aliases: string[] = ["save-dashboard"];
  description = "Saves dashboard to remote";

  async execute(args: string[]): Promise<VaunchResponse> {
    const sessionConfig = useSessionStore();
    const folderStore = useFolderStore();
    const dashboardPostUrl = new URL('/dashboard', sessionConfig.backendURL).href;
    const response = await fetch(dashboardPostUrl, {
      mode: "cors",
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 1,
        name: "main",
        data: stringifyDashboard(folderStore.rawFolders)
      })
    })

    if (response.status == 200) {
      return this.makeResponse(ResponseType.Success, "Dashboard updated");
    } else return this.makeResponse(ResponseType.Error, "Failed to save dashboard");
  }
}
