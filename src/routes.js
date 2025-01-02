import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import WhatsApp from "views/examples/Whatsapp.js";
import Dashboard from "views/Dashboard.js";
import Campaign from "views/examples/Campaign.js";
import Templates from "views/examples/Templates.js";
import EditCompany from "components/Pages/EditWhatsappAccount";
import WhatsAppAccountList from "components/Pages/WhatsAppAccountList";
import WhatsAppStats from "components/Pages/WhatsAppStats";
import WhatsAppChats from "components/Pages/WhatsAppChats";
import WhatsAppAgents from "components/Pages/WhatsAppAgents";
import AddWhatsapp from "components/Pages/AddWhatsapp";
import AgentsList from "components/Pages/AgentsList";
import AgentsAdd from "components/Pages/AgentsAdd";
import Settings from "components/Pages/Settings";
import Contactlist from "components/Pages/Contactlist";
import AdminNavbar from "components/Navbars/AdminNavbar";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-gray",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-gray",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-gray",
    component: <Register />,
    layout: "/auth",
  },
  {
    path: "/whatsapp",
    name: "Whatsapp",
    icon: "ni ni-chat-round text-gray",
    component: <WhatsApp />,
    layout: "/admin",
  },
  {
    path: "/templates",
    name: "Templates",
    icon: "ni ni-folder-17 text-gray",
    component: <Templates />,
    layout: "/admin",
  },
  {
    path: "/campaign",
    name: "Campaigns",
    icon: "ni ni-send text-gray",
    component: <Campaign />,
    layout: "/admin",
  },
  
  {
    path: "/getCompanyById/:id",
    name: "GetCompanyById",
    icon: "ni ni-circle-08 text-gray",
    component: <EditCompany />,
    layout: "/admin",
    showInSidebar: false,
  },
  {
    path: "/whatsapplist",
    name: "WhatsAppList",
    icon: "ni ni-circle-08 text-gray",
    component: <WhatsAppAccountList />,
    layout: "/admin",
    showInSidebar: false,
  },
  {
    path: "/stats",
    name: "WhatsAppStats",
    icon: "ni ni-circle-08 text-gray",
    component: <WhatsAppStats />,
    layout: "/admin",
    showInSidebar: false,
  },
  {
    path: "/chats",
    name: "WhatsAppStats",
    icon: "ni ni-circle-08 text-gray",
    component: <WhatsAppChats />,
    layout: "/admin",
    showInSidebar: false,
  },
  {
    path: "/agents",
    name: "WhatsAppStats",
    icon: "ni ni-circle-08 text-gray",
    component: <WhatsAppAgents />,
    layout: "/admin",
    showInSidebar: false,
  },
  {
    path: "/AddWhatsapp",
    name: "AddWhatsapp",
    icon: "ni ni-circle-08 text-gray",
    component: <AddWhatsapp />,
    layout: "/admin",
    showInSidebar: false,
  },
  {
    path: "/agentslist",
    name: "AgentsList",
    icon: "ni ni-circle-08 text-gray",
    component: <AgentsList />,
    layout: "/admin",
    showInSidebar: false,
  },
  {
    path: "/createagents",
    name: "AgentsAdd",
    icon: "ni ni-circle-08 text-gray",
    component: <AgentsAdd />,
    layout: "/admin",
    showInSidebar: false,
  },
  {
    path: "settings",
    name: "Settings",
    icon: "fa fa-cog",
    component: <Settings />,
    layout: "/admin",
    showInSidebar: false,
  },
  {
    path: "/contactslist",
    name: "Contactlist",
    icon: "ni ni-single-02",
    component: <Contactlist />,
    layout: "/admin",
    showInSidebar: false,
  }, {
    // path: "/User-profile",
    // name: "Userprofile",
    // icon: "ni ni-single-02",
    // component: <AdminNavbar />,
    // layout: "/admin",
    // showInSidebar: false,
  },
];

export default routes;
