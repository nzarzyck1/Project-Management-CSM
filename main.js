const { app, BrowserWindow, clipboard, dialog, ipcMain, shell } = require('electron');
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const XLSX = require('xlsx');
const Tesseract = require('tesseract.js');
const { autoUpdater } = require('electron-updater');

const REQUIRED_FIELDS = [
  'DBA Name',
  'MID',
  'Task Name',
  'SkyTabCSM_Stage',
  'Last CSMTouch Point Note',
  'Order Start Date',
  'Install Date',
  'Programming Type'
];
const ALLOWED_EXTERNAL_URLS = new Set([
  'https://shift4.palantirfoundry.com/workspace/carbon/ri.carbon.main.workspace.6fd671da-71fd-4202-9679-6d0a74f6fc69/ri.workshop.main.module.162d3bb8-71d5-4b99-b3f4-4d22c228a3df',
  'https://wf.shift4.com/Primary/H/?FolderId=98e6e2e9-6067-11ed-aaab-0e1d8cb44bd9&pageName=CSM+Dashboard&Status=01KTW4CMAP0CM1FBS6Y8RY23T6&TID=01KTW4CP42137JVPBS69P11RKH'
]);

const SUPABASE_URL = 'https://wdsshmqsqknttytfchpz.supabase.co';
const SUPABASE_KEY = 'sb_publishable__OJywYO4yvTZFzxYeD9GHA_r9OgwXdq';
const SUPABASE_TABLE = 'launchpad_merchants';
const SUPABASE_PROFILE_TABLE = 'launchpad_profiles';
const OWNER_EMAIL = 'ngzarzycki@gmail.com';

let mainWindow;
let updateCheckInProgress = false;
let updateCheckWasManual = false;
let updateDownloadInProgress = false;
let lastUpdateCheckAt = 0;

function sharedDataPath() {
  const configuredDir = process.env.LAUNCHPAD_DATA_DIR;
  if (configuredDir) return path.join(configuredDir, 'merchants.json');
  const googleDriveDir = path.join('G:', 'My Drive', 'Visual Code Studio', 'LaunchPad', 'LaunchPad Data');
  return fsSync.existsSync(path.dirname(googleDriveDir)) ? path.join(googleDriveDir, 'merchants.json') : '';
}

function portableDataPath() {
  if (!app.isPackaged) return '';
  const portableDir = path.join(path.dirname(process.execPath), 'LaunchPad Data');
  return fsSync.existsSync(portableDir) ? path.join(portableDir, 'merchants.json') : '';
}

function userDataPath() {
  return path.join(app.getPath('userData'), 'merchants.json');
}

function userCachePath(userId) {
  return path.join(app.getPath('userData'), 'users', String(userId || 'unknown'), 'merchants.json');
}

function dataPath() {
  return portableDataPath() || sharedDataPath() || userDataPath();
}

function legacyDataPath() {
  return path.join(path.dirname(app.getPath('userData')), 'CSM Project CRM', 'merchants.json');
}

function sessionPath() {
  return path.join(app.getPath('userData'), 'supabase-session.json');
}

function candidateDataPaths() {
  return [dataPath(), sharedDataPath(), userDataPath(), legacyDataPath()].filter((candidate, index, paths) => (
    candidate && paths.indexOf(candidate) === index
  ));
}

function normalizeExcelDate(value) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const text = String(value);
  const isoDate = text.match(/\d{4}-\d{2}-\d{2}/);
  return isoDate ? isoDate[0] : text;
}

function normalizeExcelDateTime(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const pad = (part) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function normalizeHeader(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function readCell(row, aliases) {
  const normalizedAliases = aliases.map(normalizeHeader);
  const key = Object.keys(row).find((candidate) => normalizedAliases.includes(normalizeHeader(candidate)));
  return key ? row[key] : '';
}

function hasColumn(row, aliases) {
  const normalizedAliases = aliases.map(normalizeHeader);
  return Object.keys(row).some((candidate) => normalizedAliases.includes(normalizeHeader(candidate)));
}

function hasValue(row, aliases) {
  return String(readCell(row, aliases) || '').trim() !== '';
}

function mapRow(row) {
  const dbaName = String(readCell(row, ['DBA Name', 'DBAName', 'DBA']) || '').trim();
  const mid = String(readCell(row, ['MID']) || '').trim();
  const stage = readCell(row, ['SkyTabCSM_Stage', 'SkyTabCSM_Status', 'Status']);
  const programmingType = hasValue(row, ['Order ID'])
    ? 'S4 Programming'
    : readCell(row, ['Programming Type', 'ProgrammingType']);
  const importedAccountStatus = String(readCell(row, [
    'Account Status',
    'Account Status Code',
    'AccountStatus',
    'Merchant Status',
    'Merchant Status Code',
    'Status Code',
    'Status'
  ]) || '').trim();
  const accountStatus = /^(425|600|cancelled|moved off)$/i.test(importedAccountStatus) ? importedAccountStatus : '';

  return {
    id: randomUUID(),
    dbaName,
    mid,
    accountStatus,
    recordSource: 'import',
    taskName: readCell(row, ['Task Name']),
    stage: stage || 'Unassigned',
    lastNote: readCell(row, ['Last CSMTouch Point Note']),
    orderStartDate: normalizeExcelDate(readCell(row, ['Order Start Date', 'Start Date'])),
    installationDate: normalizeExcelDateTime(readCell(row, ['Installation Date', 'Install Date'])),
    programmingType,
    merchantName: readCell(row, ['Merchant Name']),
    merchantEmail: readCell(row, ['Merchant Email']),
    salesRepName: readCell(row, ['Sales Rep Name']),
    salesRepEmail: readCell(row, ['Sales Rep Email']),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function cleanContactName(value) {
  const cleaned = String(value || '')
    .replace(/\b(ContactGroup|OWNER|REP|CONTACT|TRUE|FALSE|TextMe|Name|Email|Phone)\b/gi, ' ')
    .replace(/\[[^\]]+\]/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-zA-Z.' -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return titleCaseName(cleaned);
}

function titleCaseName(value) {
  return String(value || '').replace(/[A-Za-z]+(?:['-][A-Za-z]+)*/g, (word) => (
    word.split(/([ '-])/).map((part) => (
      /^[A-Za-z]/.test(part)
        ? `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`
        : part
    )).join('')
  ));
}

function normalizePhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length < 7) return '';
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1);
  return digits.slice(0, 10);
}

function normalizeContactType(value) {
  const cleaned = String(value || '').trim().toUpperCase();
  if (cleaned.includes('OWNER')) return 'Owner';
  if (cleaned.includes('REP')) return 'Rep';
  if (cleaned.includes('CONTACT')) return 'Contact';
  return '';
}

function normalizeOcrEmail(value) {
  return String(value || '')
    .replace(/\s+/g, '')
    .replace(/[,;]+$/g, '')
    .toLowerCase();
}

function parseContactsFromText(text) {
  const contacts = [];
  const emailPattern = /[A-Z0-9._%+-]+(?:\s*@\s*)[A-Z0-9.-]+(?:\s*\.\s*)[A-Z]{2,}/ig;
  const phonePattern = /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}|\b\d{10}\b/g;
  const skipPattern = /^\s*(Name|Email|ContactGroup|Phone|TextMe)\b|ContactGroup:\s*\w+|\[\s*ContactGroup\s*\]|\(\s*\d+\s*items?\s*\)/i;

  String(text || '').split(/\r?\n/).forEach((line) => {
    const source = line
      .replace(/\s*@\s*/g, '@')
      .replace(/\s*\.\s*(COM|NET|ORG|CO)\b/gi, '.$1')
      .replace(/\s+/g, ' ')
      .trim();
    const raw = source
      .replace(/\b(TextMe|true|false)\b/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!raw || skipPattern.test(raw)) return;

    const typeMatch = raw.match(/\b(OWNER|REP|CONTACT)\b/i);
    const type = normalizeContactType(typeMatch?.[0] || '');
    const emailMatch = [...raw.matchAll(emailPattern)][0];
    const email = normalizeOcrEmail(emailMatch?.[0] || '');
    const phoneMatch = [...raw.matchAll(phonePattern)].find((match) => normalizePhone(match[0]) !== email.replace(/\D/g, '').slice(0, 10));
    const phone = normalizePhone(phoneMatch?.[0] || '');
    let nameSource = raw;
    const cutPoints = [emailMatch?.index, typeMatch?.index, phoneMatch?.index].filter((index) => Number.isInteger(index) && index > 0);
    if (cutPoints.length) nameSource = raw.slice(0, Math.min(...cutPoints));
    nameSource = nameSource
      .replace(emailPattern, ' ')
      .replace(phonePattern, ' ')
      .replace(/\b(OWNER|REP|CONTACT)\b/gi, ' ');
    const name = cleanContactName(nameSource);

    if (!name && !email && !phone) return;
    if (!email && !phone && name.split(' ').length < 2) return;

    contacts.push({ type, name, email, phone });
  });

  const seen = new Set();
  return contacts.filter((contact) => {
    const key = [contact.name.toLowerCase(), contact.email, contact.phone].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function cleanClipboardText(value) {
  return String(value || '').replace(/^[\s\u00a0]+/, '').replace(/[\s\u00a0]+$/, '');
}

function cleanClipboardHtml(value) {
  return String(value || '')
    .replace(/^(?:\s|<br\s*\/?>|&nbsp;|\u00a0)+/i, '')
    .replace(/(?:\s|<br\s*\/?>|&nbsp;|\u00a0)+$/i, '');
}

async function readMerchants() {
  for (const candidate of candidateDataPaths()) {
    try {
      const raw = await fs.readFile(candidate, 'utf8');
      return JSON.parse(raw);
    } catch {
      // Try the next known data location.
    }
  }
  return [];
}

async function writeMerchants(merchants) {
  await fs.mkdir(path.dirname(dataPath()), { recursive: true });
  await fs.writeFile(dataPath(), JSON.stringify(merchants, null, 2));
  return merchants;
}

async function readUserCache(userId) {
  try {
    return JSON.parse(await fs.readFile(userCachePath(userId), 'utf8'));
  } catch {
    return [];
  }
}

async function writeUserCache(userId, merchants) {
  const cachePath = userCachePath(userId);
  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, JSON.stringify(merchants, null, 2));
  return merchants;
}

async function readSession() {
  try {
    return JSON.parse(await fs.readFile(sessionPath(), 'utf8'));
  } catch {
    return null;
  }
}

async function writeSession(session) {
  await fs.mkdir(path.dirname(sessionPath()), { recursive: true });
  await fs.writeFile(sessionPath(), JSON.stringify(session, null, 2));
  return session;
}

async function clearSession() {
  try {
    await fs.unlink(sessionPath());
  } catch {
    // Already signed out.
  }
}

function sessionUser(session) {
  return session?.user || session?.data?.user || null;
}

function sessionAccessToken(session) {
  return session?.access_token || session?.data?.session?.access_token || '';
}

function sessionRefreshToken(session) {
  return session?.refresh_token || session?.data?.session?.refresh_token || '';
}

function sessionExpiresAt(session) {
  return Number(session?.expires_at || session?.data?.session?.expires_at || 0);
}

async function supabaseFetch(pathname, options = {}, requireAuth = true) {
  let session = await currentSession();
  const token = sessionAccessToken(session);
  if (requireAuth && !token) throw new Error('Not signed in.');

  const response = await fetch(`${SUPABASE_URL}${pathname}`, {
    ...options,
    headers: {
      apikey: SUPABASE_KEY,
      ...(requireAuth ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(body?.msg || body?.message || response.statusText);
  }
  return body;
}

async function refreshSession(session) {
  const refreshToken = sessionRefreshToken(session);
  if (!refreshToken) return session;
  const refreshed = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh_token: refreshToken })
  });
  const body = await refreshed.json();
  if (!refreshed.ok) throw new Error(body?.msg || body?.message || refreshed.statusText);
  await writeSession(body);
  return body;
}

async function currentSession() {
  const session = await readSession();
  if (!session) return null;
  const expiresAt = sessionExpiresAt(session);
  if (expiresAt && expiresAt < Math.floor(Date.now() / 1000) + 90) {
    try {
      return await refreshSession(session);
    } catch {
      await clearSession();
      return null;
    }
  }
  return session;
}

function merchantRow(merchant, userId) {
  return {
    id: merchant.id,
    user_id: userId,
    dba_name: merchant.dbaName || null,
    mid: merchant.mid || null,
    task_name: merchant.taskName || null,
    stage: merchant.stage || null,
    programming_type: merchant.programmingType || null,
    merchant_data: merchant,
    updated_at: merchant.updatedAt || new Date().toISOString()
  };
}

function merchantFromRow(row) {
  return {
    ...(row.merchant_data || {}),
    id: row.id,
    dbaName: row.merchant_data?.dbaName || row.dba_name || '',
    mid: row.merchant_data?.mid || row.mid || '',
    taskName: row.merchant_data?.taskName || row.task_name || '',
    stage: row.merchant_data?.stage || row.stage || '',
    programmingType: row.merchant_data?.programmingType || row.programming_type || '',
    updatedAt: row.updated_at || row.merchant_data?.updatedAt
  };
}

async function isOnlineSignedIn() {
  const session = await currentSession();
  if (!sessionAccessToken(session) || !sessionUser(session)?.id) return false;
  const profile = await currentUserProfile(session);
  return Boolean(profile.approved);
}

async function currentUserProfile(session = null) {
  const activeSession = session || await currentSession();
  const user = sessionUser(activeSession);
  if (!user?.id) return { approved: false, isAdmin: false, email: '' };
  try {
    const rows = await supabaseFetch(`/rest/v1/${SUPABASE_PROFILE_TABLE}?user_id=eq.${encodeURIComponent(user.id)}&select=user_id,email,approved,is_admin`, { method: 'GET' });
    const profile = rows?.[0];
    return {
      approved: Boolean(profile?.approved),
      isAdmin: Boolean(profile?.is_admin),
      email: profile?.email || user.email || ''
    };
  } catch (error) {
    console.error(error);
    const isOwner = String(user.email || '').toLowerCase() === OWNER_EMAIL;
    return { approved: isOwner, isAdmin: isOwner, email: user.email || '' };
  }
}

async function readOnlineMerchants() {
  const rows = await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?select=*&order=updated_at.desc`, {
    method: 'GET'
  });
  return rows.map(merchantFromRow);
}

async function writeOnlineMerchants(merchants) {
  const session = await currentSession();
  const userId = sessionUser(session)?.id;
  if (!userId) throw new Error('Not signed in.');
  const existingRows = await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?select=id`, { method: 'GET' });
  const nextIds = new Set(merchants.map((merchant) => merchant.id));
  const removeIds = existingRows.map((row) => row.id).filter((id) => !nextIds.has(id));
  if (removeIds.length) {
    await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}?id=in.(${removeIds.map(encodeURIComponent).join(',')})`, {
      method: 'DELETE'
    });
  }
  if (merchants.length) {
    await supabaseFetch(`/rest/v1/${SUPABASE_TABLE}`, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(merchants.map((merchant) => merchantRow(merchant, userId)))
    });
  }
  await writeUserCache(userId, merchants);
  return readOnlineMerchants();
}

async function readMerchantsFromBestSource() {
  if (await isOnlineSignedIn()) {
    const session = await currentSession();
    const user = sessionUser(session);
    const profile = await currentUserProfile(session);
    try {
      const merchants = await readOnlineMerchants();
      if (merchants.length) {
        await writeUserCache(user.id, merchants);
        return merchants;
      }
      const localMerchants = profile.isAdmin ? await readMerchants() : [];
      if (profile.isAdmin && localMerchants.length) {
        return writeOnlineMerchants(localMerchants);
      }
      return [];
    } catch (error) {
      console.error(error);
      return readUserCache(user.id);
    }
  }
  return [];
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 1100,
    minHeight: 720,
    title: 'LaunchPad',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.on('focus', () => {
    if (app.isPackaged && Date.now() - lastUpdateCheckAt > 5 * 60 * 1000) checkForUpdates(false);
  });
}

function sendUpdateStatus(status, message = '') {
  mainWindow?.webContents.send('update:status', { status, message });
}

async function checkForUpdates(manual = false) {
  if (!app.isPackaged) {
    if (manual) sendUpdateStatus('development', 'Updates are checked in installed builds.');
    return;
  }
  if (updateCheckInProgress || updateDownloadInProgress) return;
  updateCheckInProgress = true;
  updateCheckWasManual = manual;
  lastUpdateCheckAt = Date.now();
  autoUpdater.autoDownload = false;
  autoUpdater.autoInstallOnAppQuit = true;
  try {
    if (manual) sendUpdateStatus('checking', 'Checking for updates...');
    await autoUpdater.checkForUpdates();
  } catch (error) {
    console.error(error);
    if (manual) sendUpdateStatus('error', error.message || 'Could not check for updates.');
    updateCheckInProgress = false;
  }
}

function setupAutoUpdater() {
  autoUpdater.on('update-available', async (info) => {
    updateCheckInProgress = false;
    updateCheckWasManual = false;
    const response = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'LaunchPad Update Available',
      message: `LaunchPad ${info.version} is available.`,
      detail: 'Download the update now? Your merchant data and sign-in are preserved.',
      buttons: ['Download Update', 'Not Now'],
      defaultId: 0,
      cancelId: 1
    });
    if (response.response === 0) {
      updateDownloadInProgress = true;
      sendUpdateStatus('downloading', `Downloading LaunchPad ${info.version}...`);
      autoUpdater.downloadUpdate();
    }
  });

  autoUpdater.on('update-not-available', () => {
    updateCheckInProgress = false;
    if (updateCheckWasManual) sendUpdateStatus('current', 'LaunchPad is up to date.');
    updateCheckWasManual = false;
  });

  autoUpdater.on('download-progress', (progress) => {
    sendUpdateStatus('downloading', `Downloading update: ${Math.round(progress.percent || 0)}%`);
  });

  autoUpdater.on('update-downloaded', async (info) => {
    updateDownloadInProgress = false;
    const response = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'LaunchPad Update Ready',
      message: `LaunchPad ${info.version} is ready to install.`,
      detail: 'Restart LaunchPad now to finish the update. Your merchant data will not be removed.',
      buttons: ['Restart and Install', 'Later'],
      defaultId: 0,
      cancelId: 1
    });
    if (response.response === 0) autoUpdater.quitAndInstall(false, true);
  });

  autoUpdater.on('error', (error) => {
    console.error(error);
    updateCheckInProgress = false;
    updateDownloadInProgress = false;
    if (updateCheckWasManual) sendUpdateStatus('error', error.message || 'Update failed.');
    updateCheckWasManual = false;
  });
}

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();
  if (app.isPackaged) {
    setTimeout(() => checkForUpdates(false), 5000);
    setInterval(() => checkForUpdates(false), 15 * 60 * 1000);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('merchants:load', readMerchantsFromBestSource);
ipcMain.handle('update:check', () => checkForUpdates(true));

ipcMain.handle('merchants:save', async (_event, merchants) => {
  const nextMerchants = merchants.map((merchant) => ({
    ...merchant,
    updatedAt: new Date().toISOString()
  }));
  if (await isOnlineSignedIn()) return writeOnlineMerchants(nextMerchants);
  return writeMerchants(nextMerchants);
});

ipcMain.handle('merchant:upsert', async (_event, merchant) => {
  const merchants = await readMerchantsFromBestSource();
  const now = new Date().toISOString();
  const nextMerchant = {
    ...merchant,
    id: merchant.id || randomUUID(),
    stage: merchant.stage || 'Unassigned',
    createdAt: merchant.createdAt || now,
    updatedAt: now
  };
  const index = merchants.findIndex((item) => item.id === nextMerchant.id);
  if (index >= 0) merchants[index] = nextMerchant;
  else merchants.unshift(nextMerchant);
  if (await isOnlineSignedIn()) return writeOnlineMerchants(merchants);
  return writeMerchants(merchants);
});

ipcMain.handle('merchant:delete', async (_event, merchantId) => {
  const currentMerchants = await readMerchantsFromBestSource();
  const merchant = currentMerchants.find((item) => item.id === merchantId);
  if (merchant?.recordSource !== 'manual') throw new Error('Imported accounts can only be removed by undoing their import.');
  const merchants = currentMerchants.filter((item) => item.id !== merchantId);
  if (await isOnlineSignedIn()) return writeOnlineMerchants(merchants);
  return writeMerchants(merchants);
});

ipcMain.handle('auth:status', async () => {
  const session = await currentSession();
  const user = sessionUser(session);
  const profile = await currentUserProfile(session);
  return {
    signedIn: Boolean(sessionAccessToken(session) && user),
    email: user?.email || '',
    approved: profile.approved,
    isAdmin: profile.isAdmin,
    source: sessionAccessToken(session) && user ? 'Supabase' : 'Local'
  };
});

ipcMain.handle('auth:signIn', async (_event, { email, password }) => {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body?.msg || body?.message || response.statusText);
  await writeSession(body);
  const profile = await currentUserProfile(body);
  return { signedIn: true, email: body.user?.email || email, approved: profile.approved, isAdmin: profile.isAdmin, source: 'Supabase' };
});

ipcMain.handle('auth:signUp', async (_event, { email, password }) => {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body?.msg || body?.message || response.statusText);
  const signedIn = Boolean(sessionAccessToken(body));
  if (signedIn) await writeSession(body);
  const profile = signedIn ? await currentUserProfile(body) : { approved: false, isAdmin: false };
  return {
    signedIn,
    email: sessionUser(body)?.email || body.user?.email || email,
    approved: profile.approved,
    isAdmin: profile.isAdmin,
    source: signedIn ? 'Supabase' : 'Local'
  };
});

ipcMain.handle('auth:signOut', async () => {
  try {
    await supabaseFetch('/auth/v1/logout', { method: 'POST' });
  } catch {
    // Local sign-out still clears the cached session.
  }
  await clearSession();
  return { signedIn: false, email: '', source: 'Local' };
});

ipcMain.handle('auth:listUsers', async () => {
  const profile = await currentUserProfile();
  if (!profile.isAdmin) throw new Error('Administrator access is required.');
  return supabaseFetch(`/rest/v1/${SUPABASE_PROFILE_TABLE}?select=user_id,email,approved,is_admin,created_at&order=created_at.asc`, { method: 'GET' });
});

ipcMain.handle('auth:setApproval', async (_event, { userId, approved }) => {
  const profile = await currentUserProfile();
  if (!profile.isAdmin) throw new Error('Administrator access is required.');
  await supabaseFetch(`/rest/v1/${SUPABASE_PROFILE_TABLE}?user_id=eq.${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ approved: Boolean(approved), updated_at: new Date().toISOString() })
  });
  return true;
});

ipcMain.handle('excel:import', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Import merchant queue',
    filters: [{ name: 'Excel Workbooks', extensions: ['xlsx', 'xls'] }],
    properties: ['openFile']
  });
  if (result.canceled || !result.filePaths.length) return null;

  const workbook = XLSX.readFile(result.filePaths[0], { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  const merchants = rows
    .map(mapRow)
    .filter((merchant) => merchant.dbaName || merchant.mid);

  return {
    filePath: result.filePaths[0],
    rows: merchants,
    fieldsFound: Object.keys(rows[0] || {}),
    requiredFields: REQUIRED_FIELDS
  };
});

ipcMain.handle('excel:importSample', async () => {
  const samplePath = path.join(__dirname, 'sample-import.xlsx');
  const workbook = XLSX.readFile(samplePath, { cellDates: true });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return {
    filePath: samplePath,
    rows: rows
      .map(mapRow)
      .filter((merchant) => merchant.dbaName || merchant.mid),
    fieldsFound: Object.keys(rows[0] || {}),
    requiredFields: REQUIRED_FIELDS
  };
});

ipcMain.handle('contacts:importImage', async () => {
  let imageBuffer = null;
  let source = 'clipboard';
  const clipboardImage = clipboard.readImage();

  if (!clipboardImage.isEmpty()) {
    imageBuffer = clipboardImage.toPNG();
  } else {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Import contacts from screenshot',
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'bmp', 'webp'] }],
      properties: ['openFile']
    });
    if (result.canceled || !result.filePaths.length) return null;
    source = result.filePaths[0];
    imageBuffer = await fs.readFile(result.filePaths[0]);
  }

  const ocrResult = await Tesseract.recognize(imageBuffer, 'eng');
  const text = ocrResult.data.text || '';
  return {
    source,
    text,
    contacts: parseContactsFromText(text)
  };
});

ipcMain.handle('clipboard:writeText', (_event, text) => {
  clipboard.clear();
  clipboard.writeText(cleanClipboardText(text));
  return true;
});

ipcMain.handle('clipboard:writeEmail', (_event, payload = {}) => {
  const text = cleanClipboardText(payload.text);
  const html = cleanClipboardHtml(payload.html);
  clipboard.clear();
  clipboard.write(html ? { text, html } : { text });
  return true;
});

ipcMain.handle('app:openDataFolder', () => {
  shell.openPath(path.dirname(dataPath()));
});

ipcMain.handle('app:openExternal', async (_event, url) => {
  if (!ALLOWED_EXTERNAL_URLS.has(url)) throw new Error('External URL is not allowed.');
  await shell.openExternal(url);
  return true;
});
