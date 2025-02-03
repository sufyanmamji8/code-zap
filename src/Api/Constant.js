// export const USER_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/user';
export const USER_API_ENDPOINT = 'http://192.168.0.110:25483/api/v1/user';

// export const COMPANY_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/company';
export const COMPANY_API_ENDPOINT = 'http://192.168.0.110:25483/api/v1/company';


// export const MESSAGE_API_ENDPOINT = 'https://codozap-e04e12b02929.herokuapp.com/api/v1/messages';
export const MESSAGE_API_ENDPOINT = 'http://192.168.0.110:25483/api/v1/messages';

// API Key endpoints
export const API_KEY_ENDPOINTS = {
    GET: 'http://192.168.0.110:25483/api/v1/apiKey/get-Api-Key',
    GENERATE: 'http://192.168.0.110:25483/api/v1/apiKey/generate-Api-Key',
    REVOKE: 'http://192.168.0.110:25483/api/v1/apiKey/revoke-Api-Key'
  };

 // Configuration endpoints
  export const CONFIGURATION_ENDPOINTS = {
    CHECK: 'http://192.168.0.110:25483/api/v1/configuration/check-configuration',
    SAVE: 'http://192.168.0.110:25483/api/v1/configuration/save-configuration',
    UPDATE: 'http://192.168.0.110:25483/api/v1/configuration/update-configuration'
  };

// Analytics endpoints
export const ANALYTICS_ENDPOINTS = {
    FETCH_CONVERSATION: 'http://192.168.0.110:25483/api/v1/analytics/fetchConversationAnalytics'
  };

// Template endpoints
export const TEMPLATE_ENDPOINTS = {
    FETCH: 'http://192.168.0.110:25483/api/v1/messages/fetchTemplates'
  };

  // Menu endpoints
export const MENU_API_ENDPOINT = 'http://192.168.0.110:25483/api/v1/menu';

export const MENU_ENDPOINTS = {
  CREATE: `${MENU_API_ENDPOINT}/create`,
  GET: (menuId) => `${MENU_API_ENDPOINT}/get/${menuId}`,
  UPDATE: (menuId) => `${MENU_API_ENDPOINT}/update/${menuId}`,
  DELETE: (menuId) => `${MENU_API_ENDPOINT}/delete/${menuId}`
};