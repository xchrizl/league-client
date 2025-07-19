// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from "electron";
import { LolChatFriend, LolChatMe } from "./lcu/types";

const defs = {
  getChatInfo: () => ipcRenderer.invoke("get-chat-info") as Promise<LolChatMe>,
  getLeaguePath: () => ipcRenderer.invoke("get-league-path") as Promise<string>,
  getFriends: () =>
    ipcRenderer.invoke("get-friends") as Promise<LolChatFriend[]>,
};

contextBridge.exposeInMainWorld("electronAPI", defs);

declare global {
  interface Window {
    electronAPI: typeof defs;
  }
}
