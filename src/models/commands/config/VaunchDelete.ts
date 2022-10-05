import { VaunchCommand } from "@/models/VaunchCommand";
import type { Example } from "@/models/VaunchManual";
import { ResponseType, type VaunchResponse } from "@/models/VaunchResponse";
import { useFolderStore } from "@/stores/folder";
import { useSessionStore } from "@/stores/sessionState";

export class VaunchDelete extends VaunchCommand {
  constructor() {
    const longDescription: string[] = [
      "Deletes the current dashboard from the backend. Users that had access to this dashboard will no longer be able to use it.",
    ];
    const examples: Example[] = [
      {
        args: [],
        description: [
          "Deletes the dashboard from the remote server, and will no longer be usable by other users",
        ],
      },
    ];
    super("delete", longDescription, [], examples);
  }
  aliases: string[] = ["delete-dashboard"];
  description = "Deletes the dashboard on remote";

  async execute(args: string[]): Promise<VaunchResponse> {
    const sessionConfig = useSessionStore();
    const dashboardPostUrl = new URL('/dashboard/1', sessionConfig.backendURL).href;
    const response = await fetch(dashboardPostUrl, {
      mode: "cors",
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.status == 200) {
      const folderStore = useFolderStore();
      folderStore.getDashboard();
      return this.makeResponse(ResponseType.Success, "Dashboard deleted");
    } else return this.makeResponse(ResponseType.Error, "Failed to delete dashboard");
  }
}
