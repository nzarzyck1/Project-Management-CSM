const STAGES = ['Active', 'Stalled', 'Non-Responsive', 'Cancelled', 'Completed'];
const TASKS = ['Cancelled', 'Stalled', 'Moved Off', 'Merchant Confirmation Form', 'Launch Control', 'CSM Approval', 'Programming', 'Schedule Presentation', 'Presentation', 'Ready for Install', 'Completed'];
const TASK_ORDER_STORAGE_VERSION = '5';
const HIDDEN_TASKS_STORAGE_VERSION = '2';
const DEFAULT_HIDDEN_TASKS = ['Stalled', 'Merchant Confirmation Form', 'Cancelled', 'Completed'];
const PROGRAMMING_TYPES = ['', 'S4 Programming'];
const VIEWS = [
  { id: 'stage-kanban', label: 'Stage' },
  { id: 'task-kanban', label: 'Task' },
  { id: 'programming-kanban', label: 'Type' },
  { id: 'list', label: 'List' }
];
const EQUIPMENT_TYPES = ['Shift4 Dine Workstations', 'Customer Facing Displays', 'Kitchen Display Screens', 'Remote Impact Printers', 'Remote Thermal Printers', 'Kiosk', 'Shift4 Duo', 'Tablet', 'Handheld', 'Caller ID Analog'];
const TAX_CLASSES = ['Food', 'Beverage', 'Retail', 'Beer', 'Liquor', 'Wine'];
const ADVANTAGE_SURCHARGES = ['Dual Pricing', 'Supplemental Fee', 'Cash Discount', 'None'];
const ADVANTAGE_RATES = ['', '3.0', '3.25', '3.5', '3.75', '4'];
const WEEK_DAYS = ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Sun'];
const EMPLOYEE_JOBS = ['Owner', 'Manager', 'Bartender', 'Server', 'Cashier', 'BOH'];
const THIRD_PARTIES = ['Doordash', 'GrubHub', 'UberEats'];
const CARD_FIELD_OPTIONS = [
  { id: 'mid', label: 'MID' },
  { id: 'install', label: 'Install Date' },
  { id: 'lifeCycle', label: 'Life Cycle' },
  { id: 'programmingType', label: 'Programming Type' },
  { id: 'welcomeEmail', label: 'Welcome Email' }
];
const CARD_SETTINGS_VERSION = '2';
const DEFAULT_CARD_FIELDS = ['mid', 'install', 'welcomeEmail'];
const TIME_OPTIONS = Array.from({ length: 48 }, (_item, index) => {
  const hour24 = Math.floor(index / 2);
  const minute = index % 2 ? '30' : '00';
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${minute} ${suffix}`;
});
const ORDER_LINKS = {
  siteReadiness: { label: 'S4 - Customer Site Readiness Guide', url: 'https://shift4.zendesk.com/hc/en-us/articles/19349224790675-SkyTab-Customer-Site-Readiness-Guide' },
  giftCardFaq: { label: 'Gift Card FAQ', url: 'https://shift4.zendesk.com/hc/en-us/articles/4402400530195-Gift-Card-Program-FAQs' },
  lighthouse: { label: 'Lighthouse Business Manager', url: 'https://www.youtube.com/playlist?list=PL0ZbOI7EXtQT4bTR8zEL0mDyNwk1lDGxH' },
  managerTraining: { label: 'Manager Training Videos', url: 'https://www.youtube.com/playlist?list=PL0ZbOI7EXtQT5vAWBODNHrENfXTFrEMAI' },
  employeeTraining: { label: 'Employee Training Videos', url: 'https://www.youtube.com/playlist?list=PL0ZbOI7EXtQTSwgSaNglH8EcyDNXEkK3g' }
};

const TEMPLATES = [
  {
    name: 'Welcome Email',
    body: `Hello {Merchant Name},\n\nCongratulations on placing your Shift4 Dine POS order for {DBA} {(MID)}.\n\nI'm Nathan, your Pre-Launch Specialist. I'll guide you through onboarding your new Shift4 Dine POS system.\n\nI’d like to schedule a Kickoff call to discuss what you can expect during the onboarding process to confirm POS order details so we can prepare you for lift-off! Please {Schedule Link} with what works best for you. The sooner we can jump on a call, the faster we can fuel up and launch your order into orbit!\n\nI look forward to working with you!\n\nBest Regards,`
  },
  {
    name: 'Blank Order Confirmation',
    body: `Hello,\n\nWe are writing to confirm that we have received your order for the Shift4 Dine POS system for {DBA Name} {(MID)}. The order was requested to be programmed and installed by Sales Partner {Rep Name}.\n\nThe Advantage Program Rate has been set up at: % ()\n\nHere are the details of the equipment on the order:\n\nShift4 Dine Workstations:\nRemote Impact Printers:\nRemote Thermal Printers:\nKitchen Display Screens:\nTablet:\nCustomer Facing Display:\nShift4 Duo:\nHandheld:\nKiosk:\n\nThe equipment is being shipped to the following address:\n\nAddress\n\nWe have forwarded this order to our Deployment department, and the equipment is expected to arrive by {Date}.\n\nPlease find some additional resources below regarding Shift4 Dine.\n\n{Offline Mode Overview and FAQs}\n{Resource Center}\n\nThank you for your order.\n\nBest regards,`
  },
  {
    name: 'Account on Hold',
    body: `Good morning {Merchant Name},\n\nI wanted to reach out because I see this account is still on Primary Hold. The notes from underwriting are the following:\n\n\n\nIf you can submit the information underwriting is requesting to {Underwriting Email}, they will approve your account and we can start the onboarding process.\n\nThank you!`
  },
  {
    name: 'First Attempt Follow Up',
    body: `Hi {Merchant's Name},\n\nI hope this message finds you well. My name is Nathan Zarzycki from Shift4, and I'm excited to assist you with the onboarding of your new Point of Sale System for {DBA}{(MID)}.\n\nI've been trying to reach you as it's important for us to connect and review key information about your order and business. This step is necessary before we can proceed with the shipping and installation of your system.\n\nPlease feel free to reach out to me directly at 888-276-2108 ext. 816326 or email me back here. I look forward to hearing from you soon so we can ensure a smooth and successful setup.\n\nWarm Regards,`
  },
  {
    name: 'Final Follow Up',
    body: `Hi {Merchant's Name},\n\nI hope you're doing well. I’ve been reaching out since [First Day of Reach Out] to assist you with the onboarding of your new Point of Sale System.\n\nIt's important for us to connect to review some key information about your order and business. This step is necessary before we can proceed with shipping and installation. If I don’t hear from you by [Insert Date], unfortunately, we will have to cancel your order until you confirm your interest in moving forward.\n\nPlease feel free to contact me directly at 888-276-2108 ext. 816326 or via email back here. I’m looking forward to ensuring your setup goes smoothly.\n\nThank you,`
  },
  {
    name: 'Menu Presentation',
    body: `Hello {Merchant Name},\n\nI hope you're doing well. I'm reaching out to arrange a presentation to review your menu before installation for {DBA} {(MID)}. This step is crucial to ensure that all programming is accurate and ready for seamless use on the day you go-live.\n\nThe presentation will be conducted via Google Meet and is expected to take about an hour. During this session, we’ll walk through your menu in detail, answer any questions you might have, and make any necessary adjustments.\n\nPlease let me know your availability by {Menu Presentation Schedule Link}. Your input is invaluable in making sure everything is set up just the way you need it.\n\nThank you, and I look forward to our conversation.`
  }
];

const SUBJECT_TEMPLATES = {
  'Welcome Email': '{DBA Name} - Welcome to Shift4 Dine',
  'Blank Order Confirmation': '{DBA Name} - Blank Order Confirmation',
  'Account on Hold': '{DBA Name} Account on Hold',
  'First Attempt Follow Up': 'Important: {DBA Name} New Point of Sale System from Shift4',
  'Final Follow Up': 'Urgent: {DBA Name} Onboarding Your New Point of Sale System',
  'Menu Presentation': '{DBA Name} Menu Presentation'
};

const ORDER_RECAP_SUBJECT = '{DBA Name} Shift4 Dine Kickoff Call Recap';

const SCHEDULE_URL = 'https://calendar.app.google/cPe6pB9ZEe5dqfJU9';
const MENU_BUILDER_URL = 'https://shift4.palantirfoundry.com/workspace/carbon/ri.carbon.main.workspace.6fd671da-71fd-4202-9679-6d0a74f6fc69/ri.workshop.main.module.162d3bb8-71d5-4b99-b3f4-4d22c228a3df';
const DECISIONS_URL = 'https://wf.shift4.com/Primary/H/?FolderId=98e6e2e9-6067-11ed-aaab-0e1d8cb44bd9&pageName=CSM+Dashboard&Status=01KTW4CMAP0CM1FBS6Y8RY23T6&TID=01KTW4CP42137JVPBS69P11RKH';
const TEMPLATE_LINKS = {
  'Schedule Link': { label: 'schedule here', url: SCHEDULE_URL },
  'Offline Mode Overview and FAQs': {
    label: 'Offline Mode Overview and FAQs',
    url: 'https://shift4.zendesk.com/hc/en-us/articles/4416200518931-Shift4-Dine-Offline-Payments-Overview-and-FAQs'
  },
  'Resource Center': {
    label: 'Resource Center',
    url: 'https://dine.shift4.com/resource-center'
  },
  'Underwriting Email': {
    label: 'uwgroup@shift4.com',
    url: 'mailto:uwgroup@shift4.com'
  },
  'Menu Presentation Schedule Link': {
    label: 'scheduling your appointment here',
    url: 'https://calendar.app.google/7pAq6Wva9QxHTfca7'
  }
};

const state = {
  merchants: [],
  selectedId: null,
  selectedIds: new Set(),
  view: loadDefaultView(),
  search: '',
  draggedId: null,
  draggedTask: null,
  draggedStage: null,
  draggedType: null,
  draggedView: null,
  panelTab: 'clientInfo',
  viewOrder: loadViewOrder(),
  stageOrder: loadStageOrder(),
  taskOrder: loadTaskOrder(),
  typeOrder: loadTypeOrder(),
  hiddenTasks: loadHiddenTasks(),
  showHiddenTasks: false,
  cardDensity: loadCardDensity(),
  cardFields: loadCardFields(),
  cardSort: localStorage.getItem('cardSort') || 'none',
  taskSorts: loadTaskSorts(),
  editMode: false,
  showCompleted: false,
  calendarMode: localStorage.getItem('calendarMode') || 'month',
  calendarDate: new Date(),
  csmName: localStorage.getItem('csmName') || 'Your CSM',
  readOnly: false,
  accounts: [],
  activeAccountOwnerId: ''
};

const el = {
  appMenuBtn: document.querySelector('#appMenuBtn'),
  appMenu: document.querySelector('#appMenu'),
  importBtn: document.querySelector('#importBtn'),
  undoImportBtn: document.querySelector('#undoImportBtn'),
  editModeBtn: document.querySelector('#editModeBtn'),
  hiddenTasksBtn: document.querySelector('#hiddenTasksBtn'),
  dataFolderBtn: document.querySelector('#dataFolderBtn'),
  shareAccessBtn: document.querySelector('#shareAccessBtn'),
  checkUpdatesBtn: document.querySelector('#checkUpdatesBtn'),
  calendarViewBtn: document.querySelector('#calendarViewBtn'),
  menuBuilderBtn: document.querySelector('#menuBuilderBtn'),
  syncStatus: document.querySelector('#syncStatus'),
  brandUser: document.querySelector('#brandUser'),
  accountScopeSelect: document.querySelector('#accountScopeSelect'),
  authGate: document.querySelector('#authGate'),
  authMessage: document.querySelector('#authMessage'),
  authEmail: document.querySelector('#authEmail'),
  authPassword: document.querySelector('#authPassword'),
  signInBtn: document.querySelector('#signInBtn'),
  signUpBtn: document.querySelector('#signUpBtn'),
  signOutBtn: document.querySelector('#signOutBtn'),
  authSignOutBtn: document.querySelector('#authSignOutBtn'),
  manageUsersBtn: document.querySelector('#manageUsersBtn'),
  usersDialog: document.querySelector('#usersDialog'),
  usersList: document.querySelector('#usersList'),
  openShareAccessBtn: document.querySelector('#openShareAccessBtn'),
  shareDialog: document.querySelector('#shareDialog'),
  shareEmailInput: document.querySelector('#shareEmailInput'),
  addShareBtn: document.querySelector('#addShareBtn'),
  sharesList: document.querySelector('#sharesList'),
  syncNowBtn: document.querySelector('#syncNowBtn'),
  viewTabs: document.querySelector('#viewTabs'),
  favoriteViewBtn: document.querySelector('#favoriteViewBtn'),
  cardDensity: document.querySelector('#cardDensity'),
  cardFieldOptions: document.querySelector('#cardFieldOptions'),
  cardSort: document.querySelector('#cardSort'),
  archiveToggleBtn: document.querySelector('#archiveToggleBtn'),
  newMerchantBtn: document.querySelector('#newMerchantBtn'),
  searchInput: document.querySelector('#searchInput'),
  calendarPanel: document.querySelector('#calendarPanel'),
  calendarTitle: document.querySelector('#calendarTitle'),
  calendarPrevBtn: document.querySelector('#calendarPrevBtn'),
  calendarTodayBtn: document.querySelector('#calendarTodayBtn'),
  calendarNextBtn: document.querySelector('#calendarNextBtn'),
  calendarMode: document.querySelector('#calendarMode'),
  calendarList: document.querySelector('#calendarList'),
  closeCalendarBtn: document.querySelector('#closeCalendarBtn'),
  summaryBar: document.querySelector('#summaryBar'),
  bulkBar: document.querySelector('#bulkBar'),
  bulkCount: document.querySelector('#bulkCount'),
  bulkStageSelect: document.querySelector('#bulkStageSelect'),
  bulkStageBtn: document.querySelector('#bulkStageBtn'),
  bulkTaskSelect: document.querySelector('#bulkTaskSelect'),
  bulkTaskBtn: document.querySelector('#bulkTaskBtn'),
  bulkTypeSelect: document.querySelector('#bulkTypeSelect'),
  bulkTypeBtn: document.querySelector('#bulkTypeBtn'),
  bulkDeleteBtn: document.querySelector('#bulkDeleteBtn'),
  bulkClearBtn: document.querySelector('#bulkClearBtn'),
  stageKanbanView: document.querySelector('#stageKanbanView'),
  taskKanbanView: document.querySelector('#taskKanbanView'),
  programmingKanbanView: document.querySelector('#programmingKanbanView'),
  listView: document.querySelector('#listView'),
  workspaceResizer: document.querySelector('#workspaceResizer'),
  detailsPanel: document.querySelector('#detailsPanel'),
  accountStatusBadge: document.querySelector('#accountStatusBadge'),
  controlInfoSummary: document.querySelector('#controlInfoSummary'),
  merchantInfoSummary: document.querySelector('#merchantInfoSummary'),
  salesInfoSummary: document.querySelector('#salesInfoSummary'),
  merchantForm: document.querySelector('#merchantForm'),
  formTitle: document.querySelector('#formTitle'),
  importContactsBtn: document.querySelector('#importContactsBtn'),
  addContactBtn: document.querySelector('#addContactBtn'),
  contactsList: document.querySelector('#contactsList'),
  closePanelBtn: document.querySelector('#closePanelBtn'),
  merchantMenuBtn: document.querySelector('#merchantMenuBtn'),
  merchantMenu: document.querySelector('#merchantMenu'),
  mergeMerchantBtn: document.querySelector('#mergeMerchantBtn'),
  deleteMerchantMenuBtn: document.querySelector('#deleteMerchantMenuBtn'),
  mergeDialog: document.querySelector('#mergeDialog'),
  mergeTargetSelect: document.querySelector('#mergeTargetSelect'),
  confirmMergeBtn: document.querySelector('#confirmMergeBtn'),
  savePanelTopBtn: document.querySelector('#savePanelTopBtn'),
  saveMerchantBtn: document.querySelector('#saveMerchantBtn'),
  templateSelect: document.querySelector('#templateSelect'),
  customNote: document.querySelector('#customNote'),
  customNoteWrap: document.querySelector('#customNoteWrap'),
  subjectOutput: document.querySelector('#subjectOutput'),
  copySubjectBtn: document.querySelector('#copySubjectBtn'),
  emailOutput: document.querySelector('#emailOutput'),
  copyEmailBtn: document.querySelector('#copyEmailBtn'),
  decisionsClientBtn: document.querySelector('#decisionsClientBtn'),
  toast: document.querySelector('#toast')
};

const fields = ['merchantId', 'dbaName', 'mid', 'accountStatus', 'merchantName', 'merchantEmail', 'salesRepName', 'salesRepEmail', 'taskName', 'stage', 'orderStartDate', 'menuPresentationDate', 'menuPresentationTime', 'installationDate', 'installationTime', 'goLiveDate', 'orderLifeCycle', 'programmingType', 'lastNote']
  .reduce((acc, id) => ({ ...acc, [id]: document.querySelector(`#${id}`) }), {});

const orderEl = [
  'clientInfoTab', 'orderInfoTab', 'accountNotesTab', 'emailTemplatesTab', 'contactsTab', 'equipmentTab',
  'clientInfoTabBtn', 'orderInfoTabBtn', 'accountNotesTabBtn', 'emailTemplatesTabBtn', 'contactsTabBtn', 'equipmentTabBtn', 'orderInfoForm',
  'giftCardConversion', 'taxList', 'surchargesList', 'addSurchargeBtn', 'discountsList', 'addDiscountBtn',
  'happyHourEnabled', 'happyHourList', 'addHappyHourBtn', 'gratuitiesList', 'addGratuityBtn',
  'tipOutMethod', 'businessAddress', 'shippingDifferent', 'shippingAddressWrap', 'shippingAddress',
  'equipmentList', 'mainContact', 'menuQuestionsContact', 'printerKdsNames', 'floorPlan',
  'additionalMenus', 'menuNotes', 'employeeStatus', 'employeesList', 'addEmployeeBtn',
  'oloEnabled', 'oloScheduleList', 'customerDatabase', 'thirdPartyList', 'saveOrderInfoBtn',
  'orderSubjectOutput', 'copyOrderSubjectBtn', 'orderEmailOutput', 'copyOrderEmailBtn',
  'decisionsOrderBtn', 'orderProgrammingNotesOutput', 'copyOrderProgrammingNotesBtn',
  'accountNoteInput', 'addAccountNoteBtn', 'accountNotesList', 'equipmentSummaryList'
].reduce((acc, id) => ({ ...acc, [id]: document.querySelector(`#${id}`) }), {});

const darkModeToggle = document.querySelector('#darkModeToggle');

function applyTheme() {
  const isDark = localStorage.getItem('theme') === 'dark';
  document.body.classList.toggle('dark-mode', isDark);
  if (!darkModeToggle) return;
  darkModeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  darkModeToggle.setAttribute('aria-pressed', String(isDark));
}

function applyWorkspaceSplit() {
  const savedSplit = Number(localStorage.getItem('workspaceSplit'));
  if (Number.isFinite(savedSplit) && savedSplit > 0) {
    document.documentElement.style.setProperty('--workspace-split', `${savedSplit}px`);
  }
}

applyTheme();

function loadDefaultView() {
  const view = localStorage.getItem('defaultView');
  return VIEWS.some((item) => item.id === view) ? view : 'stage-kanban';
}

function loadViewOrder() {
  try {
    const stored = JSON.parse(localStorage.getItem('viewOrder') || '[]');
    return [...stored.filter((viewId) => VIEWS.some((view) => view.id === viewId)), ...VIEWS.map((view) => view.id).filter((viewId) => !stored.includes(viewId))];
  } catch {
    return VIEWS.map((view) => view.id);
  }
}

function saveViewSettings() {
  localStorage.setItem('viewOrder', JSON.stringify(state.viewOrder));
}

function currentDefaultView() {
  return localStorage.getItem('defaultView') || 'stage-kanban';
}

function viewById(viewId) {
  return VIEWS.find((view) => view.id === viewId) || VIEWS[0];
}

function loadTaskOrder() {
  try {
    if (localStorage.getItem('taskOrderVersion') !== TASK_ORDER_STORAGE_VERSION) {
      localStorage.setItem('taskOrderVersion', TASK_ORDER_STORAGE_VERSION);
      localStorage.setItem('taskOrder', JSON.stringify(TASKS));
      return [...TASKS];
    }
    const stored = JSON.parse(localStorage.getItem('taskOrder') || '[]');
    return [...stored.filter((taskName) => TASKS.includes(taskName)), ...TASKS.filter((taskName) => !stored.includes(taskName))];
  } catch {
    return [...TASKS];
  }
}

function loadStageOrder() {
  try {
    const stored = JSON.parse(localStorage.getItem('stageOrder') || '[]');
    return [...stored.filter((stage) => STAGES.includes(stage)), ...STAGES.filter((stage) => !stored.includes(stage))];
  } catch {
    return [...STAGES];
  }
}

function loadTypeOrder() {
  try {
    const stored = JSON.parse(localStorage.getItem('typeOrder') || '[]');
    return [...stored.filter((type) => PROGRAMMING_TYPES.includes(type)), ...PROGRAMMING_TYPES.filter((type) => !stored.includes(type))];
  } catch {
    return [...PROGRAMMING_TYPES];
  }
}

function loadHiddenTasks() {
  try {
    if (localStorage.getItem('hiddenTasksVersion') !== HIDDEN_TASKS_STORAGE_VERSION) {
      localStorage.setItem('hiddenTasksVersion', HIDDEN_TASKS_STORAGE_VERSION);
      localStorage.setItem('hiddenTasks', JSON.stringify(DEFAULT_HIDDEN_TASKS));
      return [...DEFAULT_HIDDEN_TASKS];
    }
    return JSON.parse(localStorage.getItem('hiddenTasks') || '[]').filter((taskName) => TASKS.includes(taskName));
  } catch {
    return [...DEFAULT_HIDDEN_TASKS];
  }
}

function loadTaskSorts() {
  try {
    return JSON.parse(localStorage.getItem('taskSorts') || '{}');
  } catch {
    return {};
  }
}

function saveTaskBoardSettings() {
  localStorage.setItem('taskOrder', JSON.stringify(state.taskOrder));
  localStorage.setItem('taskOrderVersion', TASK_ORDER_STORAGE_VERSION);
  localStorage.setItem('hiddenTasks', JSON.stringify(state.hiddenTasks));
  localStorage.setItem('hiddenTasksVersion', HIDDEN_TASKS_STORAGE_VERSION);
  localStorage.setItem('taskSorts', JSON.stringify(state.taskSorts));
  localStorage.setItem('stageOrder', JSON.stringify(state.stageOrder));
  localStorage.setItem('typeOrder', JSON.stringify(state.typeOrder));
}

function loadCardDensity() {
  if (localStorage.getItem('cardSettingsVersion') !== CARD_SETTINGS_VERSION) return 'standard';
  return localStorage.getItem('cardDensity') === 'compact' ? 'compact' : 'standard';
}

function loadCardFields() {
  if (localStorage.getItem('cardSettingsVersion') !== CARD_SETTINGS_VERSION) return [...DEFAULT_CARD_FIELDS];
  try {
    const stored = JSON.parse(localStorage.getItem('cardFields') || '[]');
    const valid = stored.filter((field) => CARD_FIELD_OPTIONS.some((option) => option.id === field));
    return valid.length ? valid : [...DEFAULT_CARD_FIELDS];
  } catch {
    return [...DEFAULT_CARD_FIELDS];
  }
}

function saveCardSettings() {
  localStorage.setItem('cardSettingsVersion', CARD_SETTINGS_VERSION);
  localStorage.setItem('cardDensity', state.cardDensity);
  localStorage.setItem('cardFields', JSON.stringify(state.cardFields));
  localStorage.setItem('cardSort', state.cardSort);
}

function renderDisplayTools() {
  document.body.classList.toggle('compact-view', state.cardDensity === 'compact');
  el.undoImportBtn.disabled = state.readOnly || !localStorage.getItem('lastImportUndo');
  el.hiddenTasksBtn.disabled = state.view !== 'task-kanban' || !state.hiddenTasks.length;
  el.hiddenTasksBtn.textContent = state.showHiddenTasks ? 'Hide Hidden Tasks' : 'Show Hidden Tasks';
  el.cardDensity.value = state.cardDensity;
  el.cardSort.value = state.cardSort;
  el.archiveToggleBtn.textContent = state.showCompleted ? 'Hide Completed' : 'Show Completed';
  el.archiveToggleBtn.classList.toggle('active-toggle', state.showCompleted);
  el.editModeBtn.textContent = state.editMode ? 'Done Editing' : 'Edit';
  el.cardFieldOptions.innerHTML = CARD_FIELD_OPTIONS.map((field) => `
    <label><input type="checkbox" value="${escapeHtml(field.id)}" ${state.cardFields.includes(field.id) ? 'checked' : ''} />${escapeHtml(field.label)}</label>
  `).join('');
  syncReadOnlyControls();
}

function orderedViews() {
  return state.viewOrder.map(viewById);
}

function renderViewTabs() {
  const defaultView = currentDefaultView();
  el.viewTabs.innerHTML = orderedViews().map((view) => `
    <button
      class="${view.id === state.view ? 'active' : ''}"
      draggable="${canWrite()}"
      data-view-id="${view.id}"
      type="button"
      title="Drag to reorder views"
    >${view.id === defaultView ? '* ' : ''}${escapeHtml(view.label)}</button>
  `).join('');
  const currentView = viewById(state.view);
  el.favoriteViewBtn.textContent = state.view === defaultView ? `Default: ${currentView.label}` : `Set ${currentView.label} Default`;
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function showToast(message) {
  el.toast.textContent = message;
  el.toast.classList.remove('hidden');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => el.toast.classList.add('hidden'), 3200);
}

function canWrite() {
  return !state.readOnly;
}

function blockReadOnly() {
  if (canWrite()) return false;
  showToast('Read-only access: edits are disabled for this account.');
  return true;
}

function setControlsDisabled(container, selector, disabled) {
  container?.querySelectorAll(selector).forEach((control) => {
    control.disabled = disabled;
  });
}

function syncReadOnlyControls() {
  document.body.classList.toggle('read-only-mode', state.readOnly);
  [
    el.newMerchantBtn,
    el.importBtn,
    el.undoImportBtn,
    el.editModeBtn,
    el.shareAccessBtn,
    el.importContactsBtn,
    el.addContactBtn,
    el.savePanelTopBtn,
    el.saveMerchantBtn,
    el.mergeMerchantBtn,
    el.deleteMerchantMenuBtn,
    el.bulkStageBtn,
    el.bulkTaskBtn,
    el.bulkTypeBtn,
    el.bulkDeleteBtn,
    orderEl.addSurchargeBtn,
    orderEl.addDiscountBtn,
    orderEl.addHappyHourBtn,
    orderEl.addGratuityBtn,
    orderEl.addEmployeeBtn,
    orderEl.saveOrderInfoBtn,
    orderEl.accountNoteInput,
    orderEl.addAccountNoteBtn
  ].forEach((control) => {
    if (control) control.disabled = state.readOnly;
  });
  setControlsDisabled(el.merchantForm, 'input:not([readonly]), textarea:not([readonly]), select', state.readOnly);
  setControlsDisabled(orderEl.orderInfoForm, 'input:not([readonly]), textarea:not([readonly]), select', state.readOnly);
  setControlsDisabled(el.contactsList, 'input:not([readonly]), textarea:not([readonly]), select, button:not(.copy-contact-value)', state.readOnly);
  setControlsDisabled(orderEl.accountNotesList, '[data-delete-note]', state.readOnly);
  el.importBtn.classList.toggle('hidden', state.readOnly);
  el.undoImportBtn.classList.toggle('hidden', state.readOnly);
  el.editModeBtn.classList.toggle('hidden', state.readOnly);
  el.newMerchantBtn.classList.toggle('hidden', state.readOnly);
  el.importContactsBtn.classList.toggle('hidden', state.readOnly);
  el.addContactBtn.classList.toggle('hidden', state.readOnly);
  el.savePanelTopBtn.classList.toggle('hidden', state.readOnly);
  el.saveMerchantBtn.classList.toggle('hidden', state.readOnly);
  el.mergeMerchantBtn.classList.toggle('hidden', state.readOnly);
  el.deleteMerchantMenuBtn.classList.toggle('hidden', state.readOnly);
  orderEl.addAccountNoteBtn.classList.toggle('hidden', state.readOnly);
  orderEl.accountNoteInput.closest('.notes-entry')?.classList.toggle('hidden', state.readOnly);
  orderEl.saveOrderInfoBtn.classList.toggle('hidden', state.readOnly);
  el.shareAccessBtn.classList.toggle('hidden', state.readOnly);
}

function renderAccountSwitcher() {
  const accounts = state.accounts || [];
  el.accountScopeSelect.classList.toggle('hidden', accounts.length <= 1);
  el.accountScopeSelect.innerHTML = accounts.map((account) => `
    <option value="${escapeHtml(account.ownerUserId)}" ${account.ownerUserId === state.activeAccountOwnerId ? 'selected' : ''}>
      ${escapeHtml(account.label || account.ownerEmail || 'LaunchPad Account')}${account.canWrite ? '' : ' (read-only)'}
    </option>
  `).join('');
}

function allStages() {
  return [...state.stageOrder.filter((stage) => STAGES.includes(stage)), ...STAGES.filter((stage) => !state.stageOrder.includes(stage))];
}

function allTasks() {
  return [...state.taskOrder.filter((taskName) => TASKS.includes(taskName)), ...TASKS.filter((taskName) => !state.taskOrder.includes(taskName))];
}

function allTypes() {
  return [...state.typeOrder.filter((type) => PROGRAMMING_TYPES.includes(type)), ...PROGRAMMING_TYPES.filter((type) => !state.typeOrder.includes(type))];
}

function visibleTasks() {
  return allTasks().filter((taskName) => state.showHiddenTasks || !state.hiddenTasks.includes(taskName));
}

function visibleStages() {
  return allStages().filter((stage) => state.showCompleted || stage !== 'Completed');
}

function visibleMerchants() {
  if (state.view === 'task-kanban') return filteredMerchants();
  return filteredMerchants().filter((merchant) => state.showCompleted || normalizeTask(merchant.taskName) !== 'Completed');
}

function normalizeStage(stage) {
  const cleaned = cleanKey(stage);
  const matched = STAGES.find((candidate) => cleanKey(candidate) === cleaned);
  return matched || 'Active';
}

function normalizeTask(taskName) {
  const cleaned = cleanKey(taskName);
  if (cleaned === 'menupresentation') return 'Presentation';
  const matched = TASKS.find((candidate) => cleanKey(candidate) === cleaned);
  return matched || 'CSM Approval';
}

function stageForTask(taskName, currentStage = 'Active') {
  const task = normalizeTask(taskName);
  if (task === 'Stalled') return 'Non-Responsive';
  if (task === 'Cancelled') return 'Cancelled';
  if (task === 'Completed') return 'Completed';
  const stage = normalizeStage(currentStage);
  return ['Cancelled', 'Completed'].includes(stage) ? 'Active' : stage;
}

function displayedAccountStatus(accountStatus, taskName) {
  const task = normalizeTask(taskName);
  if (task === 'Cancelled') return 'Cancelled';
  if (task === 'Moved Off') return 'Moved Off';
  const savedStatus = String(accountStatus || '').trim();
  if (savedStatus) return savedStatus;
  return TASKS.indexOf(task) >= TASKS.indexOf('Programming') ? '600' : '';
}

function automaticAccountStatus(accountStatus, taskName) {
  const savedStatus = String(accountStatus || '').trim();
  if (savedStatus) return savedStatus;
  return TASKS.indexOf(normalizeTask(taskName)) >= TASKS.indexOf('Programming') ? '600' : '';
}

function accountStatusClass(accountStatus) {
  const status = cleanKey(accountStatus);
  if (status === '600') return 'status-600';
  if (status === '425') return 'status-425';
  if (['cancelled', 'moved off'].includes(status)) return 'status-terminal';
  return 'status-other';
}

function normalizeProgrammingType(programmingType) {
  const cleaned = cleanKey(programmingType);
  const matched = PROGRAMMING_TYPES.find((candidate) => cleanKey(candidate) === cleaned);
  return matched || '';
}

function filteredMerchants() {
  const query = state.search.trim().toLowerCase();
  if (!query) return state.merchants;
  return state.merchants.filter((merchant) => [
    merchant.dbaName,
    merchant.mid,
    merchant.taskName,
    merchant.stage,
    merchant.lastNote,
    merchant.programmingType,
    merchant.merchantName,
    merchant.merchantEmail,
    merchant.salesRepName,
    merchant.salesRepEmail,
    ...(merchant.contacts || []).flatMap((contact) => [contact.name, contact.email, contact.phone, ...(contact.emails || []), ...(contact.phones || [])]),
    merchant.installationDate
  ].some((value) => String(value || '').toLowerCase().includes(query)));
}

function sortMerchants(merchants, sortMode = state.cardSort) {
  const sorted = [...merchants];
  const byName = (merchant) => cleanKey(merchant.dbaName || merchant.merchantName);
  const byInstall = (merchant) => normalizeDateInput(merchant.installationDate) || '9999-12-31';
  const byLifeCycle = (merchant) => Number.parseInt(calculateOrderLifeCycle(merchant.orderStartDate, merchant.installationDate), 10) || 0;
  if (sortMode === 'alpha-asc') return sorted.sort((a, b) => byName(a).localeCompare(byName(b)));
  if (sortMode === 'alpha-desc') return sorted.sort((a, b) => byName(b).localeCompare(byName(a)));
  if (sortMode === 'install-asc') return sorted.sort((a, b) => byInstall(a).localeCompare(byInstall(b)));
  if (sortMode === 'install-desc') return sorted.sort((a, b) => byInstall(b).localeCompare(byInstall(a)));
  if (sortMode === 'life-asc') return sorted.sort((a, b) => byLifeCycle(a) - byLifeCycle(b));
  if (sortMode === 'life-desc') return sorted.sort((a, b) => byLifeCycle(b) - byLifeCycle(a));
  return sorted;
}

function pruneSelectedMerchants() {
  const ids = new Set(state.merchants.map((merchant) => merchant.id));
  state.selectedIds.forEach((merchantId) => {
    if (!ids.has(merchantId)) state.selectedIds.delete(merchantId);
  });
}

function selectedMerchant() {
  return state.merchants.find((merchant) => merchant.id === state.selectedId) || null;
}

function cleanKey(value) {
  return String(value || '').trim().toLowerCase();
}

function firstName(value) {
  return String(value || '').trim().split(/\s+/)[0] || '';
}

function trimClipboardText(value) {
  return String(value || '').replace(/^[\s\u00a0]+/, '').replace(/[\s\u00a0]+$/, '');
}

function normalizeClipboardHtml(value) {
  return String(value || '')
    .replace(/^(?:\s|<br\s*\/?>|&nbsp;|\u00a0)+/i, '')
    .replace(/(?:\s|<br\s*\/?>|&nbsp;|\u00a0)+$/i, '');
}

function emailClipboardHtml(value) {
  const html = normalizeClipboardHtml(value);
  return html ? `<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.35;">${html}</div>` : '';
}

function markButtonSaved(button, savedText = '✓ Saved') {
  if (!button) return;
  if (!button.dataset.defaultText) button.dataset.defaultText = button.textContent;
  button.textContent = savedText;
  button.classList.add('success-state');
}

function markButtonDirty(button) {
  if (!button?.dataset.defaultText) return;
  button.textContent = button.dataset.defaultText;
  button.classList.remove('success-state');
}

function markButtonCopied(button, copiedText = '✓ Copied') {
  if (!button) return;
  if (!button.dataset.defaultText) button.dataset.defaultText = button.textContent;
  button.textContent = copiedText;
  button.classList.add('success-state');
}

function resetCopyButtons() {
  [el.copySubjectBtn, el.copyEmailBtn, orderEl.copyOrderSubjectBtn, orderEl.copyOrderEmailBtn, orderEl.copyOrderProgrammingNotesBtn].forEach(markButtonDirty);
  el.merchantForm.querySelectorAll('.copy-field-value').forEach(markButtonDirty);
  el.contactsList.querySelectorAll('.copy-contact-value').forEach(markButtonDirty);
}

function markSaveButtonsDirty() {
  markButtonDirty(el.saveMerchantBtn);
  markButtonDirty(orderEl.saveOrderInfoBtn);
  markButtonDirty(el.savePanelTopBtn);
}

function merchantKey(merchant) {
  const mid = cleanKey(merchant.mid);
  const dbaName = cleanKey(merchant.dbaName);
  if (mid && dbaName) return `merchant:${dbaName}|${mid}`;
  if (mid) return `mid:${mid}`;
  if (dbaName) return `name:${dbaName}`;
  return `id:${merchant.id}`;
}

function mergeMerchant(existing, incoming) {
  return {
    ...existing,
    ...incoming,
    id: existing.id || incoming.id,
    recordSource: existing.recordSource || incoming.recordSource || 'import',
    createdAt: existing.createdAt || incoming.createdAt,
    dbaName: incoming.dbaName || existing.dbaName,
    merchantName: incoming.merchantName || existing.merchantName,
    merchantEmail: incoming.merchantEmail || existing.merchantEmail,
    salesRepName: incoming.salesRepName || existing.salesRepName,
    salesRepEmail: incoming.salesRepEmail || existing.salesRepEmail,
    accountStatus: incoming.accountStatus || existing.accountStatus,
    contacts: mergeContacts(existing.contacts, incoming.contacts),
    accountNotes: mergeAccountNotes(existing.accountNotes, incoming.accountNotes),
    orderInfo: incoming.orderInfo || existing.orderInfo,
    lastNote: incoming.lastNote || existing.lastNote,
    menuPresentationDate: incoming.menuPresentationDate || existing.menuPresentationDate,
    installationDate: incoming.installationDate || existing.installationDate,
    goLiveDate: incoming.goLiveDate || existing.goLiveDate,
    updatedAt: new Date().toISOString()
  };
}

function compactMerchants(merchants) {
  const byKey = new Map();
  merchants
    .filter((merchant) => merchant.dbaName || merchant.mid || merchant.merchantName)
    .forEach((merchant) => {
      const key = merchantKey(merchant);
      const existing = byKey.get(key);
      byKey.set(key, existing ? mergeMerchant(existing, merchant) : merchant);
    });
  return [...byKey.values()];
}

function mergeImportedMerchants(existingMerchants, importedMerchants) {
  const byKey = new Map();
  existingMerchants
    .filter((merchant) => merchant.dbaName || merchant.mid || merchant.merchantName)
    .forEach((merchant) => byKey.set(merchantKey(merchant), merchant));

  importedMerchants
    .filter((merchant) => merchant.dbaName || merchant.mid || merchant.merchantName)
    .forEach((merchant) => {
      const key = merchantKey(merchant);
      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, merchant);
        return;
      }
      const existingTask = normalizeTask(existing.taskName);
      const protectedTask = ['Stalled', 'Cancelled', 'Completed'].includes(existingTask);
      const merged = mergeMerchant(existing, merchant);
      byKey.set(key, protectedTask ? {
        ...merged,
        taskName: existing.taskName,
        stage: existing.stage,
        accountStatus: existing.accountStatus
      } : merged);
    });

  return [...byKey.values()];
}

function renderStageOptions() {
  const current = fields.stage.value;
  fields.stage.innerHTML = allStages().map((stage) => `<option>${escapeHtml(stage)}</option>`).join('');
  fields.stage.value = normalizeStage(current);
}

function renderTaskOptions() {
  const current = fields.taskName.value;
  fields.taskName.innerHTML = allTasks().map((taskName) => `<option>${escapeHtml(taskName)}</option>`).join('');
  fields.taskName.value = normalizeTask(current);
}

function programmingTypeLabel(programmingType) {
  return normalizeProgrammingType(programmingType) || 'Blank';
}

function renderProgrammingTypeOptions() {
  const current = fields.programmingType.value;
  fields.programmingType.innerHTML = PROGRAMMING_TYPES
    .map((programmingType) => `<option value="${escapeHtml(programmingType)}">${escapeHtml(programmingType || 'Blank')}</option>`)
    .join('');
  fields.programmingType.value = normalizeProgrammingType(current);
}

function renderTemplates() {
  el.templateSelect.innerHTML = TEMPLATES.map((template, index) => `<option value="${index}">${escapeHtml(template.name)}</option>`).join('');
}

function templateIndexByName(name) {
  const index = TEMPLATES.findIndex((template) => template.name === name);
  return index >= 0 ? index : 0;
}

function setDefaultTemplateForCurrentMerchant() {
  el.templateSelect.value = normalizeProgrammingType(fields.programmingType.value) === ''
    ? String(templateIndexByName('Blank Order Confirmation'))
    : String(templateIndexByName('Welcome Email'));
}

function renderSubject(templateText) {
  const values = tokenValues();
  const replacements = {
    'DBA Name': values.dbaName,
    DBA: values.dbaName,
    MID: values.mid,
    '(MID)': values.mid ? `(${values.mid})` : '',
    'Merchant Name': values.merchantName,
    "Merchant's Name": values.merchantName
  };
  return String(templateText || '').replace(/\{([^{}]+)\}/g, (_match, key) => replacements[key] || '');
}

function emptyContact() {
  return { id: `contact-${Date.now()}-${Math.random().toString(16).slice(2)}`, type: '', name: '', email: '', phone: '', emails: [], phones: [] };
}

function normalizeTextList(values) {
  return [...new Set((values || []).map((value) => String(value || '').trim()).filter(Boolean))];
}

function primaryPlusList(primary, list) {
  return normalizeTextList([primary, ...normalizeTextList(list)]);
}

function normalizeContact(contact) {
  const emails = primaryPlusList(contact.email, contact.emails);
  const phones = primaryPlusList(contact.phone, contact.phones);
  return {
    id: contact.id || emptyContact().id,
    type: normalizeContactType(contact.type),
    name: String(contact.name || '').trim(),
    email: emails[0] || '',
    phone: phones[0] || '',
    emails,
    phones,
    showAll: Boolean(contact.showAll)
  };
}

function validContacts(contacts) {
  return sortContacts((contacts || []).map(normalizeContact).filter((contact) => contact.name || contact.emails.length || contact.phones.length));
}

function normalizeAccountNote(note) {
  return {
    id: note.id || `note-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: note.date || note.createdAt || new Date().toISOString(),
    user: String(note.user || state.csmName || 'User').trim(),
    comments: String(note.comments || note.comment || '').trim()
  };
}

function validAccountNotes(notes) {
  return (notes || [])
    .map(normalizeAccountNote)
    .filter((note) => note.comments)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function normalizeContactType(value) {
  const cleaned = cleanKey(value);
  if (cleaned.includes('owner')) return 'Owner';
  if (cleaned.includes('rep')) return 'Rep';
  if (cleaned.includes('contact')) return 'Contact';
  return String(value || '').trim();
}

function contactRank(contact) {
  const type = cleanKey(contact.type);
  if (type === 'owner') return 0;
  if (type === 'rep') return 1;
  return 2;
}

function sortContacts(contacts) {
  return [...contacts].sort((a, b) => (
    contactRank(a) - contactRank(b)
    || String(a.name || '').localeCompare(String(b.name || ''))
    || String(a.email || '').localeCompare(String(b.email || ''))
  ));
}

function contactsFromLegacyFields(merchant = {}) {
  const contacts = [];
  if (merchant.merchantName || merchant.merchantEmail) {
    contacts.push({
      type: 'Owner',
      name: merchant.merchantName || '',
      email: merchant.merchantEmail || '',
      emails: merchant.merchantEmail ? [merchant.merchantEmail] : []
    });
  }
  if (merchant.salesRepName || merchant.salesRepEmail) {
    contacts.push({
      type: 'Rep',
      name: merchant.salesRepName || '',
      email: merchant.salesRepEmail || '',
      emails: merchant.salesRepEmail ? [merchant.salesRepEmail] : []
    });
  }
  return validContacts(contacts);
}

function contactsForMerchant(merchant = {}) {
  return mergeContacts(contactsFromLegacyFields(merchant), merchant.contacts || []);
}

function contactByType(contacts, type) {
  const cleanedType = cleanKey(type);
  return validContacts(contacts).find((contact) => cleanKey(contact.type) === cleanedType) || null;
}

function renderContacts(contacts = []) {
  const normalized = validContacts(contacts);
  el.contactsList.innerHTML = normalized.length
    ? normalized.map((contact, index) => {
      const phones = contact.phones.length ? contact.phones : contact.showAll ? [''] : [];
      const emails = contact.emails.length ? contact.emails : contact.showAll ? [''] : [];
      const primaryPhone = phones[0];
      return `
        <div class="contact-card" data-contact-index="${index}">
          <div class="contact-primary-row">
            <label class="contact-type-field">Type<input data-contact-field="type" value="${escapeHtml(contact.type || '')}" /></label>
            <label class="contact-name-field">Name<input data-contact-field="name" value="${escapeHtml(contact.name || '')}" /></label>
            ${primaryPhone !== undefined ? `<label class="contact-phone-field">Phone<span class="contact-input-copy"><input data-contact-phone value="${escapeHtml(primaryPhone)}" /><button class="secondary copy-contact-value" type="button" data-copy-value="${escapeHtml(primaryPhone)}">Copy</button></span></label>` : ''}
            <span class="contact-actions">
              <button class="secondary compact-action add-contact-phone" type="button" data-add-contact-phone="${index}" title="Add phone">+ Phone</button>
              <button class="secondary compact-action add-contact-email" type="button" data-add-contact-email="${index}" title="Add email">+ Email</button>
              <button class="secondary remove-contact" type="button" data-remove-contact="${index}" title="Remove contact">Remove</button>
            </span>
          </div>
          <div class="contact-methods extra-contact-phones" data-contact-phones>
            ${phones.slice(1).map((phone) => `<div class="contact-method-row"><label>Phone<input data-contact-phone value="${escapeHtml(phone)}" /></label><button class="secondary copy-contact-value" type="button" data-copy-value="${escapeHtml(phone)}">Copy</button></div>`).join('')}
          </div>
          <div class="contact-methods contact-email-rows" data-contact-emails>
            ${emails.map((email) => `<div class="contact-method-row"><label>Email<input data-contact-email type="email" value="${escapeHtml(email)}" /></label><button class="secondary copy-contact-value" type="button" data-copy-value="${escapeHtml(email)}">Copy</button></div>`).join('') || '<div class="empty mini-empty">No email addresses.</div>'}
          </div>
        </div>
      `;
    }).join('')
    : '<div class="empty contact-empty">No contacts imported yet.</div>';
  syncReadOnlyControls();
}

function renderAccountNotes(notes = []) {
  const normalized = validAccountNotes(notes);
  orderEl.accountNotesList.innerHTML = normalized.length
    ? normalized.map((note) => `
      <tr data-note-id="${escapeHtml(note.id)}">
        <td>${escapeHtml(formatDisplayDateTime(note.date) || note.date)}</td>
        <td>${escapeHtml(note.user)}</td>
        <td>${escapeHtml(note.comments)}</td>
        <td><button class="secondary table-delete" type="button" data-delete-note="${escapeHtml(note.id)}">Delete</button></td>
      </tr>
    `).join('')
    : '<tr><td colspan="4" class="empty">No account notes yet.</td></tr>';
  syncReadOnlyControls();
}

function readContacts() {
  return [...el.contactsList.querySelectorAll('.contact-card')].map((card) => {
    const contact = {};
    card.querySelectorAll('[data-contact-field]').forEach((input) => {
      contact[input.dataset.contactField] = input.value.trim();
    });
    contact.phones = [...card.querySelectorAll('[data-contact-phone]')].map((input) => input.value.trim()).filter(Boolean);
    contact.emails = [...card.querySelectorAll('[data-contact-email]')].map((input) => input.value.trim()).filter(Boolean);
    return normalizeContact(contact);
  }).filter((contact) => contact.name || contact.emails.length || contact.phones.length);
}

function mergeContacts(existingContacts, incomingContacts) {
  const merged = [...validContacts(existingContacts)];
  validContacts(incomingContacts).forEach((incoming) => {
    const incomingEmails = incoming.emails.map((email) => email.toLowerCase());
    const index = merged.findIndex((contact) => {
      const sameNameAndType = cleanKey(contact.name) && cleanKey(contact.name) === cleanKey(incoming.name) && cleanKey(contact.type) === cleanKey(incoming.type);
      const sharedEmail = contact.emails.some((email) => incomingEmails.includes(email.toLowerCase()));
      const sharedPhone = contact.phones.some((phone) => incoming.phones.includes(phone));
      return sameNameAndType || sharedEmail || sharedPhone;
    });
    if (index >= 0) {
      merged[index] = normalizeContact({
        ...merged[index],
        type: merged[index].type || incoming.type,
        name: merged[index].name || incoming.name,
        emails: normalizeTextList([...merged[index].emails, ...incoming.emails]),
        phones: normalizeTextList([...merged[index].phones, ...incoming.phones])
      });
    } else {
      merged.push(incoming);
    }
  });
  return sortContacts(merged);
}

function mergeAccountNotes(existingNotes, incomingNotes) {
  const byKey = new Map();
  [...validAccountNotes(existingNotes), ...validAccountNotes(incomingNotes)].forEach((note) => {
    const key = note.id || [note.date, note.user, note.comments].join('|');
    byKey.set(key, note);
  });
  return validAccountNotes([...byKey.values()]);
}

function applyImportedContacts(importedContacts) {
  const contacts = validContacts(importedContacts);
  if (!contacts.length) {
    showToast('No contacts were found in that image.');
    return;
  }

  renderContacts(mergeContacts(readContacts(), contacts));
  renderEmail();
  markButtonDirty(el.saveMerchantBtn);
  showToast(`Imported ${contacts.length} contact${contacts.length === 1 ? '' : 's'}.`);
}

function defaultOrderInfo() {
  return {
    giftCardConversion: 'No',
    taxes: [{ name: 'Tax', taxRate: '', taxClasses: [], taxAddedAlcohol: false, taxHiddenAlcohol: false, anotherTax: false }],
    taxRate: '',
    taxClasses: [],
    taxAddedAlcohol: false,
    taxHiddenAlcohol: false,
    surcharges: [{ name: 'Advantage Program', type: 'Dual Pricing', percentage: '' }],
    discounts: [],
    happyHourEnabled: false,
    happyHours: [],
    gratuities: [],
    tipOutMethod: 'End of Day',
    businessAddress: '',
    shippingDifferent: false,
    shippingAddress: '',
    equipment: EQUIPMENT_TYPES.map((name) => ({ name, qty: '' })),
    mainContact: '',
    menuQuestionsContact: '',
    printerKdsNames: '',
    floorPlan: 'None',
    additionalMenus: false,
    menuNotes: '',
    employeeStatus: 'None',
    employees: [],
    oloEnabled: 'No',
    oloSchedule: [],
    customerDatabase: 'No',
    thirdParty: THIRD_PARTIES.map((name) => ({ name, selected: false, amount: '', unit: '%' }))
  };
}

function currentMerchantName() {
  const owner = contactByType(readContacts(), 'Owner') || readContacts()[0] || {};
  return owner.name || fields.merchantName.value.trim();
}

function orderInfoWithDefaults(orderInfo = {}) {
  const defaults = defaultOrderInfo();
  const legacyTax = {
    name: orderInfo.taxName || 'Tax',
    taxRate: orderInfo.taxRate || '',
    taxClasses: orderInfo.taxClasses || [],
    taxAddedAlcohol: Boolean(orderInfo.taxAddedAlcohol),
    taxHiddenAlcohol: Boolean(orderInfo.taxHiddenAlcohol),
    anotherTax: false
  };
  const taxes = (orderInfo.taxes?.length ? orderInfo.taxes : [legacyTax]).map((tax, index, list) => ({
    name: tax.name || (index === 0 ? 'Tax' : `Tax ${index + 1}`),
    taxRate: tax.taxRate || tax.rate || '',
    taxClasses: tax.taxClasses || tax.classes || [],
    taxAddedAlcohol: Boolean(tax.taxAddedAlcohol),
    taxHiddenAlcohol: Boolean(tax.taxHiddenAlcohol),
    anotherTax: index < list.length - 1 || Boolean(tax.anotherTax)
  }));
  return {
    ...defaults,
    ...orderInfo,
    taxes: taxes.length ? taxes : defaults.taxes,
    equipment: EQUIPMENT_TYPES.map((name) => {
      const aliases = name === 'Customer Facing Displays' ? ['Customer Facing Displays', 'Customer Facing Display'] : [name];
      const existing = (orderInfo.equipment || []).find((item) => aliases.includes(item.name));
      return { name, qty: existing?.qty || '' };
    }),
    thirdParty: THIRD_PARTIES.map((name) => ({ ...defaults.thirdParty.find((item) => item.name === name), ...(orderInfo.thirdParty || []).find((item) => item.name === name) })),
    surcharges: orderInfo.surcharges?.length ? orderInfo.surcharges : defaults.surcharges,
    discounts: orderInfo.discounts || [],
    happyHours: orderInfo.happyHours || [],
    gratuities: orderInfo.gratuities || [],
    employees: orderInfo.employees || [],
    oloSchedule: orderInfo.oloSchedule || []
  };
}

function optionList(options, value = '') {
  return options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('');
}

function normalizeTimeChoice(value) {
  const text = String(value || '').trim();
  if (!text) return '';
  if (TIME_OPTIONS.includes(text)) return text;
  const match = text.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return text;
  let hour = Number(match[1]);
  const minute = Number(match[2]) >= 30 ? '30' : '00';
  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
}

function normalizeDayLabel(day) {
  return day === 'Su' ? 'Sun' : day;
}

function renderWeekChecks(name, selected = WEEK_DAYS) {
  return `<div class="week-grid">${WEEK_DAYS.map((day) => `<label><input type="checkbox" data-week="${name}" value="${day}" ${selected.includes(day) ? 'checked' : ''} />${day}</label>`).join('')}</div>`;
}

function renderOrderInfo(orderInfo = {}) {
  const info = orderInfoWithDefaults(orderInfo);
  orderEl.giftCardConversion.value = info.giftCardConversion;
  orderEl.tipOutMethod.value = info.tipOutMethod;
  orderEl.businessAddress.value = info.businessAddress;
  orderEl.shippingDifferent.checked = Boolean(info.shippingDifferent);
  orderEl.shippingAddress.value = info.shippingAddress;
  const merchantContactName = currentMerchantName();
  const dbaName = fields.dbaName.value.trim();
  orderEl.mainContact.value = !info.mainContact || info.mainContact === dbaName ? merchantContactName : info.mainContact;
  orderEl.menuQuestionsContact.value = !info.menuQuestionsContact || info.menuQuestionsContact === dbaName ? merchantContactName : info.menuQuestionsContact;
  orderEl.printerKdsNames.value = info.printerKdsNames;
  orderEl.floorPlan.value = info.floorPlan;
  orderEl.additionalMenus.checked = Boolean(info.additionalMenus);
  orderEl.menuNotes.value = info.menuNotes;
  orderEl.employeeStatus.value = info.employeeStatus;
  orderEl.oloEnabled.value = info.oloEnabled;
  orderEl.customerDatabase.value = info.customerDatabase;

  orderEl.equipmentList.innerHTML = info.equipment.map((item) => `
    <div class="equipment-row">
      <span>${escapeHtml(item.name)}</span>
      <label>Qty<input data-equipment="${escapeHtml(item.name)}" type="number" min="0" value="${escapeHtml(item.qty)}" /></label>
    </div>
  `).join('');

  renderTaxes(info.taxes);
  renderSurcharges(info.surcharges);
  renderDiscounts(info.discounts);
  orderEl.happyHourEnabled.checked = Boolean(info.happyHourEnabled);
  renderHappyHours(info.happyHours);
  renderGratuities(info.gratuities);
  renderEmployees(info.employees);
  renderOloSchedule(info.oloSchedule);
  renderThirdParty(info.thirdParty);
  updateOrderVisibility();
  renderOrderEmail();
  syncReadOnlyControls();
}

function renderTaxes(taxes = []) {
  const normalizedTaxes = taxes.length ? taxes : defaultOrderInfo().taxes;
  orderEl.taxList.innerHTML = normalizedTaxes.map((item, index) => {
    const showAnother = index === normalizedTaxes.length - 1;
    return `
      <div class="repeat-card tax-card" data-tax-index="${index}">
        <div class="repeat-card-header"><strong>${escapeHtml(item.name || `Tax ${index + 1}`)}</strong></div>
        <div class="compact-row"><label>Name<input data-tax-field="name" value="${escapeHtml(item.name)}" /></label><label>Tax Rate<input data-tax-field="taxRate" placeholder="X.XXX%" value="${escapeHtml(item.taxRate)}" /></label></div>
        <div class="check-grid">
          ${TAX_CLASSES.map((taxClass) => `<label><input data-tax-class="${index}" type="checkbox" value="${escapeHtml(taxClass)}" ${(item.taxClasses || []).includes(taxClass) ? 'checked' : ''} />${escapeHtml(taxClass)}</label>`).join('')}
        </div>
        <label class="inline-check"><input data-tax-field="taxAddedAlcohol" type="checkbox" ${item.taxAddedAlcohol ? 'checked' : ''} />Taxes Added?<span class="toggle-status ${item.taxAddedAlcohol ? 'yes' : 'no'}">${item.taxAddedAlcohol ? 'Yes' : 'No'}</span></label>
        <label class="inline-check"><input data-tax-field="taxHiddenAlcohol" type="checkbox" ${item.taxHiddenAlcohol ? 'checked' : ''} />Hidden for Alcohol?</label>
        ${showAnother ? `<label class="inline-check"><input data-tax-field="anotherTax" type="checkbox" ${item.anotherTax ? 'checked' : ''} />Another Tax</label>` : ''}
      </div>
    `;
  }).join('');
}

function renderSurcharges(surcharges = []) {
  orderEl.surchargesList.innerHTML = surcharges.map((item, index) => `
    <div class="repeat-card" data-surcharge-index="${index}">
      <div class="repeat-card-header"><strong>${index === 0 ? 'Advantage Program' : 'Additional Surcharge'}</strong><button class="secondary" type="button" data-remove-surcharge="${index}">Remove</button></div>
      ${index === 0
        ? `<div class="triple-row"><label>Name<input data-surcharge-field="name" value="Advantage Program" readonly /></label><label>Type<select data-surcharge-field="type">${optionList(ADVANTAGE_SURCHARGES, item.type)}</select></label><label>Percent<select data-surcharge-field="percentage">${optionList(ADVANTAGE_RATES, item.percentage)}</select></label></div>`
        : `<div class="triple-row"><label>Name<input data-surcharge-field="name" value="${escapeHtml(item.name)}" /></label><label>Percent<input data-surcharge-field="percentage" value="${escapeHtml(item.percentage)}" /></label><span>%</span></div>`}
    </div>
  `).join('');
}

function renderDiscounts(discounts = []) {
  orderEl.discountsList.innerHTML = discounts.map((item, index) => `
    <div class="repeat-card" data-discount-index="${index}">
      <div class="repeat-card-header"><strong>Discount</strong><button class="secondary" type="button" data-remove-discount="${index}">Remove</button></div>
      <div class="triple-row"><label>Name<input data-discount-field="name" value="${escapeHtml(item.name)}" /></label><label>Amount<input data-discount-field="amount" value="${escapeHtml(item.amount)}" /></label><label>Type<select data-discount-field="unit">${optionList(['%', '$'], item.unit || '%')}</select></label></div>
    </div>
  `).join('');
}

function renderHappyHours(happyHours = []) {
  orderEl.happyHourList.innerHTML = happyHours.map((item, index) => `
    <div class="repeat-card" data-happy-hour-index="${index}">
      <div class="repeat-card-header"><strong>Happy Hour</strong><button class="secondary" type="button" data-remove-happy-hour="${index}">Remove</button></div>
      <label>Name<input data-happy-hour-field="name" value="${escapeHtml(item.name)}" /></label>
      ${renderWeekChecks(`happy-${index}`, item.days || [])}
      <div class="time-row"><label>Start<select data-happy-hour-field="start"><option value=""></option>${optionList(TIME_OPTIONS, normalizeTimeChoice(item.start))}</select></label><label>End<select data-happy-hour-field="end"><option value=""></option>${optionList(TIME_OPTIONS, normalizeTimeChoice(item.end))}</select></label></div>
      <div class="triple-row"><label>Amount<input data-happy-hour-field="amount" value="${escapeHtml(item.amount)}" /></label><label>Type<select data-happy-hour-field="unit">${optionList(['%', '$'], item.unit || '%')}</select></label><span></span></div>
      <label>Note<textarea data-happy-hour-field="note" rows="2">${escapeHtml(item.note)}</textarea></label>
    </div>
  `).join('');
}

function renderGratuities(gratuities = []) {
  orderEl.gratuitiesList.innerHTML = gratuities.map((item, index) => `
    <div class="repeat-card" data-gratuity-index="${index}">
      <div class="repeat-card-header"><strong>Gratuity</strong><button class="secondary" type="button" data-remove-gratuity="${index}">Remove</button></div>
      <div class="gratuity-row">
        <label>Name<input data-gratuity-field="name" value="${escapeHtml(item.name)}" /></label>
        <label>Percent<input data-gratuity-field="percentage" value="${escapeHtml(item.percentage)}" /></label>
        <label class="gratuity-auto"><span>Auto</span><input data-gratuity-field="automatic" type="checkbox" ${item.automatic ? 'checked' : ''} /></label>
        <label class="gratuity-people ${item.automatic ? '' : 'hidden'}">People<input data-gratuity-field="people" type="number" min="1" value="${escapeHtml(item.people)}" /></label>
      </div>
    </div>
  `).join('');
}

function renderEmployees(employees = []) {
  orderEl.employeesList.innerHTML = employees.map((item, index) => `
    <div class="repeat-card" data-employee-index="${index}">
      <div class="repeat-card-header"><strong>Employee</strong><button class="secondary" type="button" data-remove-employee="${index}">Remove</button></div>
      <label>Name<input data-employee-field="name" value="${escapeHtml(item.name)}" /></label>
      <div class="job-grid">${EMPLOYEE_JOBS.map((job) => `<label><input type="checkbox" data-employee-job="${index}" value="${job}" ${(item.jobs || []).includes(job) ? 'checked' : ''} />${job}</label>`).join('')}</div>
      <label>4 Digit PIN<input data-employee-field="pin" maxlength="4" value="${escapeHtml(item.pin)}" /></label>
    </div>
  `).join('');
}

function renderOloSchedule(schedule = []) {
  const rows = WEEK_DAYS.map((day, index) => {
    const item = schedule.find((row) => normalizeDayLabel(row.day) === day) || { day, enabled: false, start: index ? schedule[0]?.start || '' : '', end: index ? schedule[0]?.end || '' : '' };
    return { ...item, start: normalizeTimeChoice(item.start), end: normalizeTimeChoice(item.end) };
  });
  orderEl.oloScheduleList.innerHTML = rows.map((item) => `
    <div class="day-row" data-olo-day="${item.day}">
      <label class="inline-check"><input data-olo-field="enabled" type="checkbox" ${item.enabled ? 'checked' : ''} />${item.day}</label>
      <div class="time-row"><select data-olo-field="start"><option value=""></option>${optionList(TIME_OPTIONS, item.start)}</select><select data-olo-field="end"><option value=""></option>${optionList(TIME_OPTIONS, item.end)}</select></div>
    </div>
  `).join('');
}

function renderThirdParty(thirdParty = []) {
  orderEl.thirdPartyList.innerHTML = thirdParty.map((item) => `
    <div class="repeat-card" data-third-party="${escapeHtml(item.name)}">
      <label class="inline-check"><input data-third-party-field="selected" type="checkbox" ${item.selected ? 'checked' : ''} />${escapeHtml(item.name)}</label>
      <div class="triple-row ${item.selected ? '' : 'hidden'}"><label>Upcharge<input data-third-party-field="amount" value="${escapeHtml(item.amount)}" /></label><label>Type<select data-third-party-field="unit">${optionList(['%', '$'], item.unit || '%')}</select></label><span></span></div>
    </div>
  `).join('');
}

function checkedValues(container, selector = 'input[type="checkbox"]') {
  return [...container.querySelectorAll(selector)].filter((input) => input.checked).map((input) => input.value);
}

function readRepeatCards(container, cardSelector, fieldSelector, jobSelector = null) {
  return [...container.querySelectorAll(cardSelector)].map((card) => {
    const item = {};
    card.querySelectorAll(fieldSelector).forEach((input) => {
      const key = input.dataset.surchargeField || input.dataset.discountField || input.dataset.happyHourField || input.dataset.gratuityField || input.dataset.employeeField;
      item[key] = input.type === 'checkbox' ? input.checked : input.value.trim();
    });
    if (jobSelector) item.jobs = checkedValues(card, jobSelector);
    return item;
  });
}

function readTaxes() {
  const taxes = [...orderEl.taxList.querySelectorAll('[data-tax-index]')].map((card, index) => {
    const item = {};
    card.querySelectorAll('[data-tax-field]').forEach((input) => {
      item[input.dataset.taxField] = input.type === 'checkbox' ? input.checked : input.value.trim();
    });
    item.taxClasses = checkedValues(card, `[data-tax-class="${index}"]`);
    item.name = item.name || (index === 0 ? 'Tax' : `Tax ${index + 1}`);
    return item;
  });
  return taxes.length ? taxes : defaultOrderInfo().taxes;
}

function readOrderInfo() {
  const taxes = readTaxes();
  const firstTax = taxes[0] || defaultOrderInfo().taxes[0];
  return {
    giftCardConversion: orderEl.giftCardConversion.value,
    taxes,
    taxRate: firstTax.taxRate || '',
    taxClasses: firstTax.taxClasses || [],
    taxAddedAlcohol: Boolean(firstTax.taxAddedAlcohol),
    taxHiddenAlcohol: Boolean(firstTax.taxHiddenAlcohol),
    surcharges: readRepeatCards(orderEl.surchargesList, '[data-surcharge-index]', '[data-surcharge-field]'),
    discounts: readRepeatCards(orderEl.discountsList, '[data-discount-index]', '[data-discount-field]'),
    happyHourEnabled: orderEl.happyHourEnabled.checked,
    happyHours: [...orderEl.happyHourList.querySelectorAll('[data-happy-hour-index]')].map((card, index) => {
      const item = {};
      card.querySelectorAll('[data-happy-hour-field]').forEach((input) => {
        item[input.dataset.happyHourField] = input.value.trim();
      });
      item.days = checkedValues(card, `[data-week="happy-${index}"]`);
      return item;
    }),
    gratuities: readRepeatCards(orderEl.gratuitiesList, '[data-gratuity-index]', '[data-gratuity-field]'),
    tipOutMethod: orderEl.tipOutMethod.value,
    businessAddress: orderEl.businessAddress.value.trim(),
    shippingDifferent: orderEl.shippingDifferent.checked,
    shippingAddress: orderEl.shippingAddress.value.trim(),
    equipment: [...orderEl.equipmentList.querySelectorAll('[data-equipment]')].map((input) => ({ name: input.dataset.equipment, qty: input.value.trim() })),
    mainContact: orderEl.mainContact.value.trim(),
    menuQuestionsContact: orderEl.menuQuestionsContact.value.trim(),
    printerKdsNames: orderEl.printerKdsNames.value.trim(),
    floorPlan: orderEl.floorPlan.value,
    additionalMenus: orderEl.additionalMenus.checked,
    menuNotes: orderEl.menuNotes.value.trim(),
    employeeStatus: orderEl.employeeStatus.value,
    employees: readRepeatCards(orderEl.employeesList, '[data-employee-index]', '[data-employee-field]', '[data-employee-job]'),
    oloEnabled: orderEl.oloEnabled.value,
    oloSchedule: [...orderEl.oloScheduleList.querySelectorAll('[data-olo-day]')].map((row) => {
      const item = { day: row.dataset.oloDay };
      row.querySelectorAll('[data-olo-field]').forEach((input) => {
        item[input.dataset.oloField] = input.type === 'checkbox' ? input.checked : input.value;
      });
      return item;
    }),
    customerDatabase: orderEl.customerDatabase.value,
    thirdParty: [...orderEl.thirdPartyList.querySelectorAll('[data-third-party]')].map((card) => {
      const item = { name: card.dataset.thirdParty };
      card.querySelectorAll('[data-third-party-field]').forEach((input) => {
        item[input.dataset.thirdPartyField] = input.type === 'checkbox' ? input.checked : input.value.trim();
      });
      return item;
    })
  };
}

function updateOrderVisibility() {
  orderEl.shippingAddressWrap.classList.toggle('hidden', !orderEl.shippingDifferent.checked);
  orderEl.taxList.querySelectorAll('[data-tax-index]').forEach((card) => {
    const added = card.querySelector('[data-tax-field="taxAddedAlcohol"]')?.checked;
    const status = card.querySelector('.toggle-status');
    if (!status) return;
    status.textContent = added ? 'Yes' : 'No';
    status.classList.toggle('yes', Boolean(added));
    status.classList.toggle('no', !added);
  });
  orderEl.happyHourList.classList.toggle('hidden', !orderEl.happyHourEnabled.checked);
  orderEl.addHappyHourBtn.classList.toggle('hidden', !orderEl.happyHourEnabled.checked);
  const employeesVisible = orderEl.employeeStatus.value === 'Provided';
  orderEl.employeesList.classList.toggle('hidden', !employeesVisible);
  orderEl.addEmployeeBtn.classList.toggle('hidden', !employeesVisible);
  orderEl.oloScheduleList.classList.toggle('hidden', orderEl.oloEnabled.value !== 'Yes');
  orderEl.thirdPartyList.querySelectorAll('[data-third-party]').forEach((card) => {
    const selected = card.querySelector('[data-third-party-field="selected"]')?.checked;
    card.querySelector('.triple-row')?.classList.toggle('hidden', !selected);
  });
  orderEl.gratuitiesList.querySelectorAll('[data-gratuity-index]').forEach((card) => {
    const automatic = card.querySelector('[data-gratuity-field="automatic"]')?.checked;
    card.querySelector('.gratuity-people')?.classList.toggle('hidden', !automatic);
  });
}

function handleAnotherTaxChange(target) {
  if (target.dataset.taxField !== 'anotherTax' || !target.checked) return false;
  const info = readOrderInfo();
  if (!info.taxes[info.taxes.length - 1]?.anotherTax) return false;
  info.taxes.push({ name: `Tax ${info.taxes.length + 1}`, taxRate: '', taxClasses: [], taxAddedAlcohol: false, taxHiddenAlcohol: false, anotherTax: false });
  info.taxes = info.taxes.map((tax, index) => ({ ...tax, anotherTax: index < info.taxes.length - 1 }));
  renderOrderInfo(info);
  return true;
}

function copyOloTimesFromPreviousDay(target) {
  if (target.dataset.oloField !== 'enabled' || !target.checked) return;
  const row = target.closest('[data-olo-day]');
  if (!row) return;
  const rows = [...orderEl.oloScheduleList.querySelectorAll('[data-olo-day]')];
  const index = rows.indexOf(row);
  const start = row.querySelector('[data-olo-field="start"]');
  const end = row.querySelector('[data-olo-field="end"]');
  if (!start || !end || start.value || end.value) return;
  const source = rows
    .slice(0, index)
    .reverse()
    .find((candidate) => candidate.querySelector('[data-olo-field="enabled"]')?.checked
      && (candidate.querySelector('[data-olo-field="start"]')?.value || candidate.querySelector('[data-olo-field="end"]')?.value));
  if (!source) return;
  start.value = source.querySelector('[data-olo-field="start"]')?.value || '';
  end.value = source.querySelector('[data-olo-field="end"]')?.value || '';
}

function htmlLink(link) {
  return `<a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>`;
}

function textLink(link) {
  return `${link.label}: ${link.url}`;
}

function textFromHtml(html) {
  return trimClipboardText(String(html || '')
    .replace(/<a href="([^"]+)">([^<]+)<\/a>/g, '$2: $1')
    .replace(/<br>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&'));
}

function lineValue(value, fallback = '') {
  return value || fallback;
}

function formatPercent(value, decimals = 3) {
  const cleaned = String(value || '').replace('%', '').trim();
  if (!cleaned) return '';
  const number = Number(cleaned);
  return Number.isNaN(number) ? value : `${number.toFixed(decimals)}%`;
}

function formatTaxAddedHidden(info) {
  const selectedClasses = info.taxClasses || [];
  const alcoholClasses = ['Beer', 'Liquor', 'Wine'];
  const addedClasses = info.taxHiddenAlcohol
    ? selectedClasses.filter((taxClass) => !alcoholClasses.includes(taxClass))
    : selectedClasses;
  const addedLabel = addedClasses.length === TAX_CLASSES.length
    ? 'Added for All'
    : `Added for ${addedClasses.join(', ') || 'selected classes'}`;
  return [
    info.taxAddedAlcohol && addedLabel,
    info.taxHiddenAlcohol && 'Hidden for Alcohol'
  ].filter(Boolean).join(', ');
}

function taxLines(info) {
  const taxes = orderInfoWithDefaults(info).taxes || [];
  return taxes
    .filter((tax) => tax.name || tax.taxRate || (tax.taxClasses || []).length || tax.taxAddedAlcohol || tax.taxHiddenAlcohol)
    .map((tax) => ({
      name: tax.name || 'Tax',
      amount: formatPercent(tax.taxRate),
      applied: (tax.taxClasses || []).join(', '),
      addedHidden: formatTaxAddedHidden({
        taxClasses: tax.taxClasses || [],
        taxAddedAlcohol: tax.taxAddedAlcohol,
        taxHiddenAlcohol: tax.taxHiddenAlcohol
      }) || 'No'
    }));
}

function compactDayList(days) {
  const indexes = days
    .map((day) => WEEK_DAYS.indexOf(normalizeDayLabel(day)))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b);
  const groups = [];
  for (let index = 0; index < indexes.length; index += 1) {
    const start = indexes[index];
    let end = start;
    while (indexes[index + 1] === end + 1) {
      end = indexes[index + 1];
      index += 1;
    }
    if (end - start >= 2) groups.push(`${WEEK_DAYS[start]}-${WEEK_DAYS[end]}`);
    else if (end > start) groups.push(WEEK_DAYS[start], WEEK_DAYS[end]);
    else groups.push(WEEK_DAYS[start]);
  }
  return groups.join(', ');
}

function formatOloSchedule(schedule) {
  const grouped = new Map();
  schedule
    .filter((item) => item.enabled)
    .forEach((item) => {
      const key = `${item.start || ''}|${item.end || ''}`;
      const days = grouped.get(key) || [];
      days.push(normalizeDayLabel(item.day));
      grouped.set(key, days);
    });
  if (!grouped.size) return 'No';
  return [...grouped.entries()].map(([key, days]) => {
    const [start, end] = key.split('|');
    return `${compactDayList(days)} ${start || ''}-${end || ''}`.trim();
  }).join(', ');
}

function selectedEquipment(info) {
  return (info.equipment || []).filter((item) => Number(item.qty) > 0);
}

function renderEquipmentSummary() {
  const equipment = selectedEquipment(orderInfoWithDefaults(readOrderInfo()));
  orderEl.equipmentSummaryList.innerHTML = equipment.length
    ? equipment.map((item) => `<div class="equipment-summary-item"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.qty)}</span></div>`).join('')
    : '<div class="empty">No equipment quantities added.</div>';
}

function formatMoneyPercent(item) {
  if (!item.amount) return item.name || '';
  return `${item.name}: ${item.amount}${item.unit || '%'}`;
}

function buildProgrammingNotes(info, context = {}) {
  const separator = '   ///   ';
  const parts = [];

  if (info.giftCardConversion === 'Yes') {
    parts.push('Gift Card Conversion: Yes, Merchant will provide Gift Card Liability Report and photo of the back of a Gift Card showing the numbers.');
  }

  const additionalSurcharges = (info.surcharges || [])
    .filter((item) => item.name && item.name !== 'Advantage Program')
    .map((item) => `${item.name}${item.percentage ? `: ${item.percentage}%` : ''}`);
  if (additionalSurcharges.length) parts.push(`Surcharges: ${additionalSurcharges.join('; ')}`);

  const discounts = [
    ...(info.discounts || []).filter((item) => item.name).map(formatMoneyPercent),
    ...((info.happyHourEnabled ? info.happyHours : []) || [])
      .filter((item) => item.name || item.amount || item.note)
      .map((item) => {
        const schedule = `${(item.days || []).join(', ')} ${item.start || ''}-${item.end || ''}`.trim();
        const amount = item.amount ? `${item.amount}${item.unit || ''} OFF` : '';
        return `Happy Hour${item.name ? ` - ${item.name}` : ''}${schedule ? `: ${schedule}` : ''}${amount ? `, ${amount}` : ''}${item.note ? ` (${item.note})` : ''}`;
      })
  ];
  if (discounts.length) parts.push(`Discounts: ${discounts.join('; ')}`);

  const gratuities = (info.gratuities || [])
    .filter((item) => item.name)
    .map((item) => `${item.name}: ${item.percentage || ''}%${item.automatic ? ` Automatic${item.people ? ` for ${item.people}+ people` : ''}` : ''}`);
  if (gratuities.length) parts.push(`Gratuities: ${gratuities.join('; ')}`);

  const menuDetails = [info.additionalMenus ? 'Additional Menus to be Provided.' : '', info.menuNotes || ''].filter(Boolean).join(' ');
  if (menuDetails) parts.push(`Menu Details: ${menuDetails}`);

  if (info.employeeStatus && info.employeeStatus !== 'None') {
    const employees = info.employeeStatus === 'Will supply'
      ? 'Will Provide Names, Job Title(s), and a 4 digit pin'
      : (info.employees || [])
        .filter((item) => item.name)
        .map((item) => `${item.name} - ${(item.jobs || []).join(', ')}${item.pin ? ` - PIN ${item.pin}` : ''}`)
        .join('; ');
    parts.push(`Employees: ${employees || info.employeeStatus}`);
  }

  const integrations = [];
  if (info.oloEnabled === 'Yes') {
    integrations.push('OLO: Yes');
    const schedule = context.oloSchedule || formatOloSchedule(info.oloSchedule || []);
    if (schedule && schedule !== 'No') integrations.push(`Schedule: ${schedule}`);
  }
  if (info.customerDatabase === 'Customer will Provide') integrations.push('Customer Database: Customer will Provide');
  const thirdParty = (info.thirdParty || [])
    .filter((item) => item.selected)
    .map((item) => `${item.name}${item.amount ? ` (${item.amount}${item.unit || '%'})` : ''}`);
  if (thirdParty.length) integrations.push(`3rd Party: ${thirdParty.join(', ')}`);
  if (integrations.length) parts.push(`Additional Integrations: ${integrations.join('; ')}`);

  return trimClipboardText(parts.join(separator));
}

function renderOrderEmail() {
  const info = orderInfoWithDefaults(readOrderInfo());
  orderEl.orderSubjectOutput.value = renderSubject(ORDER_RECAP_SUBJECT);
  info.mainContact = info.mainContact || currentMerchantName();
  info.menuQuestionsContact = info.menuQuestionsContact || currentMerchantName();
  const equipment = selectedEquipment(info);
  const hasPrinterKds = equipment.some((item) => ['Remote Impact Printers', 'Remote Thermal Printers', 'Kitchen Display Screens'].includes(item.name));
  const printerKds = hasPrinterKds ? lineValue(info.printerKdsNames, '[Printer/KDS names]') : 'No';
  const shippingAddress = info.shippingDifferent ? info.shippingAddress : info.businessAddress;
  const taxes = taxLines(info);
  const taxHtml = taxes.length
    ? taxes.map((tax) => `&nbsp;&nbsp;&nbsp;&nbsp;- ${escapeHtml(tax.name)}: ${escapeHtml(tax.amount)}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Taxes Applied to - ${escapeHtml(tax.applied)}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Added/Hidden - ${escapeHtml(tax.addedHidden)}`).join('<br>')
    : '&nbsp;&nbsp;&nbsp;&nbsp;- Tax Amount:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Taxes Applied to - <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Added/Hidden - ';
  const surchargeLines = info.surcharges
    .filter((item) => item.name || item.type)
    .map((item) => {
      if (item.name === 'Advantage Program') {
        return item.type === 'None' ? '' : `Advantage Program: ${item.type || 'None'}${item.percentage ? ` ${item.percentage}%` : ''}`;
      }
      return `${item.name}: ${item.percentage || ''}%`;
    })
    .filter(Boolean);
  const surcharges = surchargeLines.length ? surchargeLines.join('; ') : 'None';
  const giftCardConversionHtml = info.giftCardConversion === 'Yes'
    ? '<strong>Yes, Merchant will provide Gift Card Liability Report and photo of the back of a Gift Card showing the numbers.</strong>'
    : escapeHtml(info.giftCardConversion);
  const giftCardConversionText = info.giftCardConversion === 'Yes'
    ? 'Yes, Merchant will provide Gift Card Liability Report and photo of the back of a Gift Card showing the numbers.'
    : info.giftCardConversion;
  const discountHtmlLines = [
    ...info.discounts.filter((item) => item.name).map((item) => escapeHtml(formatMoneyPercent(item))),
    ...(info.happyHourEnabled ? info.happyHours.filter((item) => item.name || item.amount || item.note).map((item) => {
      const schedule = `${(item.days || []).join(', ')} ${item.start || ''}-${item.end || ''}`.trim();
      const amount = item.amount ? `<strong>${escapeHtml(item.amount)}${escapeHtml(item.unit || '')} OFF</strong>` : '';
      return `Happy Hour${item.name ? ` - ${escapeHtml(item.name)}` : ''}: ${escapeHtml(schedule)}${amount ? `, ${amount}` : ''}${item.note ? ` (${escapeHtml(item.note)})` : ''}`;
    }) : [])
  ];
  const discountTextLines = [
    ...info.discounts.filter((item) => item.name).map(formatMoneyPercent),
    ...(info.happyHourEnabled ? info.happyHours.filter((item) => item.name || item.amount || item.note).map((item) => {
      const schedule = `${(item.days || []).join(', ')} ${item.start || ''}-${item.end || ''}`.trim();
      const amount = item.amount ? `${item.amount}${item.unit || ''} OFF` : '';
      return `Happy Hour${item.name ? ` - ${item.name}` : ''}: ${schedule}${amount ? `, ${amount}` : ''}${item.note ? ` (${item.note})` : ''}`;
    }) : [])
  ];
  const gratuityLines = info.gratuities.filter((item) => item.name).map((item) => `${item.name}: ${item.percentage || ''}%${item.automatic ? ` Automatic${item.people ? ` for ${item.people}+ people` : ''}` : ''}`);
  const floorPlan = info.floorPlan === 'Merchant will supply' ? `<strong>Merchant will Supply</strong>` : 'None';
  const floorPlanText = info.floorPlan === 'Merchant will supply' ? 'Merchant will Supply' : 'None';
  const menuDetails = `${info.additionalMenus ? '<strong>Additional Menus to be Provided.</strong> ' : ''}${escapeHtml(info.menuNotes)}`;
  const menuDetailsText = `${info.additionalMenus ? 'Additional Menus to be Provided. ' : ''}${info.menuNotes}`;
  const employeeDetails = info.employeeStatus === 'Will supply'
    ? '<strong>Will Provide Names, Job Title(s), and a 4 digit pin</strong>'
    : info.employeeStatus === 'Provided'
      ? info.employees.filter((item) => item.name).map((item) => `${escapeHtml(item.name)} - ${(item.jobs || []).join(', ')}${item.pin ? ` - PIN ${escapeHtml(item.pin)}` : ''}`).join('<br>')
      : 'None';
  const employeeDetailsText = info.employeeStatus === 'Will supply'
    ? 'Will Provide Names, Job Title(s), and a 4 digit pin'
    : info.employeeStatus === 'Provided'
      ? info.employees.filter((item) => item.name).map((item) => `${item.name} - ${(item.jobs || []).join(', ')}${item.pin ? ` - PIN ${item.pin}` : ''}`).join('\n')
      : 'None';
  const oloSchedule = info.oloEnabled === 'Yes' ? formatOloSchedule(info.oloSchedule) : 'No';
  const customerDb = info.customerDatabase === 'Customer will Provide' ? '<strong>Customer will Provide</strong>' : 'No';
  const customerDbText = info.customerDatabase === 'Customer will Provide' ? 'Customer will Provide' : 'No';
  const thirdParty = info.thirdParty.filter((item) => item.selected).map((item) => `${item.name}${item.amount ? ` (${item.amount}${item.unit || '%'})` : ''}`).join(', ') || 'None';

  const html = `Hello ${escapeHtml(firstName(currentMerchantName()))}<br><br>
It was a pleasure speaking with you earlier and discussing your Shift4 Dine POS order. I've compiled the notes from our call and outlined the critical points that we needed to address to ensure a smooth installation and go-live process.<br><br>
Below is a recap of the topics we discussed, along with the next steps:<br><br>
1. Tentative Install & Go Live Dates:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Tentative Install Date/Time: ${escapeHtml(formatDisplayDateTime(combinedInstallationDateTime()))}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Tentative Go Live Date: ${escapeHtml(formatInstallationDateForTemplate(fields.goLiveDate.value))}<br>
2. Site Readiness:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- To avoid any delays or technical issues on the installation day, please ensure that all network requirements are met as per the document available here:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- ${htmlLink(ORDER_LINKS.siteReadiness)}<br>
3. Gift Cards:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Conversion Needed: ${giftCardConversionHtml}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- ${htmlLink(ORDER_LINKS.giftCardFaq)}<br>
4. Financial Configuration:<br>
${taxHtml}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Surcharges: ${escapeHtml(surcharges)}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Discounts: ${discountHtmlLines.length ? discountHtmlLines.join('; ') : 'No'}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Gratuities: ${gratuityLines.length ? gratuityLines.map(escapeHtml).join('; ') : 'No'}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Tipping Set Up: ${escapeHtml(info.tipOutMethod)}<br>
5. Shipping and Equipment:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Equipment:<br>${equipment.map((item) => `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ${escapeHtml(item.name)}: ${escapeHtml(item.qty)}`).join('<br>')}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Shipping Address: ${escapeHtml(shippingAddress)}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Shipping Method: Ground<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Installation Address: ${escapeHtml(info.businessAddress)}<br>
6. Contacts:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Main Contact: ${escapeHtml(info.mainContact)}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Menu Questions Contact: ${escapeHtml(info.menuQuestionsContact)}<br>
7. Hardware and Layout:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Printer/KDS Names: ${escapeHtml(printerKds)}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Floor Plan: ${floorPlan}<br>
8. Menu:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Details: ${menuDetails}<br>
9. Employees:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Details: ${employeeDetails}<br>
10. Additional Integrations:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- OLO: ${escapeHtml(info.oloEnabled)}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Schedule: ${escapeHtml(oloSchedule)}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Customer Database: ${customerDb}<br>
&nbsp;&nbsp;&nbsp;&nbsp;- 3rd Party: ${escapeHtml(thirdParty)}<br>
11. Training:<br>
&nbsp;&nbsp;&nbsp;&nbsp;- To prepare for your new Shift4 Dine POS System, please visit our Resource Center for videos and walkthroughs on how to use Shift4 Dine.<br>
&nbsp;&nbsp;&nbsp;&nbsp;- <strong>Video Tutorials To Get You Started:</strong><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ${htmlLink(ORDER_LINKS.lighthouse)}<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ${htmlLink(ORDER_LINKS.managerTraining)}<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- ${htmlLink(ORDER_LINKS.employeeTraining)}<br><br>
If you have any questions or need further clarification on any of the points above, feel free to reach out to me directly.<br><br>
Thank you for your cooperation, and I look forward to ensuring a successful installation of your Shift4 Dine POS system!<br><br>
Best regards,`;

  const text = textFromHtml(html);
  orderEl.orderEmailOutput.innerHTML = html;
  orderEl.orderEmailOutput.dataset.html = normalizeClipboardHtml(html);
  orderEl.orderEmailOutput.dataset.text = trimClipboardText(text);
  orderEl.orderProgrammingNotesOutput.value = buildProgrammingNotes(info, { oloSchedule });
}

function renderSummary() {
  const merchants = filteredMerchants();
  const counts = Object.fromEntries(STAGES.map((stage) => [stage, 0]));
  merchants.forEach((merchant) => {
    counts[normalizeStage(merchant.stage)] += 1;
  });
  el.summaryBar.innerHTML = [
    ['Total', merchants.length],
    ...STAGES.map((stage) => [stage, counts[stage]])
  ].map(([label, value]) => `<div class="summary-item"><strong>${value}</strong><span>${label}</span></div>`).join('');
}

function renderSummaryList(target, rows) {
  target.innerHTML = rows.map(([label, value]) => `
    <dt>${escapeHtml(label)}</dt>
    <dd>${escapeHtml(value || '—')}</dd>
  `).join('');
}

function renderMerchantSnapshot() {
  const merchant = selectedMerchant() || {};
  const contacts = contactsForMerchant(merchant);
  const owner = contactByType(contacts, 'Owner') || contacts[0] || {};
  const rep = contactByType(contacts, 'Rep') || {};
  const accountStatus = displayedAccountStatus(
    fields.accountStatus?.value || merchant.accountStatus,
    fields.taskName?.value || merchant.taskName
  );
  el.accountStatusBadge.textContent = accountStatus;
  el.accountStatusBadge.className = `account-status-badge ${accountStatus ? accountStatusClass(accountStatus) : 'hidden'}`;
  renderSummaryList(el.controlInfoSummary, [
    ['Status', normalizeStage(merchant.stage || fields.stage?.value || 'Active')],
    ['Task', normalizeTask(merchant.taskName || fields.taskName?.value || 'CSM Approval')],
    ['Order Start', normalizeDateInput(merchant.orderStartDate || fields.orderStartDate?.value)],
    ['Menu Pres.', formatDisplayDateTime(merchant.menuPresentationDate || combinedMenuPresentationDateTime())],
    ['Install', formatDisplayDateTime(merchant.installationDate || combinedInstallationDateTime())],
    ['Life Cycle', calculateOrderLifeCycle(merchant.orderStartDate || fields.orderStartDate?.value, merchant.installationDate || combinedInstallationDateTime())]
  ]);
  renderSummaryList(el.merchantInfoSummary, [
    ['DBA Name', merchant.dbaName || fields.dbaName?.value],
    ['MID', merchant.mid || fields.mid?.value],
    ['Programming', programmingTypeLabel(merchant.programmingType || fields.programmingType?.value)],
    ['Owner', owner.name || ''],
    ['Owner Email', owner.email || ''],
    ['Owner Phone', owner.phone || '']
  ]);
  renderSummaryList(el.salesInfoSummary, [
    ['Sales Rep', rep.name || merchant.salesRepName || ''],
    ['Rep Email', rep.email || merchant.salesRepEmail || ''],
    ['Rep Phone', rep.phone || ''],
    ['Contacts', contacts.length ? `${contacts.length} saved` : 'None'],
    ['Welcome Email', merchant.welcomeEmailSent ? 'Sent' : 'Not sent'],
    ['Last Updated', merchant.updatedAt ? formatDisplayDateTime(merchant.updatedAt) : '']
  ]);
}

function calendarEvents() {
  return state.merchants.flatMap((merchant) => [
    {
      type: 'Menu Presentation',
      value: merchant.menuPresentationDate,
      merchant
    },
    {
      type: 'Installation',
      value: merchant.installationDate,
      merchant
    }
  ]).filter((event) => normalizeDateInput(event.value))
    .map((event) => ({
      ...event,
      dateKey: normalizeDateInput(event.value),
      time: String(event.value || '').includes('T')
        ? formatDisplayDateTime(event.value).replace(/^.*?,?\s(?=\d{1,2}:)/, '')
        : ''
    }))
    .sort((a, b) => normalizeDateTimeInput(a.value).localeCompare(normalizeDateTimeInput(b.value)));
}

function renderCalendar() {
  const events = calendarEvents();
  el.calendarMode.value = state.calendarMode;
  if (!events.length) {
    el.calendarTitle.textContent = 'Calendar';
    el.calendarList.innerHTML = '<div class="empty">No Installation or Menu Presentation dates are scheduled yet.</div>';
    return;
  }

  const byDate = events.reduce((acc, event) => {
    acc[event.dateKey] ||= [];
    acc[event.dateKey].push(event);
    return acc;
  }, {});
  const todayKey = localDateKey(new Date());

  const eventButton = (event, compact = false) => {
    const merchantLabel = event.merchant.dbaName || event.merchant.merchantName || 'Unnamed merchant';
    return `
      <button class="calendar-event ${compact ? 'compact-calendar-event' : ''}" type="button" data-calendar-id="${escapeHtml(event.merchant.id)}">
        <span class="calendar-event-type">${escapeHtml(event.type)}</span>
        <strong>${escapeHtml(merchantLabel)}</strong>
        <span>${escapeHtml([event.time, event.merchant.mid ? `MID ${event.merchant.mid}` : ''].filter(Boolean).join(' · '))}</span>
      </button>
    `;
  };

  if (state.calendarMode === 'list') {
    el.calendarTitle.textContent = 'Calendar List';
    let currentDate = '';
    el.calendarList.className = 'calendar-list calendar-list-mode';
    el.calendarList.innerHTML = events.map((event) => {
      const heading = event.dateKey !== currentDate ? `<h4>${escapeHtml(formatInstallationDateForTemplate(event.dateKey))}</h4>` : '';
      currentDate = event.dateKey;
      return `${heading}${eventButton(event)}`;
    }).join('');
    return;
  }

  if (state.calendarMode === 'day') {
    const dateKey = localDateKey(state.calendarDate);
    el.calendarTitle.textContent = dayLabel(state.calendarDate);
    el.calendarList.className = 'calendar-list calendar-day-mode';
    el.calendarList.innerHTML = `
      <section class="calendar-day-card ${dateKey === todayKey ? 'today' : ''}">
        <h4>${escapeHtml(dayLabel(state.calendarDate))}</h4>
        ${(byDate[dateKey] || []).length ? byDate[dateKey].map((event) => eventButton(event)).join('') : '<div class="empty">No scheduled items.</div>'}
      </section>
    `;
    return;
  }

  const days = [];
  if (state.calendarMode === 'week') {
    const start = startOfWeek(state.calendarDate);
    for (let index = 0; index < 7; index += 1) days.push(addDays(start, index));
    el.calendarTitle.textContent = `${formatInstallationDateForTemplate(localDateKey(days[0]))} - ${formatInstallationDateForTemplate(localDateKey(days[6]))}`;
  } else {
    const firstOfMonth = new Date(state.calendarDate.getFullYear(), state.calendarDate.getMonth(), 1);
    const start = startOfWeek(firstOfMonth);
    for (let index = 0; index < 42; index += 1) days.push(addDays(start, index));
    el.calendarTitle.textContent = monthLabel(state.calendarDate);
  }

  const gridClass = state.calendarMode === 'week' ? 'calendar-days week-grid-view' : 'calendar-days month-grid-view';
  el.calendarList.className = 'calendar-list calendar-shell';
  el.calendarList.innerHTML = `
    <div class="calendar-weekdays">${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => `<div class="calendar-weekday">${day}</div>`).join('')}</div>
    <div class="${gridClass}">
      ${days.map((date) => {
        const dateKey = localDateKey(date);
        const dayEvents = byDate[dateKey] || [];
        const isOutsideMonth = state.calendarMode === 'month' && date.getMonth() !== state.calendarDate.getMonth();
        return `
          <section class="calendar-cell ${dateKey === todayKey ? 'today' : ''} ${isOutsideMonth ? 'outside-month' : ''}">
            <div class="calendar-cell-date">${date.getDate()}</div>
            <div class="calendar-cell-events">
              ${dayEvents.map((event) => eventButton(event, true)).join('') || ''}
            </div>
          </section>
        `;
      }).join('')}
    </div>
  `;
}

function renderBulkBar() {
  pruneSelectedMerchants();
  const count = state.selectedIds.size;
  el.bulkBar.classList.toggle('hidden', !state.editMode || count === 0);
  el.bulkCount.textContent = `${count} selected`;
  el.bulkStageSelect.innerHTML = allStages().map((stage) => `<option value="${escapeHtml(stage)}">${escapeHtml(stage)}</option>`).join('');
  el.bulkTaskSelect.innerHTML = allTasks().map((taskName) => `<option value="${escapeHtml(taskName)}">${escapeHtml(taskName)}</option>`).join('');
  el.bulkTypeSelect.innerHTML = allTypes()
    .map((programmingType) => `<option value="${escapeHtml(programmingType)}">${escapeHtml(programmingTypeLabel(programmingType))}</option>`)
    .join('');
}

function renderStageKanban() {
  const merchants = visibleMerchants();
  el.stageKanbanView.innerHTML = visibleStages().map((stage) => {
    const cards = sortMerchants(merchants.filter((merchant) => normalizeStage(merchant.stage) === stage));
    return `
      <section class="stage-column" data-drop-field="stage" data-drop-value="${escapeHtml(stage)}">
        <div class="stage-header">
          ${state.editMode ? `<input class="column-select" type="checkbox" data-select-column-field="stage" data-select-column-value="${escapeHtml(stage)}" title="Select all in ${escapeHtml(stage)}" />` : ''}
          <span class="stage-title" ${state.editMode ? 'draggable="true"' : ''} data-stage-name="${escapeHtml(stage)}">${escapeHtml(stage)}</span>
          <span>${cards.length}</span>
        </div>
        ${cards.length ? cards.map(renderCard).join('') : '<div class="empty">No merchants</div>'}
      </section>
    `;
  }).join('');
}

function renderTaskKanban() {
  const merchants = visibleMerchants();
  el.taskKanbanView.innerHTML = visibleTasks().map((taskName) => {
    const taskSort = state.taskSorts[taskName] || 'none';
    const cards = sortMerchants(merchants.filter((merchant) => normalizeTask(merchant.taskName) === taskName), taskSort);
    const isHiddenTask = state.hiddenTasks.includes(taskName);
    return `
      <section class="stage-column ${isHiddenTask ? 'hidden-task-column' : ''}" data-drop-field="taskName" data-drop-value="${escapeHtml(taskName)}">
        <div class="stage-header task-header">
          ${state.editMode ? `<input class="column-select" type="checkbox" data-select-column-field="taskName" data-select-column-value="${escapeHtml(taskName)}" title="Select all in ${escapeHtml(taskName)}" />` : ''}
          <span class="task-title" ${state.editMode ? 'draggable="true"' : ''} data-task-name="${escapeHtml(taskName)}" title="Drag to reorder in Edit mode">${escapeHtml(taskName)}</span>
          <span class="stage-actions">
            <span>${cards.length}</span>
            <select class="task-sort" data-task-sort="${escapeHtml(taskName)}" title="Sort ${escapeHtml(taskName)}">
              <option value="none" ${taskSort === 'none' ? 'selected' : ''}>Default</option>
              <option value="alpha-asc" ${taskSort === 'alpha-asc' ? 'selected' : ''}>A-Z</option>
              <option value="alpha-desc" ${taskSort === 'alpha-desc' ? 'selected' : ''}>Z-A</option>
              <option value="life-asc" ${taskSort === 'life-asc' ? 'selected' : ''}>Life Cycle ↑</option>
              <option value="life-desc" ${taskSort === 'life-desc' ? 'selected' : ''}>Life Cycle ↓</option>
              <option value="install-asc" ${taskSort === 'install-asc' ? 'selected' : ''}>Install ↑</option>
              <option value="install-desc" ${taskSort === 'install-desc' ? 'selected' : ''}>Install ↓</option>
            </select>
            <button class="header-button" type="button" ${isHiddenTask ? `data-show-task="${escapeHtml(taskName)}"` : `data-hide-task="${escapeHtml(taskName)}"`}>${isHiddenTask ? 'Unhide' : 'Hide'}</button>
          </span>
        </div>
        ${cards.length ? cards.map(renderCard).join('') : '<div class="empty">No merchants</div>'}
      </section>
    `;
  }).join('');
}

function renderProgrammingKanban() {
  const merchants = visibleMerchants();
  el.programmingKanbanView.innerHTML = allTypes().map((programmingType) => {
    const label = programmingTypeLabel(programmingType);
    const cards = sortMerchants(merchants.filter((merchant) => normalizeProgrammingType(merchant.programmingType) === programmingType));
    return `
      <section class="stage-column" data-drop-field="programmingType" data-drop-value="${escapeHtml(programmingType)}">
        <div class="stage-header">
          ${state.editMode ? `<input class="column-select" type="checkbox" data-select-column-field="programmingType" data-select-column-value="${escapeHtml(programmingType)}" title="Select all in ${escapeHtml(label)}" />` : ''}
          <span class="type-title" ${state.editMode ? 'draggable="true"' : ''} data-type-name="${escapeHtml(programmingType)}">${escapeHtml(label)}</span>
          <span>${cards.length}</span>
        </div>
        ${cards.length ? cards.map(renderCard).join('') : '<div class="empty">No merchants</div>'}
      </section>
    `;
  }).join('');
}

function renderCard(merchant) {
  const isSelected = state.selectedIds.has(merchant.id);
  const showField = (field) => state.cardFields.includes(field);
  const installText = formatCardDateTime(merchant.installationDate) || 'Not set';
  const lifeCycle = calculateOrderLifeCycle(merchant.orderStartDate, merchant.installationDate);
  const accountStatus = displayedAccountStatus(merchant.accountStatus, merchant.taskName);
  const statusClass = accountStatusClass(accountStatus);
  return `
    <article class="card ${state.cardDensity === 'compact' ? 'compact-card' : ''} ${merchant.id === state.selectedId ? 'active' : ''} ${isSelected ? 'selected' : ''}" data-id="${merchant.id}" draggable="${canWrite()}">
      ${state.editMode ? `<label class="card-select"><input type="checkbox" data-select-id="${merchant.id}" ${isSelected ? 'checked' : ''} />Select</label>` : ''}
      <div class="card-meta">
        <span class="card-task">${escapeHtml(merchant.taskName || 'No task name')}</span>
        ${showField('install') ? `<span title="Installation Date">Install: ${escapeHtml(installText)}</span>` : ''}
      </div>
      <div class="card-title">
        <h3>${escapeHtml(merchant.dbaName || merchant.merchantName || 'Unnamed merchant')}</h3>
      </div>
      ${showField('mid') ? `<p>MID: ${escapeHtml(merchant.mid || 'N/A')}</p>` : ''}
      ${showField('lifeCycle') ? `<p>Life Cycle: ${escapeHtml(lifeCycle || 'Not set')}</p>` : ''}
      ${showField('programmingType') ? `<p>${escapeHtml(programmingTypeLabel(merchant.programmingType))}</p>` : ''}
      ${showField('welcomeEmail') ? `<label class="welcome-email-check">
        <input type="checkbox" data-welcome-email-id="${merchant.id}" ${merchant.welcomeEmailSent ? 'checked' : ''} ${state.readOnly ? 'disabled' : ''} title="Welcome Email" aria-label="Welcome Email" />
        ${merchant.welcomeEmailSent ? '<strong>Sent</strong>' : ''}
      </label>` : ''}
      ${accountStatus ? `<span class="account-status-badge card-account-status ${statusClass}" title="Account Status">${escapeHtml(accountStatus)}</span>` : ''}
    </article>
  `;
}

function renderList() {
  const merchants = sortMerchants(visibleMerchants());
  if (!merchants.length) {
    el.listView.innerHTML = '<div class="empty">No merchants match the current search.</div>';
    return;
  }

  el.listView.innerHTML = `
    <table>
      <thead>
        <tr>
          ${state.editMode ? '<th>Select</th>' : ''}
          <th>DBA</th>
          <th>MID</th>
          <th>Task</th>
          <th>Stage</th>
          <th>Start Date</th>
          <th>Installation</th>
          <th>Life Cycle</th>
          <th>Programming</th>
          <th>Merchant Email</th>
          <th>Sales Rep</th>
        </tr>
      </thead>
      <tbody>
        ${merchants.map((merchant) => `
          <tr data-id="${merchant.id}">
            ${state.editMode ? `<td><input class="list-select" type="checkbox" data-select-id="${merchant.id}" ${state.selectedIds.has(merchant.id) ? 'checked' : ''} /></td>` : ''}
            <td>${escapeHtml(merchant.dbaName)}</td>
            <td>${escapeHtml(merchant.mid)}</td>
            <td>${escapeHtml(merchant.taskName)}</td>
            <td>${escapeHtml(merchant.stage)}</td>
            <td>${escapeHtml(merchant.orderStartDate)}</td>
            <td>${escapeHtml(formatDisplayDateTime(merchant.installationDate))}</td>
            <td>${escapeHtml(calculateOrderLifeCycle(merchant.orderStartDate, merchant.installationDate))}</td>
            <td>${escapeHtml(merchant.programmingType)}</td>
            <td>${escapeHtml(merchant.merchantEmail)}</td>
            <td>${escapeHtml(merchant.salesRepName)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function renderViews() {
  renderViewTabs();
  renderDisplayTools();
  renderStageOptions();
  renderTaskOptions();
  renderProgrammingTypeOptions();
  renderBulkBar();
  renderSummary();
  renderMerchantSnapshot();
  renderCalendar();
  renderStageKanban();
  renderTaskKanban();
  renderProgrammingKanban();
  renderList();
  el.stageKanbanView.classList.toggle('hidden', state.view !== 'stage-kanban');
  el.taskKanbanView.classList.toggle('hidden', state.view !== 'task-kanban');
  el.programmingKanbanView.classList.toggle('hidden', state.view !== 'programming-kanban');
  el.listView.classList.toggle('hidden', state.view !== 'list');
  renderEmail();
}

function setPanelOpen(isOpen) {
  document.body.classList.toggle('panel-open', isOpen);
  el.detailsPanel.classList.toggle('collapsed', !isOpen);
  el.workspaceResizer.classList.toggle('hidden', !isOpen);
  el.detailsPanel.setAttribute('aria-hidden', String(!isOpen));
}

function setPanelTab(tabName) {
  state.panelTab = tabName;
  orderEl.clientInfoTab.classList.toggle('hidden', tabName !== 'clientInfo');
  orderEl.orderInfoTab.classList.toggle('hidden', tabName !== 'orderInfo');
  orderEl.accountNotesTab.classList.toggle('hidden', tabName !== 'accountNotes');
  orderEl.emailTemplatesTab.classList.toggle('hidden', tabName !== 'emailTemplates');
  orderEl.contactsTab.classList.toggle('hidden', tabName !== 'contacts');
  orderEl.equipmentTab.classList.toggle('hidden', tabName !== 'equipment');
  orderEl.clientInfoTabBtn.classList.toggle('active', tabName === 'clientInfo');
  orderEl.orderInfoTabBtn.classList.toggle('active', tabName === 'orderInfo');
  orderEl.accountNotesTabBtn.classList.toggle('active', tabName === 'accountNotes');
  orderEl.emailTemplatesTabBtn.classList.toggle('active', tabName === 'emailTemplates');
  orderEl.contactsTabBtn.classList.toggle('active', tabName === 'contacts');
  orderEl.equipmentTabBtn.classList.toggle('active', tabName === 'equipment');
  if (tabName === 'orderInfo' || tabName === 'equipment') renderOrderEmail();
  if (tabName === 'equipment') renderEquipmentSummary();
}

function resetForm(openPanel = true) {
  state.selectedId = null;
  resetCopyButtons();
  markSaveButtonsDirty();
  el.formTitle.textContent = 'New Merchant';
  el.merchantForm.reset();
  fields.merchantId.value = '';
  fields.stage.value = 'Active';
  fields.taskName.value = 'CSM Approval';
  fields.menuPresentationDate.value = '';
  fields.menuPresentationTime.value = '';
  fields.installationDate.value = '';
  fields.installationTime.value = '';
  fields.goLiveDate.value = '';
  fields.orderLifeCycle.value = '';
  fields.programmingType.value = '';
  el.deleteMerchantMenuBtn.classList.remove('hidden');
  renderContacts([]);
  renderAccountNotes([]);
  orderEl.accountNoteInput.value = '';
  renderOrderInfo(defaultOrderInfo());
  renderEquipmentSummary();
  setDefaultTemplateForCurrentMerchant();
  if (openPanel) setPanelOpen(true);
  renderEmail();
  renderViews();
}

function fillForm(merchant, openPanel = true) {
  if (!merchant) return;
  resetCopyButtons();
  markSaveButtonsDirty();
  state.selectedId = merchant.id;
  el.formTitle.textContent = merchant.dbaName || 'Merchant Details';
  fields.merchantId.value = merchant.id || '';
  fields.dbaName.value = merchant.dbaName || '';
  fields.mid.value = merchant.mid || '';
  fields.accountStatus.value = automaticAccountStatus(merchant.accountStatus, merchant.taskName);
  fields.merchantName.value = merchant.merchantName || '';
  fields.merchantEmail.value = merchant.merchantEmail || '';
  fields.salesRepName.value = merchant.salesRepName || '';
  fields.salesRepEmail.value = merchant.salesRepEmail || '';
  fields.taskName.value = normalizeTask(merchant.taskName);
  fields.stage.value = normalizeStage(merchant.stage);
  fields.orderStartDate.value = normalizeDateInput(merchant.orderStartDate);
  fields.menuPresentationDate.value = installationDatePart(merchant.menuPresentationDate);
  fields.menuPresentationTime.value = installationTimePart(merchant.menuPresentationDate);
  fields.installationDate.value = installationDatePart(merchant.installationDate);
  fields.installationTime.value = installationTimePart(merchant.installationDate);
  fields.goLiveDate.value = normalizeDateInput(merchant.goLiveDate);
  fields.orderLifeCycle.value = calculateOrderLifeCycle(fields.orderStartDate.value, combinedInstallationDateTime());
  fields.programmingType.value = normalizeProgrammingType(merchant.programmingType);
  fields.lastNote.value = merchant.lastNote || '';
  el.deleteMerchantMenuBtn.classList.toggle('hidden', merchant.recordSource !== 'manual');
  renderContacts(contactsForMerchant(merchant));
  renderAccountNotes(merchant.accountNotes || []);
  orderEl.accountNoteInput.value = '';
  renderOrderInfo(merchant.orderInfo || defaultOrderInfo());
  renderEquipmentSummary();
  setDefaultTemplateForCurrentMerchant();
  if (openPanel) setPanelOpen(true);
  renderEmail();
  renderViews();
}

function normalizeDateInput(value) {
  const match = String(value || '').match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : '';
}

function normalizeDateTimeInput(value) {
  const text = String(value || '');
  const dateTimeMatch = text.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  if (dateTimeMatch) return dateTimeMatch[0];
  const dateMatch = text.match(/\d{4}-\d{2}-\d{2}/);
  return dateMatch ? `${dateMatch[0]}T00:00` : '';
}

function localDateKey(date) {
  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateFromKey(dateKey) {
  const normalized = normalizeDateInput(dateKey);
  if (!normalized) return new Date();
  const [year, month, day] = normalized.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, days) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date) {
  return addDays(date, -date.getDay());
}

function monthLabel(date) {
  return date.toLocaleDateString([], { month: 'long', year: 'numeric' });
}

function dayLabel(date) {
  return date.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
}

function normalizeInstallationValue(value) {
  const text = String(value || '');
  const dateTimeMatch = text.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  if (dateTimeMatch) return dateTimeMatch[0];
  return normalizeDateInput(text);
}

function normalizeTimeInput(value) {
  const match = String(value || '').match(/\d{2}:\d{2}/);
  return match ? match[0] : '';
}

function installationDatePart(value) {
  return normalizeDateInput(value);
}

function installationTimePart(value) {
  return normalizeTimeInput(value);
}

function combineDateAndTime(dateValue, timeValue) {
  const date = normalizeDateInput(dateValue);
  if (!date) return '';
  const time = normalizeTimeInput(timeValue);
  return time ? `${date}T${time}` : date;
}

function combinedInstallationDateTime() {
  return combineDateAndTime(fields.installationDate.value, fields.installationTime.value);
}

function combinedMenuPresentationDateTime() {
  return combineDateAndTime(fields.menuPresentationDate.value, fields.menuPresentationTime.value);
}

function formatDisplayDateTime(value) {
  const hasTime = String(value || '').includes('T');
  const normalized = normalizeDateTimeInput(value);
  if (!normalized) return '';
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return normalized;
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  if (!hasTime) return date.toLocaleDateString([], options);
  return date.toLocaleString([], {
    ...options,
    hour: 'numeric',
    minute: '2-digit'
  });
}

function formatCardDateTime(value) {
  const normalized = normalizeDateTimeInput(value);
  if (!normalized) return '';
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return '';
  const datePart = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
  if (!String(value || '').includes('T')) return datePart;
  return `${datePart} ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
}

function formatInstallationDateForTemplate(installationDate) {
  const normalized = normalizeDateInput(installationDate);
  if (!normalized) return '';
  const date = new Date(`${normalized}T00:00`);
  if (Number.isNaN(date.getTime())) return normalized;
  return date.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function calculateOrderLifeCycle(orderStartDate, installationDate) {
  const start = normalizeDateInput(orderStartDate);
  if (!start) return '';
  const startDate = new Date(`${start}T00:00`);
  const install = normalizeDateTimeInput(installationDate);
  const endDate = install ? new Date(install) : new Date();
  endDate.setHours(0, 0, 0, 0);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return '';
  const days = Math.floor((endDate - startDate) / 86400000);
  if (days < 0) return '';
  return `${days} ${days === 1 ? 'day' : 'days'}`;
}

function formMerchant() {
  const existing = selectedMerchant();
  const installationDateTime = combinedInstallationDateTime();
  const menuPresentationDateTime = combinedMenuPresentationDateTime();
  const taskName = normalizeTask(fields.taskName.value);
  const contacts = readContacts();
  const owner = contactByType(contacts, 'Owner') || contacts[0] || {};
  const rep = contactByType(contacts, 'Rep') || {};
  return {
    ...(existing || {}),
    id: fields.merchantId.value || undefined,
    recordSource: existing?.recordSource || 'manual',
    dbaName: fields.dbaName.value.trim(),
    mid: fields.mid.value.trim(),
    accountStatus: automaticAccountStatus(fields.accountStatus.value, taskName),
    merchantName: owner.name || fields.merchantName.value.trim(),
    merchantEmail: owner.email || fields.merchantEmail.value.trim(),
    salesRepName: rep.name || fields.salesRepName.value.trim(),
    salesRepEmail: rep.email || fields.salesRepEmail.value.trim(),
    taskName,
    stage: stageForTask(taskName, fields.stage.value),
    orderStartDate: fields.orderStartDate.value,
    menuPresentationDate: menuPresentationDateTime,
    installationDate: installationDateTime,
    goLiveDate: fields.goLiveDate.value,
    programmingType: normalizeProgrammingType(fields.programmingType.value),
    lastNote: fields.lastNote.value.trim(),
    contacts,
    accountNotes: validAccountNotes(existing?.accountNotes || []),
    orderInfo: readOrderInfo()
  };
}

function tokenValues() {
  const merchant = formMerchant();
  return {
    ...merchant,
    merchantName: merchant.merchantName,
    merchantFirstName: firstName(merchant.merchantName),
    salesRepName: merchant.salesRepName || 'there',
    customNote: el.customNote.value.trim(),
    csmName: state.csmName
  };
}

function buildBlankOrderConfirmationEmail(values) {
  const info = orderInfoWithDefaults(readOrderInfo());
  const advantage = info.surcharges.find((item) => item.name === 'Advantage Program') || {};
  const rate = advantage.percentage ? `${advantage.percentage}%` : '%';
  const type = advantage.type && advantage.type !== 'None' ? ` (${advantage.type})` : ' ()';
  const equipment = selectedEquipment(info);
  const equipmentHtml = equipment.length
    ? equipment.map((item) => `${escapeHtml(item.name)}: ${escapeHtml(item.qty)}`).join('<br>')
    : EQUIPMENT_TYPES.map((item) => `${escapeHtml(item)}:`).join('<br>');
  const equipmentText = equipment.length
    ? equipment.map((item) => `${item.name}: ${item.qty}`).join('\n')
    : EQUIPMENT_TYPES.map((item) => `${item}:`).join('\n');
  const shippingAddress = info.shippingDifferent ? info.shippingAddress : info.businessAddress;
  const date = formatInstallationDateForTemplate(values.installationDate) || '[Date]';
  const html = `Hello,<br><br>
We are writing to confirm that we have received your order for the Shift4 Dine POS system for ${escapeHtml(values.dbaName)} ${escapeHtml(values.mid ? `(${values.mid})` : '')}. The order was requested to be programmed and installed by Sales Partner ${escapeHtml(values.salesRepName)}.<br><br>
The Advantage Program Rate has been set up at: ${escapeHtml(rate)}${escapeHtml(type)}<br><br>
Here are the details of the equipment on the order:<br><br>
${equipmentHtml}<br><br>
The equipment is being shipped to the following address:<br><br>
${escapeHtml(shippingAddress || 'Address')}<br><br>
We have forwarded this order to our Deployment department, and the equipment is expected to arrive by ${escapeHtml(date)}.<br><br>
Please find some additional resources below regarding Shift4 Dine.<br><br>
${htmlLink(TEMPLATE_LINKS['Offline Mode Overview and FAQs'])}<br>
${htmlLink(TEMPLATE_LINKS['Resource Center'])}<br><br>
Thank you for your order.<br><br>
Best regards,`;
  const text = `Hello,\n\nWe are writing to confirm that we have received your order for the Shift4 Dine POS system for ${values.dbaName} ${values.mid ? `(${values.mid})` : ''}. The order was requested to be programmed and installed by Sales Partner ${values.salesRepName}.\n\nThe Advantage Program Rate has been set up at: ${rate}${type}\n\nHere are the details of the equipment on the order:\n\n${equipmentText}\n\nThe equipment is being shipped to the following address:\n\n${shippingAddress || 'Address'}\n\nWe have forwarded this order to our Deployment department, and the equipment is expected to arrive by ${date}.\n\nPlease find some additional resources below regarding Shift4 Dine.\n\n${textLink(TEMPLATE_LINKS['Offline Mode Overview and FAQs'])}\n${textLink(TEMPLATE_LINKS['Resource Center'])}\n\nThank you for your order.\n\nBest regards,`;
  return { html: normalizeClipboardHtml(html), text: trimClipboardText(text) };
}

function renderEmail() {
  const template = TEMPLATES[Number(el.templateSelect.value || 0)];
  const isAccountHold = template.name === 'Account on Hold';
  el.customNoteWrap.classList.toggle('hidden', !isAccountHold);
  el.subjectOutput.value = renderSubject(SUBJECT_TEMPLATES[template.name] || '');
  const values = tokenValues();
  if (template.name === 'Blank Order Confirmation') {
    const generated = buildBlankOrderConfirmationEmail(values);
    el.emailOutput.innerHTML = generated.html;
    el.emailOutput.dataset.text = generated.text;
    el.emailOutput.dataset.html = generated.html;
    return;
  }
  let templateBody = template.body.replace(/^Hello \{Merchant Name\}/, 'Hello {Merchant First Name}');
  if (isAccountHold && values.customNote) {
    templateBody = templateBody.replace(
      'following:\n\n\n\nIf you can submit',
      'following:\n\n__CUSTOM_ACCOUNT_NOTE__\n\nIf you can submit'
    );
  }
  const replacements = {
    'Merchant Name': values.merchantName,
    'Merchant First Name': values.merchantFirstName,
    "Merchant's Name": values.merchantName,
    DBA: values.dbaName,
    'DBA Name': values.dbaName,
    MID: values.mid,
    '(MID)': values.mid ? `(${values.mid})` : '',
    'Rep Name': values.salesRepName,
    Date: formatInstallationDateForTemplate(values.installationDate) || ''
  };
  const text = templateBody.replace(/\{([^{}]+)\}/g, (_match, key) => {
    const link = TEMPLATE_LINKS[key];
    if (link) return `${link.label}: ${link.url}`;
    return replacements[key] || '';
  }).replace('__CUSTOM_ACCOUNT_NOTE__', `"${values.customNote}"`);
  const html = escapeHtml(templateBody).replace(/\{([^{}]+)\}/g, (_match, key) => {
    const link = TEMPLATE_LINKS[key];
    if (link) return `<a href="${escapeHtml(link.url)}">${escapeHtml(link.label)}</a>`;
    return escapeHtml(replacements[key] || '');
  }).replace('__CUSTOM_ACCOUNT_NOTE__', `<em>"${escapeHtml(values.customNote)}"</em>`)
    .replace(/\n/g, '<br>');
  el.emailOutput.innerHTML = html;
  el.emailOutput.dataset.text = trimClipboardText(text);
  el.emailOutput.dataset.html = normalizeClipboardHtml(html);
}

async function refreshAuthStatus() {
  try {
    const status = await window.crm.authStatus();
    state.readOnly = Boolean(status.readOnly);
    state.accounts = status.accounts || [];
    state.activeAccountOwnerId = status.activeAccountOwnerId || '';
    if (state.readOnly) state.editMode = false;
    el.syncStatus.textContent = status.signedIn ? (status.readOnly ? 'Read-only' : 'Online') : 'Signed Out';
    el.brandUser.textContent = status.signedIn ? status.email : '';
    el.signOutBtn.title = status.signedIn ? `Signed in as ${status.email}` : '';
    el.authGate.classList.toggle('hidden', status.signedIn && status.approved);
    el.authMessage.textContent = status.signedIn && !status.approved
      ? 'Your email is verified. This account is waiting for owner approval.'
      : 'New accounts require email verification and owner approval. After verifying, return here to sign in.';
    el.authEmail.classList.toggle('hidden', status.signedIn);
    el.authPassword.classList.toggle('hidden', status.signedIn);
    el.signInBtn.classList.toggle('hidden', status.signedIn);
    el.signUpBtn.classList.toggle('hidden', status.signedIn);
    el.authSignOutBtn.classList.toggle('hidden', !status.signedIn);
    el.signOutBtn.classList.toggle('hidden', !status.signedIn);
    el.manageUsersBtn.classList.toggle('hidden', !status.isAdmin);
    renderAccountSwitcher();
    syncReadOnlyControls();
    return status;
  } catch (error) {
    console.error(error);
    state.readOnly = false;
    state.accounts = [];
    state.activeAccountOwnerId = '';
    el.syncStatus.textContent = 'Local Mode';
    renderAccountSwitcher();
    return { signedIn: false, source: 'Local' };
  }
}

async function load() {
  const authStatus = await refreshAuthStatus();
  if (!authStatus.signedIn || !authStatus.approved) {
    state.merchants = [];
    setPanelOpen(false);
    renderViews();
    return;
  }
  const loaded = await window.crm.loadMerchants();
  const compacted = compactMerchants(loaded);
  state.merchants = compacted.map((merchant) => ({
    ...merchant,
    recordSource: merchant.recordSource || 'import',
    merchantName: cleanKey(merchant.merchantName) === cleanKey(merchant.dbaName) ? '' : merchant.merchantName,
    stage: stageForTask(merchant.taskName, merchant.stage),
    taskName: normalizeTask(merchant.taskName),
    accountStatus: automaticAccountStatus(merchant.accountStatus, merchant.taskName),
    menuPresentationDate: normalizeInstallationValue(merchant.menuPresentationDate),
    installationDate: normalizeInstallationValue(merchant.installationDate),
    goLiveDate: normalizeDateInput(merchant.goLiveDate),
    programmingType: normalizeProgrammingType(merchant.programmingType),
    contacts: contactsForMerchant(merchant),
    accountNotes: validAccountNotes(merchant.accountNotes)
  }));
  const needsSave = state.merchants.length !== loaded.length
    || state.merchants.some((merchant, index) => merchant.stage !== compacted[index]?.stage)
    || state.merchants.some((merchant, index) => merchant.taskName !== compacted[index]?.taskName)
    || state.merchants.some((merchant, index) => merchant.accountStatus !== compacted[index]?.accountStatus)
    || state.merchants.some((merchant, index) => merchant.menuPresentationDate !== compacted[index]?.menuPresentationDate)
    || state.merchants.some((merchant, index) => merchant.installationDate !== compacted[index]?.installationDate)
    || state.merchants.some((merchant, index) => merchant.goLiveDate !== compacted[index]?.goLiveDate)
    || state.merchants.some((merchant, index) => merchant.programmingType !== compacted[index]?.programmingType)
    || state.merchants.some((merchant, index) => merchant.merchantName !== compacted[index]?.merchantName)
    || state.merchants.some((merchant, index) => JSON.stringify(merchant.contacts) !== JSON.stringify(contactsForMerchant(compacted[index] || {})))
    || state.merchants.some((merchant, index) => JSON.stringify(merchant.accountNotes) !== JSON.stringify(validAccountNotes(compacted[index]?.accountNotes)));
  if (needsSave && !authStatus.readOnly) {
    state.merchants = await window.crm.saveMerchants(state.merchants);
  }
  renderTemplates();
  renderStageOptions();
  resetForm(false);
  setPanelOpen(false);
  renderViews();
}

async function importRows(rows) {
  if (blockReadOnly()) return;
  const beforeImport = compactMerchants([...state.merchants]);
  const normalizedRows = rows.map((merchant) => ({
    ...merchant,
    stage: normalizeStage(merchant.stage),
    taskName: normalizeTask(merchant.taskName),
    accountStatus: automaticAccountStatus(merchant.accountStatus, merchant.taskName),
    menuPresentationDate: normalizeInstallationValue(merchant.menuPresentationDate),
    installationDate: normalizeInstallationValue(merchant.installationDate),
    goLiveDate: normalizeDateInput(merchant.goLiveDate),
    programmingType: normalizeProgrammingType(merchant.programmingType),
    contacts: contactsForMerchant(merchant),
    accountNotes: validAccountNotes(merchant.accountNotes)
  })).map((merchant) => ({
    ...merchant,
    stage: stageForTask(merchant.taskName, merchant.stage)
  }));
  const nextMerchants = mergeImportedMerchants(beforeImport, normalizedRows);
  localStorage.setItem('lastImportUndo', JSON.stringify({
    createdAt: new Date().toISOString(),
    importedRows: rows.length,
    before: beforeImport
  }));
  state.merchants = await window.crm.saveMerchants(nextMerchants);
  renderViews();
  showToast(`Imported ${rows.length} merchant rows. Use Undo Last Import if this was wrong.`);
}

async function undoLastImport() {
  if (blockReadOnly()) return;
  const raw = localStorage.getItem('lastImportUndo');
  if (!raw) {
    showToast('No import backup is available.');
    return;
  }
  let backup;
  try {
    backup = JSON.parse(raw);
  } catch {
    showToast('Import backup could not be read.');
    return;
  }
  const count = backup.before?.length || 0;
  if (!backup.before || !confirm(`Undo the last import and restore ${count} merchants from before the import?`)) return;
  state.selectedIds.clear();
  state.merchants = await window.crm.saveMerchants(backup.before);
  localStorage.removeItem('lastImportUndo');
  resetForm(false);
  setPanelOpen(false);
  renderViews();
  showToast(`Last import undone. Restored ${count} merchants.`);
}

async function deleteMerchant(merchantId) {
  if (blockReadOnly()) return;
  if (!merchantId) return;
  const merchant = state.merchants.find((item) => item.id === merchantId);
  const label = merchant?.dbaName || merchant?.merchantName || 'this merchant';
  if (!confirm(`Delete ${label} from the CRM?`)) return;
  state.merchants = await window.crm.deleteMerchant(merchantId);
  state.selectedIds.delete(merchantId);
  if (state.selectedId === merchantId) resetForm();
  else renderViews();
  showToast('Merchant deleted.');
}

async function moveMerchantToStage(merchantId, stage) {
  if (blockReadOnly()) return;
  const nextStage = normalizeStage(stage);
  const merchant = state.merchants.find((item) => item.id === merchantId);
  if (!merchant || normalizeStage(merchant.stage) === nextStage) return;
  merchant.stage = nextStage;
  merchant.taskName = nextStage === 'Completed'
    ? 'Completed'
    : nextStage === 'Cancelled'
      ? 'Cancelled'
      : ['Completed', 'Cancelled'].includes(normalizeTask(merchant.taskName))
        ? 'CSM Approval'
        : normalizeTask(merchant.taskName);
  merchant.updatedAt = new Date().toISOString();
  state.merchants = await window.crm.saveMerchants(state.merchants);
  renderViews();
  showToast(`${merchant.dbaName || merchant.merchantName || 'Merchant'} moved to ${nextStage}.`);
}

async function moveMerchantToTask(merchantId, taskName) {
  if (blockReadOnly()) return;
  const nextTask = normalizeTask(taskName);
  const merchant = state.merchants.find((item) => item.id === merchantId);
  if (!merchant || normalizeTask(merchant.taskName) === nextTask) return;
  merchant.taskName = nextTask;
  merchant.stage = stageForTask(nextTask, merchant.stage);
  merchant.accountStatus = automaticAccountStatus(merchant.accountStatus, nextTask);
  merchant.updatedAt = new Date().toISOString();
  state.merchants = await window.crm.saveMerchants(state.merchants);
  renderViews();
  showToast(`${merchant.dbaName || merchant.merchantName || 'Merchant'} moved to ${nextTask}.`);
}

async function moveMerchantToProgrammingType(merchantId, programmingType) {
  if (blockReadOnly()) return;
  const nextProgrammingType = normalizeProgrammingType(programmingType);
  const merchant = state.merchants.find((item) => item.id === merchantId);
  if (!merchant || normalizeProgrammingType(merchant.programmingType) === nextProgrammingType) return;
  merchant.programmingType = nextProgrammingType;
  merchant.updatedAt = new Date().toISOString();
  state.merchants = await window.crm.saveMerchants(state.merchants);
  renderViews();
  showToast(`${merchant.dbaName || merchant.merchantName || 'Merchant'} moved to ${programmingTypeLabel(nextProgrammingType)}.`);
}

async function moveMerchant(merchantId, field, value) {
  if (field === 'stage') {
    await moveMerchantToStage(merchantId, value);
    return;
  }
  if (field === 'taskName') {
    await moveMerchantToTask(merchantId, value);
    return;
  }
  if (field === 'programmingType') {
    await moveMerchantToProgrammingType(merchantId, value);
  }
}

async function toggleWelcomeEmailSent(merchantId, isSent) {
  if (blockReadOnly()) return;
  const merchant = state.merchants.find((item) => item.id === merchantId);
  if (!merchant) return;
  merchant.welcomeEmailSent = isSent;
  merchant.updatedAt = new Date().toISOString();
  state.merchants = await window.crm.saveMerchants(state.merchants);
  renderViews();
}

function selectedIdsArray() {
  return [...state.selectedIds].filter((merchantId) => state.merchants.some((merchant) => merchant.id === merchantId));
}

async function bulkUpdate(field, value) {
  if (blockReadOnly()) return;
  const merchantIds = selectedIdsArray();
  if (!merchantIds.length) return;
  const now = new Date().toISOString();
  const normalizers = {
    stage: normalizeStage,
    taskName: normalizeTask,
    programmingType: normalizeProgrammingType
  };
  const normalize = normalizers[field];
  if (!normalize) return;
  const nextValue = normalize(value);
  state.merchants = state.merchants.map((merchant) => (
    merchantIds.includes(merchant.id)
      ? {
          ...merchant,
          [field]: nextValue,
          ...(field === 'taskName' ? { stage: stageForTask(nextValue, merchant.stage) } : {}),
          ...(field === 'stage' && nextValue === 'Completed' ? { taskName: 'Completed' } : {}),
          ...(field === 'stage' && nextValue === 'Cancelled' ? { taskName: 'Cancelled' } : {}),
          ...(field === 'stage' && !['Completed', 'Cancelled'].includes(nextValue) && ['Completed', 'Cancelled'].includes(normalizeTask(merchant.taskName)) ? { taskName: 'CSM Approval' } : {}),
          updatedAt: now
        }
      : merchant
  ));
  state.merchants = await window.crm.saveMerchants(state.merchants);
  if (state.selectedId && state.selectedIds.has(state.selectedId)) {
    const selected = selectedMerchant();
    if (selected) fillForm(selected, false);
  }
  renderViews();
  showToast(`${merchantIds.length} merchant${merchantIds.length === 1 ? '' : 's'} updated.`);
}

async function bulkDelete() {
  if (blockReadOnly()) return;
  const selected = selectedIdsArray();
  const merchantIds = selected.filter((merchantId) => state.merchants.find((merchant) => merchant.id === merchantId)?.recordSource === 'manual');
  const protectedCount = selected.length - merchantIds.length;
  if (!merchantIds.length) {
    showToast('Imported accounts cannot be deleted. Use Undo Last Import.');
    return;
  }
  if (!confirm(`Delete ${merchantIds.length} manually added merchant${merchantIds.length === 1 ? '' : 's'}?`)) return;
  const deleteIds = new Set(merchantIds);
  state.merchants = state.merchants.filter((merchant) => !deleteIds.has(merchant.id));
  state.merchants = await window.crm.saveMerchants(state.merchants);
  state.selectedIds.clear();
  if (state.selectedId && deleteIds.has(state.selectedId)) resetForm(false);
  renderViews();
  showToast(`${merchantIds.length} merchant${merchantIds.length === 1 ? '' : 's'} deleted.${protectedCount ? ` ${protectedCount} imported account${protectedCount === 1 ? '' : 's'} kept.` : ''}`);
}

function toggleAppMenu(isOpen = el.appMenu.classList.contains('hidden')) {
  el.appMenu.classList.toggle('hidden', !isOpen);
  el.appMenuBtn.setAttribute('aria-expanded', String(isOpen));
}

function closeAppMenu() {
  toggleAppMenu(false);
}

el.appMenuBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleAppMenu();
});

darkModeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
  localStorage.setItem('theme', nextTheme);
  applyTheme();
});

document.addEventListener('click', (event) => {
  if (event.target.closest('.menu-wrap')) return;
  closeAppMenu();
  closeMerchantMenu();
});

el.importBtn.addEventListener('click', async () => {
  if (blockReadOnly()) return;
  closeAppMenu();
  const result = await window.crm.importExcel();
  if (!result) return;
  await importRows(result.rows);
});

el.undoImportBtn.addEventListener('click', async () => {
  if (blockReadOnly()) return;
  closeAppMenu();
  await undoLastImport();
});

el.hiddenTasksBtn.addEventListener('click', () => {
  closeAppMenu();
  if (!state.hiddenTasks.length) {
    showToast('No hidden task tiles.');
    return;
  }
  state.showHiddenTasks = !state.showHiddenTasks;
  renderViews();
});

el.dataFolderBtn.addEventListener('click', () => {
  closeAppMenu();
  window.crm.openDataFolder();
});

el.checkUpdatesBtn.addEventListener('click', () => {
  closeAppMenu();
  window.crm.checkForUpdates();
});

window.crm.onUpdateStatus(({ message }) => {
  if (message) showToast(message);
});

async function authAction(action) {
  const email = el.authEmail.value.trim();
  const password = el.authPassword.value;
  if (!email || !password) {
    showToast('Enter your Supabase email and password.');
    return;
  }
  try {
    const result = await action(email, password);
    el.authPassword.value = '';
    await load();
    showToast(result.approved ? 'Supabase connected.' : 'Account created or signed in. Approval may still be pending.');
  } catch (error) {
    console.error(error);
    showToast(error.message || 'Supabase sign-in failed.');
  }
}

el.signInBtn.addEventListener('click', () => authAction(window.crm.signIn));
el.signUpBtn.addEventListener('click', () => authAction(window.crm.signUp));
el.signOutBtn.addEventListener('click', async () => {
  await window.crm.signOut();
  await load();
  showToast('Signed out.');
});
el.authSignOutBtn.addEventListener('click', () => el.signOutBtn.click());

async function renderUsers() {
  const users = await window.crm.listUsers();
  el.usersList.innerHTML = users.map((user) => `
    <div class="user-approval-row">
      <span><strong>${escapeHtml(user.email)}</strong>${user.is_admin ? '<small>Owner</small>' : ''}</span>
      <label><input type="checkbox" data-user-access="${escapeHtml(user.user_id)}" data-access-field="approved" ${user.approved ? 'checked' : ''} ${user.is_admin ? 'disabled' : ''} />Approved</label>
      <label><input type="checkbox" data-user-access="${escapeHtml(user.user_id)}" data-access-field="readOnly" ${user.read_only ? 'checked' : ''} ${user.is_admin ? 'disabled' : ''} />Read-only</label>
    </div>
  `).join('') || '<div class="empty">No users found.</div>';
}

async function renderShares() {
  const shares = await window.crm.listShares();
  el.sharesList.innerHTML = shares.length
    ? shares.map((share) => `
      <div class="user-approval-row">
        <span><strong>${escapeHtml(share.viewer_email)}</strong><small>${share.viewer_user_id ? 'Read-only' : 'Pending sign-up'}</small></span>
        <button class="secondary danger" type="button" data-remove-share="${escapeHtml(share.id)}">Remove</button>
      </div>
    `).join('')
    : '<div class="empty">No read-only supervisors invited yet.</div>';
}

el.manageUsersBtn.addEventListener('click', async () => {
  closeAppMenu();
  try {
    await renderUsers();
    el.usersDialog.showModal();
  } catch (error) {
    showToast(error.message || 'Could not load users. Run the latest Supabase setup SQL first.');
  }
});

el.usersList.addEventListener('change', async (event) => {
  const input = event.target.closest('[data-user-access]');
  if (!input) return;
  const row = input.closest('.user-approval-row');
  const userId = input.dataset.userAccess;
  const access = {
    userId,
    approved: row.querySelector('[data-access-field="approved"]')?.checked,
    readOnly: row.querySelector('[data-access-field="readOnly"]')?.checked
  };
  try {
    await window.crm.setUserAccess(access);
    showToast(access.readOnly ? 'Read-only supervisor access saved.' : 'User access saved.');
  } catch (error) {
    input.checked = !input.checked;
    showToast(error.message || 'Could not update approval.');
  }
});

async function openShareAccessDialog() {
  closeAppMenu();
  if (blockReadOnly()) return;
  try {
    el.usersDialog.close();
    el.shareEmailInput.value = '';
    await renderShares();
    el.shareDialog.showModal();
  } catch (error) {
    showToast(error.message || 'Could not load shared access.');
  }
}

el.shareAccessBtn.addEventListener('click', openShareAccessDialog);
el.openShareAccessBtn.addEventListener('click', openShareAccessDialog);

el.addShareBtn.addEventListener('click', async () => {
  try {
    await window.crm.addShare(el.shareEmailInput.value);
    el.shareEmailInput.value = '';
    await renderShares();
    showToast('Read-only invite saved.');
  } catch (error) {
    showToast(error.message || 'Could not share access.');
  }
});

el.sharesList.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-remove-share]');
  if (!button) return;
  try {
    await window.crm.removeShare(button.dataset.removeShare);
    await renderShares();
    showToast('Read-only access removed.');
  } catch (error) {
    showToast(error.message || 'Could not remove access.');
  }
});

el.accountScopeSelect.addEventListener('change', async () => {
  try {
    await window.crm.setActiveAccount(el.accountScopeSelect.value);
    state.selectedIds.clear();
    resetForm(false);
    setPanelOpen(false);
    await load();
    showToast('LaunchPad account switched.');
  } catch (error) {
    showToast(error.message || 'Could not switch account.');
    renderAccountSwitcher();
  }
});
el.syncNowBtn.addEventListener('click', async () => {
  await load();
  showToast('Data refreshed.');
});

let isResizingWorkspace = false;

el.workspaceResizer.addEventListener('pointerdown', (event) => {
  isResizingWorkspace = true;
  document.body.classList.add('resizing-workspace');
  el.workspaceResizer.setPointerCapture(event.pointerId);
});

window.addEventListener('pointermove', (event) => {
  if (!isResizingWorkspace) return;
  const layout = document.querySelector('.layout');
  const rect = layout.getBoundingClientRect();
  const minTop = Math.max(170, rect.height * 0.18);
  const maxTop = Math.max(minTop, rect.height * 0.58);
  const nextTop = Math.min(Math.max(event.clientY - rect.top, minTop), maxTop);
  document.documentElement.style.setProperty('--workspace-split', `${Math.round(nextTop)}px`);
});

window.addEventListener('pointerup', () => {
  if (!isResizingWorkspace) return;
  isResizingWorkspace = false;
  document.body.classList.remove('resizing-workspace');
  const split = getComputedStyle(document.documentElement).getPropertyValue('--workspace-split').trim();
  const numericSplit = Number(split.replace('px', ''));
  if (Number.isFinite(numericSplit)) localStorage.setItem('workspaceSplit', String(Math.round(numericSplit)));
});

el.calendarViewBtn.addEventListener('click', () => {
  el.calendarPanel.classList.toggle('hidden');
  renderCalendar();
});

function shiftCalendar(direction) {
  const current = state.calendarDate;
  if (state.calendarMode === 'month') {
    state.calendarDate = new Date(current.getFullYear(), current.getMonth() + direction, 1);
  } else if (state.calendarMode === 'week') {
    state.calendarDate = addDays(current, direction * 7);
  } else {
    state.calendarDate = addDays(current, direction);
  }
  renderCalendar();
}

el.calendarPrevBtn.addEventListener('click', () => shiftCalendar(-1));
el.calendarNextBtn.addEventListener('click', () => shiftCalendar(1));
el.calendarTodayBtn.addEventListener('click', () => {
  state.calendarDate = new Date();
  renderCalendar();
});

el.calendarMode.addEventListener('change', () => {
  state.calendarMode = el.calendarMode.value;
  localStorage.setItem('calendarMode', state.calendarMode);
  renderCalendar();
});

el.closeCalendarBtn.addEventListener('click', () => {
  el.calendarPanel.classList.add('hidden');
});

el.calendarList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-calendar-id]');
  if (!button) return;
  const merchant = state.merchants.find((item) => item.id === button.dataset.calendarId);
  if (merchant) fillForm(merchant);
});

function openAllowedExternal(url, label) {
  window.crm.openExternal(url).catch((error) => {
    console.error(error);
    showToast(`Could not open ${label}.`);
  });
}

el.menuBuilderBtn.addEventListener('click', () => openAllowedExternal(MENU_BUILDER_URL, 'Menu Builder'));
el.decisionsClientBtn.addEventListener('click', () => openAllowedExternal(DECISIONS_URL, 'Decisions'));
orderEl.decisionsOrderBtn.addEventListener('click', () => openAllowedExternal(DECISIONS_URL, 'Decisions'));

orderEl.clientInfoTabBtn.addEventListener('click', () => setPanelTab('clientInfo'));
orderEl.orderInfoTabBtn.addEventListener('click', () => setPanelTab('orderInfo'));
orderEl.accountNotesTabBtn.addEventListener('click', () => setPanelTab('accountNotes'));
orderEl.emailTemplatesTabBtn.addEventListener('click', () => setPanelTab('emailTemplates'));
orderEl.contactsTabBtn.addEventListener('click', () => setPanelTab('contacts'));
orderEl.equipmentTabBtn.addEventListener('click', () => setPanelTab('equipment'));

el.viewTabs.addEventListener('click', (event) => {
  const button = event.target.closest('[data-view-id]');
  if (!button) return;
  state.view = button.dataset.viewId;
  renderViews();
});

el.viewTabs.addEventListener('dragstart', (event) => {
  const button = event.target.closest('[data-view-id]');
  if (!button) return;
  state.draggedView = button.dataset.viewId;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/view-id', state.draggedView);
});

el.viewTabs.addEventListener('dragover', (event) => {
  if (!event.target.closest('[data-view-id]')) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
});

el.viewTabs.addEventListener('drop', (event) => {
  const button = event.target.closest('[data-view-id]');
  if (!button) return;
  event.preventDefault();
  const viewId = event.dataTransfer.getData('text/view-id') || state.draggedView;
  reorderView(viewId, button.dataset.viewId);
});

el.viewTabs.addEventListener('dragend', () => {
  state.draggedView = null;
});

el.favoriteViewBtn.addEventListener('click', () => {
  localStorage.setItem('defaultView', state.view);
  renderViews();
  showToast(`${viewById(state.view).label} will open by default.`);
});

el.cardDensity.addEventListener('change', () => {
  state.cardDensity = el.cardDensity.value === 'compact' ? 'compact' : 'standard';
  saveCardSettings();
  renderViews();
});

el.cardFieldOptions.addEventListener('change', () => {
  state.cardFields = [...el.cardFieldOptions.querySelectorAll('input[type="checkbox"]')]
    .filter((input) => input.checked)
    .map((input) => input.value);
  saveCardSettings();
  renderViews();
});

el.cardSort.addEventListener('change', () => {
  state.cardSort = el.cardSort.value;
  saveCardSettings();
  renderViews();
});

el.archiveToggleBtn.addEventListener('click', () => {
  state.showCompleted = !state.showCompleted;
  if (!state.showCompleted) {
    state.selectedIds.clear();
  }
  renderViews();
});

el.editModeBtn.addEventListener('click', () => {
  if (blockReadOnly()) return;
  state.editMode = !state.editMode;
  if (!state.editMode) state.selectedIds.clear();
  closeAppMenu();
  renderViews();
  showToast(state.editMode ? 'Edit mode on.' : 'Changes saved. Edit mode off.');
});

function reorderView(viewId, beforeViewId) {
  if (!viewId || !beforeViewId || viewId === beforeViewId) return;
  const order = state.viewOrder.filter((item) => item !== viewId);
  const index = order.indexOf(beforeViewId);
  order.splice(index < 0 ? order.length : index, 0, viewId);
  state.viewOrder = order;
  saveViewSettings();
  renderViews();
  showToast('View order saved.');
}

el.searchInput.addEventListener('input', (event) => {
  state.search = event.target.value;
  renderViews();
});

el.bulkStageBtn.addEventListener('click', () => bulkUpdate('stage', el.bulkStageSelect.value));
el.bulkTaskBtn.addEventListener('click', () => bulkUpdate('taskName', el.bulkTaskSelect.value));
el.bulkTypeBtn.addEventListener('click', () => bulkUpdate('programmingType', el.bulkTypeSelect.value));
el.bulkDeleteBtn.addEventListener('click', bulkDelete);
el.bulkClearBtn.addEventListener('click', () => {
  state.selectedIds.clear();
  renderViews();
});

el.newMerchantBtn.addEventListener('click', () => {
  if (blockReadOnly()) return;
  resetForm(true);
});

function handleKanbanClick(event) {
  const columnSelect = event.target.closest('[data-select-column-field]');
  if (columnSelect) {
    event.stopPropagation();
    const field = columnSelect.dataset.selectColumnField;
    const value = columnSelect.dataset.selectColumnValue;
    const matchingIds = visibleMerchants()
      .filter((merchant) => {
        if (field === 'stage') return normalizeStage(merchant.stage) === value;
        if (field === 'taskName') return normalizeTask(merchant.taskName) === value;
        if (field === 'programmingType') return normalizeProgrammingType(merchant.programmingType) === value;
        return false;
      })
      .map((merchant) => merchant.id);
    matchingIds.forEach((merchantId) => {
      if (columnSelect.checked) state.selectedIds.add(merchantId);
      else state.selectedIds.delete(merchantId);
    });
    renderViews();
    return;
  }
  const welcomeInput = event.target.closest('[data-welcome-email-id]');
  if (welcomeInput) {
    event.stopPropagation();
    if (blockReadOnly()) {
      welcomeInput.checked = !welcomeInput.checked;
      return;
    }
    toggleWelcomeEmailSent(welcomeInput.dataset.welcomeEmailId, welcomeInput.checked);
    return;
  }
  const selectInput = event.target.closest('[data-select-id]');
  if (selectInput) {
    event.stopPropagation();
    if (selectInput.checked) state.selectedIds.add(selectInput.dataset.selectId);
    else state.selectedIds.delete(selectInput.dataset.selectId);
    renderViews();
    return;
  }
  if (event.target.closest('.card-select')) {
    event.stopPropagation();
    return;
  }
  const hideTaskButton = event.target.closest('[data-hide-task]');
  if (hideTaskButton) {
    event.stopPropagation();
    hideTask(hideTaskButton.dataset.hideTask);
    return;
  }
  const showTaskButton = event.target.closest('[data-show-task]');
  if (showTaskButton) {
    event.stopPropagation();
    showTask(showTaskButton.dataset.showTask);
    return;
  }
  const deleteButton = event.target.closest('[data-delete-id]');
  if (deleteButton) {
    event.stopPropagation();
    deleteMerchant(deleteButton.dataset.deleteId);
    return;
  }
  const card = event.target.closest('[data-id]');
  if (!card) return;
  fillForm(state.merchants.find((merchant) => merchant.id === card.dataset.id));
}

function handleKanbanDragStart(event) {
  if (state.readOnly) {
    event.preventDefault();
    return;
  }
  const stageTitle = event.target.closest('[data-stage-name]');
  if (stageTitle) {
    if (!state.editMode) return;
    state.draggedStage = stageTitle.dataset.stageName;
    state.draggedId = null;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/stage-name', state.draggedStage);
    return;
  }
  const typeTitle = event.target.closest('[data-type-name]');
  if (typeTitle) {
    if (!state.editMode) return;
    state.draggedType = typeTitle.dataset.typeName;
    state.draggedId = null;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/type-name', state.draggedType);
    return;
  }
  const taskTitle = event.target.closest('[data-task-name]');
  if (taskTitle) {
    if (!state.editMode) {
      event.preventDefault();
      return;
    }
    state.draggedId = null;
    state.draggedTask = taskTitle.dataset.taskName;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/task-name', state.draggedTask);
    return;
  }
  const card = event.target.closest('[data-id]');
  if (!card) return;
  state.draggedTask = null;
  state.draggedId = card.dataset.id;
  card.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', card.dataset.id);
}

function handleKanbanDragEnd(event) {
  state.draggedId = null;
  state.draggedTask = null;
  state.draggedStage = null;
  state.draggedType = null;
  event.target.closest('.card')?.classList.remove('dragging');
  document.querySelectorAll('.stage-column.drag-over').forEach((column) => column.classList.remove('drag-over'));
}

function handleKanbanDragOver(event) {
  const column = event.target.closest('[data-drop-field]');
  if (!column) return;
  event.preventDefault();
  column.classList.add('drag-over');
  event.dataTransfer.dropEffect = 'move';
}

function handleKanbanDragLeave(event) {
  const column = event.target.closest('[data-drop-field]');
  if (!column || column.contains(event.relatedTarget)) return;
  column.classList.remove('drag-over');
}

async function handleKanbanDrop(event) {
  if (blockReadOnly()) return;
  const column = event.target.closest('[data-drop-field]');
  if (!column) return;
  event.preventDefault();
  column.classList.remove('drag-over');
  const stageName = event.dataTransfer.getData('text/stage-name') || state.draggedStage;
  if (stageName && !state.draggedId && column.dataset.dropField === 'stage' && state.editMode) {
    reorderStage(stageName, column.dataset.dropValue);
    return;
  }
  const typeName = state.draggedType;
  if (typeName !== null && typeName !== undefined && !state.draggedId && column.dataset.dropField === 'programmingType' && state.editMode) {
    reorderType(typeName, column.dataset.dropValue);
    return;
  }
  const taskName = event.dataTransfer.getData('text/task-name') || state.draggedTask;
  if (taskName && !state.draggedId && column.dataset.dropField === 'taskName' && state.editMode) {
    reorderTask(taskName, column.dataset.dropValue);
    return;
  }
  const merchantId = event.dataTransfer.getData('text/plain') || state.draggedId;
  await moveMerchant(merchantId, column.dataset.dropField, column.dataset.dropValue);
}

[el.stageKanbanView, el.taskKanbanView, el.programmingKanbanView].forEach((kanban) => {
  kanban.addEventListener('click', handleKanbanClick);
  kanban.addEventListener('dragstart', handleKanbanDragStart);
  kanban.addEventListener('dragend', handleKanbanDragEnd);
  kanban.addEventListener('dragover', handleKanbanDragOver);
  kanban.addEventListener('dragleave', handleKanbanDragLeave);
  kanban.addEventListener('drop', handleKanbanDrop);
});

el.taskKanbanView.addEventListener('change', (event) => {
  const select = event.target.closest('[data-task-sort]');
  if (!select) return;
  state.taskSorts[select.dataset.taskSort] = select.value;
  saveTaskBoardSettings();
  renderTaskKanban();
});

function reorderTask(taskName, beforeTaskName) {
  if (!taskName || !beforeTaskName || taskName === beforeTaskName) return;
  const order = allTasks().filter((item) => item !== taskName);
  const index = order.indexOf(beforeTaskName);
  order.splice(index < 0 ? order.length : index, 0, taskName);
  state.taskOrder = order;
  saveTaskBoardSettings();
  renderViews();
  showToast(`${taskName} moved.`);
}

function reorderStage(stageName, beforeStageName) {
  if (!stageName || !beforeStageName || stageName === beforeStageName) return;
  const order = allStages().filter((item) => item !== stageName);
  const index = order.indexOf(beforeStageName);
  order.splice(index < 0 ? order.length : index, 0, stageName);
  state.stageOrder = order;
  saveTaskBoardSettings();
  renderViews();
  showToast(`${stageName} moved.`);
}

function reorderType(typeName, beforeTypeName) {
  if (typeName === beforeTypeName) return;
  const order = allTypes().filter((item) => item !== typeName);
  const index = order.indexOf(beforeTypeName);
  order.splice(index < 0 ? order.length : index, 0, typeName);
  state.typeOrder = order;
  saveTaskBoardSettings();
  renderViews();
  showToast(`${programmingTypeLabel(typeName)} moved.`);
}

function hideTask(taskName) {
  if (!TASKS.includes(taskName) || state.hiddenTasks.includes(taskName)) return;
  state.hiddenTasks.push(taskName);
  saveTaskBoardSettings();
  renderViews();
  showToast(`${taskName} hidden.`);
}

function showTask(taskName) {
  state.hiddenTasks = state.hiddenTasks.filter((item) => item !== taskName);
  saveTaskBoardSettings();
  renderViews();
  showToast(`${taskName} restored.`);
}

el.listView.addEventListener('click', (event) => {
  const selectInput = event.target.closest('[data-select-id]');
  if (selectInput) {
    event.stopPropagation();
    if (selectInput.checked) state.selectedIds.add(selectInput.dataset.selectId);
    else state.selectedIds.delete(selectInput.dataset.selectId);
    renderViews();
    return;
  }
  const row = event.target.closest('[data-id]');
  if (!row) return;
  fillForm(state.merchants.find((merchant) => merchant.id === row.dataset.id));
});

el.importContactsBtn.addEventListener('click', async () => {
  if (blockReadOnly()) return;
  el.importContactsBtn.disabled = true;
  el.importContactsBtn.textContent = 'Importing...';
  try {
    const result = await window.crm.importContactsFromImage();
    if (result) applyImportedContacts(result.contacts || []);
  } catch (error) {
    console.error(error);
    showToast('Could not import contacts from that image.');
  } finally {
    el.importContactsBtn.disabled = false;
    el.importContactsBtn.textContent = 'Import';
  }
});

el.addContactBtn.addEventListener('click', () => {
  if (blockReadOnly()) return;
  renderContacts([...readContacts(), { ...emptyContact(), showAll: true }]);
  markSaveButtonsDirty();
});

el.contactsList.addEventListener('click', (event) => {
  const copyButton = event.target.closest('[data-copy-value]');
  if (copyButton) {
    const rowValue = copyButton.closest('.contact-method-row, .contact-input-copy')?.querySelector('input')?.value || copyButton.dataset.copyValue || '';
    window.crm.copyText(trimClipboardText(rowValue)).then(() => {
      markButtonCopied(copyButton);
      showToast('Contact value copied.');
    }).catch((error) => {
      console.error(error);
      showToast('Could not copy contact value.');
    });
    return;
  }

  const addPhoneButton = event.target.closest('[data-add-contact-phone]');
  if (addPhoneButton) {
    if (blockReadOnly()) return;
    const card = addPhoneButton.closest('.contact-card');
    const container = card.querySelector('[data-contact-phones]');
    container?.querySelector('.mini-empty')?.remove();
    container?.insertAdjacentHTML('beforeend', `
      <div class="contact-method-row">
        <label>Phone<input data-contact-phone value="" /></label>
        <button class="secondary copy-contact-value" type="button" data-copy-value="">Copy</button>
      </div>
    `);
    markSaveButtonsDirty();
    return;
  }

  const addEmailButton = event.target.closest('[data-add-contact-email]');
  if (addEmailButton) {
    if (blockReadOnly()) return;
    const card = addEmailButton.closest('.contact-card');
    const container = card.querySelector('[data-contact-emails]');
    container?.querySelector('.mini-empty')?.remove();
    container?.insertAdjacentHTML('beforeend', `
      <div class="contact-method-row">
        <label>Email<input data-contact-email type="email" value="" /></label>
        <button class="secondary copy-contact-value" type="button" data-copy-value="">Copy</button>
      </div>
    `);
    markSaveButtonsDirty();
    return;
  }

  const button = event.target.closest('[data-remove-contact]');
  if (!button) return;
  if (blockReadOnly()) return;
  const index = Number(button.dataset.removeContact);
  renderContacts(readContacts().filter((_contact, contactIndex) => contactIndex !== index));
  markSaveButtonsDirty();
});

orderEl.addSurchargeBtn.addEventListener('click', () => {
  if (blockReadOnly()) return;
  const info = readOrderInfo();
  info.surcharges.push({ name: '', percentage: '' });
  renderOrderInfo(info);
});

orderEl.addDiscountBtn.addEventListener('click', () => {
  if (blockReadOnly()) return;
  const info = readOrderInfo();
  info.discounts.push({ name: '', amount: '', unit: '%' });
  renderOrderInfo(info);
});

orderEl.addHappyHourBtn.addEventListener('click', () => {
  if (blockReadOnly()) return;
  const info = readOrderInfo();
  info.happyHours.push({ name: '', days: [], start: '', end: '', amount: '', unit: '%', note: '' });
  renderOrderInfo(info);
});

orderEl.addGratuityBtn.addEventListener('click', () => {
  if (blockReadOnly()) return;
  const info = readOrderInfo();
  info.gratuities.push({ name: '', percentage: '', automatic: false, people: '' });
  renderOrderInfo(info);
});

orderEl.addEmployeeBtn.addEventListener('click', () => {
  if (blockReadOnly()) return;
  const info = readOrderInfo();
  info.employees.push({ name: '', jobs: [], pin: '' });
  renderOrderInfo(info);
});

orderEl.orderInfoForm.addEventListener('click', (event) => {
  if (state.readOnly && event.target.closest('[data-remove-surcharge], [data-remove-discount], [data-remove-happy-hour], [data-remove-gratuity], [data-remove-employee]')) {
    blockReadOnly();
    return;
  }
  const info = readOrderInfo();
  const removeMap = [
    ['removeSurcharge', 'surcharges'],
    ['removeDiscount', 'discounts'],
    ['removeHappyHour', 'happyHours'],
    ['removeGratuity', 'gratuities'],
    ['removeEmployee', 'employees']
  ];
  const match = removeMap.find(([datasetKey]) => event.target.dataset[datasetKey] !== undefined);
  if (!match) return;
  const [datasetKey, collection] = match;
  info[collection].splice(Number(event.target.dataset[datasetKey]), 1);
  if (collection === 'surcharges' && !info.surcharges.length) info.surcharges = defaultOrderInfo().surcharges;
  renderOrderInfo(info);
});

orderEl.orderInfoForm.addEventListener('input', () => {
  markSaveButtonsDirty();
  updateOrderVisibility();
  renderOrderEmail();
  renderEquipmentSummary();
});

orderEl.orderInfoForm.addEventListener('change', (event) => {
  markSaveButtonsDirty();
  if (handleAnotherTaxChange(event.target)) return;
  copyOloTimesFromPreviousDay(event.target);
  updateOrderVisibility();
  renderOrderEmail();
  renderEquipmentSummary();
});

orderEl.saveOrderInfoBtn.addEventListener('click', async () => {
  if (blockReadOnly()) return;
  await saveOrderInfo();
});

async function saveAccountNotes(notes) {
  if (blockReadOnly()) return;
  if (!state.selectedId) {
    showToast('Save the merchant before adding account notes.');
    return;
  }
  const merchant = state.merchants.find((item) => item.id === state.selectedId);
  if (!merchant) return;
  merchant.accountNotes = validAccountNotes(notes);
  merchant.updatedAt = new Date().toISOString();
  state.merchants = await window.crm.saveMerchants(state.merchants);
  renderAccountNotes(merchant.accountNotes);
  renderViews();
}

orderEl.addAccountNoteBtn.addEventListener('click', async () => {
  if (blockReadOnly()) return;
  const comments = orderEl.accountNoteInput.value.trim();
  if (!comments) {
    showToast('Type an account note first.');
    return;
  }
  const merchant = selectedMerchant();
  const notes = [
    {
      id: `note-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      date: new Date().toISOString(),
      user: state.csmName || 'User',
      comments
    },
    ...(merchant?.accountNotes || [])
  ];
  await saveAccountNotes(notes);
  orderEl.accountNoteInput.value = '';
  showToast('Account note added.');
});

orderEl.accountNotesList.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-delete-note]');
  if (!button) return;
  if (blockReadOnly()) return;
  const merchant = selectedMerchant();
  if (!merchant) return;
  await saveAccountNotes((merchant.accountNotes || []).filter((note) => note.id !== button.dataset.deleteNote));
  showToast('Account note deleted.');
});

async function saveOrderInfo() {
  if (blockReadOnly()) return;
  if (!state.selectedId) {
    showToast('Save the merchant before saving Order Info.');
    return;
  }
  const merchant = formMerchant();
  state.merchants = await window.crm.upsertMerchant(merchant);
  fillForm(state.merchants.find((item) => item.id === merchant.id), false);
  setPanelTab('orderInfo');
  markButtonSaved(orderEl.saveOrderInfoBtn);
  markButtonSaved(el.savePanelTopBtn);
  showToast('Order Info saved.');
}

orderEl.copyOrderEmailBtn.addEventListener('click', async () => {
  try {
    await window.crm.copyEmail(emailClipboardHtml(orderEl.orderEmailOutput.dataset.html || ''), trimClipboardText(orderEl.orderEmailOutput.dataset.text || ''));
    markButtonCopied(orderEl.copyOrderEmailBtn);
    showToast('Order recap email copied to clipboard.');
  } catch (error) {
    console.error(error);
    showToast('Could not copy order recap email.');
  }
});

orderEl.copyOrderSubjectBtn.addEventListener('click', async () => {
  try {
    await window.crm.copyText(trimClipboardText(orderEl.orderSubjectOutput.value || ''));
    markButtonCopied(orderEl.copyOrderSubjectBtn);
    showToast('Order recap subject copied to clipboard.');
  } catch (error) {
    console.error(error);
    showToast('Could not copy order recap subject.');
  }
});

orderEl.copyOrderProgrammingNotesBtn.addEventListener('click', async () => {
  try {
    await window.crm.copyText(trimClipboardText(orderEl.orderProgrammingNotesOutput.value || ''));
    markButtonCopied(orderEl.copyOrderProgrammingNotesBtn);
    showToast('Programming notes copied to clipboard.');
  } catch (error) {
    console.error(error);
    showToast('Could not copy programming notes.');
  }
});

el.closePanelBtn.addEventListener('click', () => {
  resetCopyButtons();
  setPanelOpen(false);
});

function closeMerchantMenu() {
  el.merchantMenu.classList.add('hidden');
  el.merchantMenuBtn.setAttribute('aria-expanded', 'false');
}

el.merchantMenuBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  const opening = el.merchantMenu.classList.contains('hidden');
  el.merchantMenu.classList.toggle('hidden', !opening);
  el.merchantMenuBtn.setAttribute('aria-expanded', String(opening));
});

el.deleteMerchantMenuBtn.addEventListener('click', async () => {
  if (blockReadOnly()) return;
  closeMerchantMenu();
  const merchant = selectedMerchant();
  if (!merchant) return;
  if (merchant.recordSource !== 'manual') {
    showToast('Imported accounts cannot be deleted. Use Undo Last Import.');
    return;
  }
  await deleteMerchant(merchant.id);
});

el.mergeMerchantBtn.addEventListener('click', () => {
  if (blockReadOnly()) return;
  closeMerchantMenu();
  const source = selectedMerchant();
  if (!source) return;
  const targets = state.merchants.filter((merchant) => merchant.id !== source.id);
  if (!targets.length) {
    showToast('There is no other account available to merge into.');
    return;
  }
  el.mergeTargetSelect.innerHTML = targets
    .sort((a, b) => String(a.dbaName || '').localeCompare(String(b.dbaName || '')))
    .map((merchant) => `<option value="${escapeHtml(merchant.id)}">${escapeHtml(merchant.dbaName || 'Unnamed')} (${escapeHtml(merchant.mid || 'No MID')})</option>`)
    .join('');
  el.mergeDialog.showModal();
});

el.confirmMergeBtn.addEventListener('click', async () => {
  if (blockReadOnly()) return;
  const source = selectedMerchant();
  const target = state.merchants.find((merchant) => merchant.id === el.mergeTargetSelect.value);
  if (!source || !target || source.id === target.id) return;
  const mergedTarget = {
    ...target,
    orderInfo: { ...(target.orderInfo || {}), ...(source.orderInfo || {}) },
    contacts: mergeContacts(target.contacts, source.contacts),
    accountNotes: mergeAccountNotes(target.accountNotes, source.accountNotes),
    updatedAt: new Date().toISOString()
  };
  state.merchants = state.merchants.filter((merchant) => merchant.id !== source.id)
    .map((merchant) => merchant.id === target.id ? mergedTarget : merchant);
  state.merchants = await window.crm.saveMerchants(state.merchants);
  el.mergeDialog.close();
  fillForm(state.merchants.find((merchant) => merchant.id === target.id));
  showToast('Accounts merged. General information from the destination account was kept.');
});

async function saveMerchantFromForm() {
  if (blockReadOnly()) return;
  const merchant = formMerchant();
  state.merchants = await window.crm.upsertMerchant(merchant);
  const saved = merchant.id
    ? state.merchants.find((item) => item.id === merchant.id)
    : state.merchants[0];
  fillForm(saved);
  markButtonSaved(el.saveMerchantBtn);
  markButtonSaved(el.savePanelTopBtn);
  showToast('Merchant saved.');
}

el.merchantForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (blockReadOnly()) return;
  await saveMerchantFromForm();
});

el.savePanelTopBtn.addEventListener('click', async () => {
  if (blockReadOnly()) return;
  if (state.panelTab === 'orderInfo' || state.panelTab === 'equipment') await saveOrderInfo();
  else await saveMerchantFromForm();
});

[el.templateSelect, el.customNote, ...Object.values(fields)].forEach((input) => {
  input.addEventListener('input', () => {
    if (Object.values(fields).includes(input)) markSaveButtonsDirty();
    renderEmail();
    renderOrderEmail();
  });
  input.addEventListener('change', () => {
    if (Object.values(fields).includes(input)) markSaveButtonsDirty();
    if (input === fields.programmingType) setDefaultTemplateForCurrentMerchant();
    renderEmail();
    renderOrderEmail();
  });
});

fields.taskName.addEventListener('change', () => {
  fields.stage.value = stageForTask(fields.taskName.value, fields.stage.value);
  if (!fields.accountStatus.value) fields.accountStatus.value = automaticAccountStatus('', fields.taskName.value);
  renderMerchantSnapshot();
});

fields.accountStatus.addEventListener('input', renderMerchantSnapshot);

el.contactsList.addEventListener('input', () => {
  markSaveButtonsDirty();
  renderEmail();
  renderOrderEmail();
});

el.merchantForm.addEventListener('click', (event) => {
  const copyButton = event.target.closest('[data-copy-field]');
  if (!copyButton) return;
  const input = fields[copyButton.dataset.copyField];
  window.crm.copyText(trimClipboardText(input?.value || '')).then(() => {
    markButtonCopied(copyButton);
    showToast('Field copied.');
  }).catch((error) => {
    console.error(error);
    showToast('Could not copy field.');
  });
});

[fields.orderStartDate, fields.installationDate, fields.installationTime].forEach((input) => {
  input.addEventListener('input', () => {
    fields.orderLifeCycle.value = calculateOrderLifeCycle(fields.orderStartDate.value, combinedInstallationDateTime());
  });
  input.addEventListener('change', () => {
    fields.orderLifeCycle.value = calculateOrderLifeCycle(fields.orderStartDate.value, combinedInstallationDateTime());
  });
});

el.copyEmailBtn.addEventListener('click', async () => {
  try {
    await window.crm.copyEmail(emailClipboardHtml(el.emailOutput.dataset.html || ''), trimClipboardText(el.emailOutput.dataset.text || ''));
    markButtonCopied(el.copyEmailBtn);
    showToast('Email text copied to clipboard.');
  } catch (error) {
    console.error(error);
    showToast('Could not copy email text.');
  }
});

el.copySubjectBtn.addEventListener('click', async () => {
  try {
    await window.crm.copyText(trimClipboardText(el.subjectOutput.value || ''));
    markButtonCopied(el.copySubjectBtn);
    showToast('Subject copied to clipboard.');
  } catch (error) {
    console.error(error);
    showToast('Could not copy subject.');
  }
});

applyWorkspaceSplit();
load();
