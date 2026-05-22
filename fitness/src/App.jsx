import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PublicOnlyRoute from "./auth/PublicOnlyRoute";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import AdminLayout from "./AdminComponents/AdminLayout";
import UsersTable from "./AdminComponents/UsersTable";
import CreateUserForm from "./AdminComponents/CreateUserForm";
import AssignTrainerForm from "./AdminComponents/AssignTrainerForm";
import ExerciseForm from "./AdminComponents/ExerciseForm";

import TrainerLayout from "./TrainerComponents/TrainerLayout";
import WorkoutPlans from "./TrainerComponents/WorkoutPlans";
import WorkoutPlanDetail from "./TrainerComponents/WorkoutPlanDetail";   // ✅ new
import CreateWorkoutPlan from "./TrainerComponents/CreateWorkoutPlan";
import AssignPlan from "./TrainerComponents/AssignPlan";
import ClientsList from "./TrainerComponents/ClientsList";
import ClientProgress from "./TrainerComponents/ClientProgress";
import ProgressReport from "./TrainerComponents/ProgressReport";
import ClientLayout from "./ClientComponents/ClientLayout";
import Dashboard from "./ClientComponents/Dashboard";
import MyProfile from "./ClientComponents/MyProfile";
import MyTrainer from "./ClientComponents/MyTrainer";
import MyWorkoutPlan from "./ClientComponents/MyWorkoutPlan";
import Notifications from "./ClientComponents/Notifications";
import ExerciseProgress from "./ClientComponents/ExerciseProgress";
import LogExercise from "./ClientComponents/LogExercise";
import ExerciseHistory from "./ClientComponents/ExerciseHistory";
import AllProgress from "./ClientComponents/AllProgress";


import RoleBasedRoute from "./auth/RoleBasedRoute";
import ClientRequests from "./ClientComponents/ClientRequests";
import TrainerNotifications from "./TrainerComponents/TrainerNotifications";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register/>}/>
       </Route>

          {/* Admin routes (only ADMIN can access) */}
          <Route element={<RoleBasedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<UsersTable />} />
              <Route path="createuser" element={<CreateUserForm />} />
              <Route path="assignuser" element={<AssignTrainerForm />} />
              <Route path="createexercise" element={<ExerciseForm />} />
            </Route>
          </Route>

          {/* Trainer routes (only TRAINER can access) */}
          <Route element={<RoleBasedRoute allowedRoles={["TRAINER"]} />}>
            <Route path="/trainer" element={<TrainerLayout />}>
              <Route index element={<WorkoutPlans />} />
              <Route path="workout-plans" element={<WorkoutPlans />} />
              <Route path="workout-plans/:id" element={<WorkoutPlanDetail />} />
              <Route path="create-plan" element={<CreateWorkoutPlan />} />
              <Route path="assign-plan" element={<AssignPlan />} />
               <Route path="notifications" element={<TrainerNotifications />} />
              <Route path="clients" element={<ClientsList />} />
              <Route path="client-progress/:id" element={<ClientProgress />} />
              <Route
                path="client-progress/:id/exercise/:exerciseId"
                element={<ProgressReport />}
              />
            </Route>
          </Route>

          {/* Client routes (only CLIENT can access) */}
          <Route element={<RoleBasedRoute allowedRoles={["CLIENT"]} />}>
            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="trainer" element={<MyTrainer />} />
              <Route path="requests" element={<ClientRequests />} />

              <Route path="workout-plan" element={<MyWorkoutPlan />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="exercise/:exerciseId/progress" element={<ExerciseProgress />} />
              <Route path="exercise/:exerciseId/log" element={<LogExercise />} />
              <Route path="exercise/:exerciseId/history" element={<ExerciseHistory />} />
              <Route path="all-progress" element={<AllProgress />} />
            </Route>
          </Route>

          {/* Other routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;