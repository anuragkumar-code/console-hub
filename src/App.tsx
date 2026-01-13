import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import Organizations from "@/pages/Organizations";
import OrganizationDetails from "@/pages/OrganizationDetails";
import Users from "@/pages/Users";
import Roles from "@/pages/Roles";
import Contacts from "@/pages/Contacts";
import Accounts from "@/pages/Accounts";
import Deals from "@/pages/Deals";
import Tickets from "@/pages/Tickets";
import Inbox from "@/pages/Inbox";
import Channels from "@/pages/Channels";
import Teams from "@/pages/Teams";
import AuditLogs from "@/pages/AuditLogs";
import Settings from "@/pages/Settings";
import Profile from "@/pages/Profile";
import Permissions from "@/pages/Permissions";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes - outside AppLayout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* App routes - inside AppLayout */}
            <Route path="/*" element={
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/organizations" element={<Organizations />} />
                  <Route path="/organizations/:id" element={<OrganizationDetails />} />
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/permissions" element={<Permissions />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/tickets" element={<Tickets />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/channels" element={<Channels />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/audit-logs" element={<AuditLogs />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AppLayout>
            } />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
