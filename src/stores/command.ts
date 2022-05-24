import { VaunchMkdir } from "@/models/VaunchMkdir";
// import { useConfigStore } from "@/stores/config";
// import { useFolderStore } from "@/stores/folder";

export const commands = [
  new VaunchMkdir(),
]

// export const commands = {
//   "feh": function (background: string) {
//     const config = useConfigStore();
//     config.background = background;
//   },
//   "mkdir": function (folders: string[]) {
//     const folder = useFolderStore();
//     folders.forEach((newFolder) => {
//       folder.add(newFolder);
//     })
//   },
//   "rmdir": function (folders: string[]) {
//     const folder = useFolderStore();
//     folders.forEach((toDelete) => {
//       folder.remove(toDelete);
//     })
//   }
// }

// import { defineStore } from "pinia";
// import { useFolderStore } from "@/stores/folder";
// import { useConfigStore } from "@/stores/config";

// export const useCommandStore = defineStore({
//   id: "command",
//   state: () => ({
//     available: [
//       "mkdir", "rmdir", "touch", "feh"
//     ],
//     commands: [
//       {
//         "feh": function(background:string){
//           const config = useConfigStore();
//           config.background = background;
//         },
//         "mkdir": function(folders:string[]) {
//           const folder = useFolderStore();
//           folders.forEach((newFolder) => {
//             folder.add(newFolder);
//           })
//         },
//         "rmdir": function(folders:string[]) {
//           const folder = useFolderStore();
//           folders.forEach((toDelete) => {
//             folder.remove(toDelete);
//           })
//         }
//     }
//     ]
//   }),
//   actions: {
//     set_background(background:string) {
//       const config = useConfigStore();
//       config.background = background;
//     },
//     create_dir(folders:string[]) {
//       const folder = useFolderStore();
//       folders.forEach((newFolder) => {
//         folder.add(newFolder);
//       })
//     },
//     delete_dir(folders:string[]) {
//       const folder = useFolderStore();
//       folders.forEach((toDelete) => {
//         folder.remove(toDelete);
//       })
//     }
//   }
// });
