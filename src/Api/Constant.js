// export const USER_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/user';
export const USER_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/user';

// export const COMPANY_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/company';
export const COMPANY_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/company';


// export const MESSAGE_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/messages';
export const MESSAGE_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/messages';

// API Key endpoints
export const API_KEY_ENDPOINTS = {
    GET: 'https://codozap-e04e12b02929.herokuapp.com/api/v1/apiKey/get-Api-Key',
    GENERATE: 'https://codozap-e04e12b02929.herokuapp.com/api/v1/apiKey/generate-Api-Key',
    REVOKE: 'https://codozap-e04e12b02929.herokuapp.com/api/v1/apiKey/revoke-Api-Key'
  };

 // Configuration endpoints
  export const CONFIGURATION_ENDPOINTS = {
    CHECK: 'https://codozap-e04e12b02929.herokuapp.com/api/v1/configuration/check-configuration',
    SAVE: 'https://codozap-e04e12b02929.herokuapp.com/api/v1/configuration/save-configuration',
    UPDATE: 'https://codozap-e04e12b02929.herokuapp.com/api/v1/configuration/update-configuration'
  };

// Analytics endpoints
export const ANALYTICS_ENDPOINTS = {
    FETCH_CONVERSATION: 'https://codozap-e04e12b02929.herokuapp.com/api/v1/analytics/fetchConversationAnalytics'
  };

// Template endpoints
export const TEMPLATE_ENDPOINTS = {
    FETCH: 'https://codozap-e04e12b02929.herokuapp.com/api/v1/messages/fetchTemplates'
  };

  // Menu endpoints
export const MENU_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/menu';


export const MENU_ENDPOINTS = {
  CREATE: `${MENU_API_ENDPOINT}/create`,
  GET_ALL: `${MENU_API_ENDPOINT}/getAllMenus` ,
    UPDATE: (menuId) => `${MENU_API_ENDPOINT}/update/${menuId}`,
  DELETE: (menuId) => `${MENU_API_ENDPOINT}/delete/${menuId}` // New delete endpoint
};

export const MENU_ACCESS_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/menuAccess';

export const MENU_ACCESS_ENDPOINTS = {
  ASSIGN: `${MENU_ACCESS_API_ENDPOINT}/create-menu-access`,
  GET_ASSIGNED: `${MENU_ACCESS_API_ENDPOINT}/get-assigned-menu`
};


export const GROUP_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/groups';

export const GROUP_ENDPOINTS = {
  CREATE: `${GROUP_API_ENDPOINT}/create`,
  GET_ALL: `${GROUP_API_ENDPOINT}/getGroups`,
  UPDATE: (id) => `${GROUP_API_ENDPOINT}/updateGroup/${id}`,
  DELETE: (id) => `${GROUP_API_ENDPOINT}/deleteGroup/${id}`
};


export const ASSIGN_MENU_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/assignMenu';

export const ASSIGN_MENU_ENDPOINTS = {
  ASSIGN: `${ASSIGN_MENU_API_ENDPOINT}/assign-menu`,
  GET_GROUP_MENUS: (groupId) => `${ASSIGN_MENU_API_ENDPOINT}/group-menus/${groupId}`,
  REMOVE: `${ASSIGN_MENU_API_ENDPOINT}/remove-menu`,
  GET_ALL_ASSIGNED: `${ASSIGN_MENU_API_ENDPOINT}/all-assigned-menus`
};

// Add the new campaign endpoint
export const CAMPAIGN_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/campaign';

// And create campaign-specific endpoints
export const CAMPAIGN_ENDPOINTS = {
  GET_ALL: `${CAMPAIGN_API_ENDPOINT}/all`,
  CREATE: `${CAMPAIGN_API_ENDPOINT}/create`,
  GET_BY_ID: `${CAMPAIGN_API_ENDPOINT}/get`,
  UPDATE: `${CAMPAIGN_API_ENDPOINT}/`,
  DELETE: `${CAMPAIGN_API_ENDPOINT}/`,
  CANCEL: `${CAMPAIGN_API_ENDPOINT}/`,
  GET_DETAILS: `${CAMPAIGN_API_ENDPOINT}` 
};


// WhatsApp specific endpoints
export const WHATSAPP_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/whatsapp';

export const WHATSAPP_ENDPOINTS = {
  GENERATE_QR: `${WHATSAPP_API_ENDPOINT}/generate-qr`,
  SEND_MESSAGE: `${WHATSAPP_API_ENDPOINT}/send-message`,
  DISCONNECT: `${WHATSAPP_API_ENDPOINT}/disconnect`,
  ACTIVE_SESSIONS: `${WHATSAPP_API_ENDPOINT}/active-sessions`,
  MESSAGE_HISTORY: `${WHATSAPP_API_ENDPOINT}/message-history` 
};