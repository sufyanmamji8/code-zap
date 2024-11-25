import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import WhatsApp from "views/examples/Whatsapp.js";
import Dashboard from "views/Dashboard.js";
import Campaign from "views/examples/Campaign.js";
import Templates from "views/examples/Templates.js";
import EditCompany from "components/Pages/EditWhatsappAccount";
import WhatsAppAccountList from "components/Pages/WhatsAppAccountList";


var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-gray",
    component: <Dashboard/>,
    layout: "/admin",
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
    path: "/campaigns",
    name: "Campaigns",
    icon: "ni ni-send text-gray", 
    component: <Campaign />,
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
    path: "/getCompanyById/:id",
    name: "GetCompanyById",
    icon: "ni ni-circle-08 text-gray",
    component: <EditCompany />,
    layout: "/admin",
    showInSidebar: false
  },
  {
    path: "/whatsapplist",
    name: "WhatsAppList",
    icon: "ni ni-circle-08 text-gray",
    component: <WhatsAppAccountList />,
    layout: "/admin",
    showInSidebar: false
  },
];
export default routes;