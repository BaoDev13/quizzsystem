import Dashboard from "views/Dashboard.js";
import CreateTopics from "views/pages/CreateTopic";
import ChangePassword from "views/pages/ChangePassword";
import Login from "views/pages/Login";
import ManageDailyQuestion from "views/pages/ManageDailyQuestion";
import ManageTrueFalseQuiz from "views/pages/ManageTrueFalseQuestion";
import ManageExamQuestion from "views/pages/ManageExamQuestion";
import ManageMathQuestion from "views/pages/ManageMathQuestion";
import ViewUser from "views/pages/ViewUser";

var routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/daily-quiz",
    name: "Manage Daily Quiz",
    icon: "fa fa-list-alt text-blue",
    component: <ManageDailyQuestion />,
    layout: "/admin",
  },
  {
    path: "/true_false-quiz",
    name: "Manage True/False Quiz",
    icon: "ni ni-pin-3 text-orange",
    component: <ManageTrueFalseQuiz />,
    layout: "/admin",
  },
  {
    path: "/math-quiz",
    name: "Manage Math Quiz",
    icon: "ni ni-pin-3 text-orange",
    component: <ManageMathQuestion />,
    layout: "/admin",
  },
  {
    path: "/exam-quiz",
    name: "Manage Exam Quiz",
    icon: "ni ni-pin-3 text-orange",
    component: <ManageExamQuestion />,
    layout: "/admin",
  },
  {
    path: "/view-user",
    name: "ViewUser",
    icon: "ni ni-key-25 text-info",
    component: <ViewUser />,
    layout: "/admin",
  },
  {
    path: "/change-password",
    name: "Chang Password",
    icon: "ni ni-bullet-list-67 text-red",
    component: <ChangePassword />,
    layout: "/admin",
  },

  {
    path: "/login",
    name: "Login",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/create-topic",
    name: "Create Topics",
    icon: "ni ni-planet text-blue",
    component: <CreateTopics />,
    layout: "/admin",
  },
];
export default routes;
