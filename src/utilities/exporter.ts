import type { VaunchFolder } from "@/models/VaunchFolder";

// Converts the current state of Vaunch into a JSON object
export function exportVaunch(folders: VaunchFolder[], config: any): string {
  const vaunchData = {
    folders: [] as any[],
    config: {},
  };

  // If a config proxy has been passed, convert it into JSON
  // TODO: this can definitely be done better, however as Pinia stores use Proxy objects
  // simply setting vaunchData["config"] = config results in some odd nested objects when stringify-ing
  if (config) {
    vaunchData["config"] = {
      background: config.background,
      showGUI: config.showGUI,
      titleCase: config.titleCase,
      defaultFile: config.defaultFile,
      fuzzy: config.fuzzy,
      showCommands: config.showCommands,
      prefix: {
        class: config.prefix.class,
        name: config.prefix.name,
      },
      color: {
        window: config.color.window,
        windowOpaque: config.color.windowOpaque,
        text: config.color.text,
        autocomplete: config.color.autocomplete,
        highlight: config.color.highlight,
      },
    };
  }

  // Add each folder's JSON information to the export object
  for (const folder of folders) {
    vaunchData.folders.push(folder.info());
  }
  return JSON.stringify(vaunchData, undefined, 2);
}

export function readImportFile(file: Blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      if (fr.result) {
        const importObject = JSON.parse(fr.result.toString());
        resolve(importObject);
      }
    };
    fr.onerror = reject;
    fr.readAsText(file);
  });
}
