import { defineStore, type StoreDefinition } from "pinia";
import type { Dashboard } from "@/models/Dashboard";
import { useSessionStore } from "./sessionState";
import { parseDashboard } from "@/utilities/parser";

export const useDashboardStore: StoreDefinition = defineStore({
  id: "dashboard",
  state: () => ({
    dashboards: new Map<string, Dashboard>(),
    context: "",
  }),
  getters: {
    currentDashboard: (state: {
      dashboards: Map<string, Dashboard>;
      context: string;
    }) => state.dashboards.get(state.context),
    // Returns a simple array of all dashboards, without map keys
    allDashboards: (state: {
      dashboards: Map<string, Dashboard>;
      context: string;
    }): Dashboard[] => Array.from(state.dashboards.values()),
  },
  actions: {
    setContext(newContext: string) {
      this.context = newContext;
    },
    addDashboard(name: string, dashboard: Dashboard) {
      this.dashboards.set(name, dashboard)
    },
    async getDashboard() {
      const sessionConfig = useSessionStore()
      const dashboardIdUrl = new URL('/dashboard/1', sessionConfig.backendURL).href;
      const response = await fetch(dashboardIdUrl, {
        credentials: "include",
        method: "GET",
        mode: "cors",
      });
      const dashboard = await response.json();
      if (dashboard) {
        // Load the dashboard data from the remote
        const dash = parseDashboard(dashboard['dashboard']['name'], dashboard['dashboard']['data'])
        this.addDashboard(dash.name, dash);
        // If this is the first dashboard, set it as the current context
        if (this.dashboards.size == 1) {
          this.setContext(dashboard['dashboard']['name'])
        }
        console.log(this.context);
        console.log(this.currentDashboard);
      }
    },
  },
});
