const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('crm', {
  loadMerchants: () => ipcRenderer.invoke('merchants:load'),
  saveMerchants: (merchants) => ipcRenderer.invoke('merchants:save', merchants),
  upsertMerchant: (merchant) => ipcRenderer.invoke('merchant:upsert', merchant),
  deleteMerchant: (merchantId) => ipcRenderer.invoke('merchant:delete', merchantId),
  authStatus: () => ipcRenderer.invoke('auth:status'),
  setActiveAccount: (ownerUserId) => ipcRenderer.invoke('auth:setActiveAccount', ownerUserId),
  signIn: (email, password) => ipcRenderer.invoke('auth:signIn', { email, password }),
  signUp: (email, password) => ipcRenderer.invoke('auth:signUp', { email, password }),
  signOut: () => ipcRenderer.invoke('auth:signOut'),
  listUsers: () => ipcRenderer.invoke('auth:listUsers'),
  setUserApproval: (userId, approved) => ipcRenderer.invoke('auth:setApproval', { userId, approved }),
  setUserAccess: (access) => ipcRenderer.invoke('auth:setAccess', access),
  listShares: () => ipcRenderer.invoke('share:list'),
  addShare: (email) => ipcRenderer.invoke('share:add', email),
  removeShare: (shareId) => ipcRenderer.invoke('share:remove', shareId),
  importExcel: () => ipcRenderer.invoke('excel:import'),
  importSample: () => ipcRenderer.invoke('excel:importSample'),
  importContactsFromImage: () => ipcRenderer.invoke('contacts:importImage'),
  openDataFolder: () => ipcRenderer.invoke('app:openDataFolder'),
  openExternal: (url) => ipcRenderer.invoke('app:openExternal', url),
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  onUpdateStatus: (callback) => ipcRenderer.on('update:status', (_event, payload) => callback(payload)),
  copyText: (text) => ipcRenderer.invoke('clipboard:writeText', text),
  copyEmail: (html, text) => ipcRenderer.invoke('clipboard:writeEmail', { html, text })
});
