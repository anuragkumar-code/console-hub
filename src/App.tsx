import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Auth pages (public)
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";

// Protected pages
import Dashboard from "@/pages/Dashboard";
import Organizations from "@/pages/Organizations";
import OrganizationDetails from "@/pages/OrganizationDetails";
import Users from "@/pages/Users";
import Roles from "@/pages/Roles";
import Permissions from "@/pages/Permissions";
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
import Forbidden from "@/pages/Forbidden";
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
              {/* Auth routes - outside AppLayout (public) */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/forbidden" element={<Forbidden />} />
              
              {/* App routes - inside AppLayout (protected) */}
              <Route path="/*" element={
                <AppLayout>
                  <Routes>
                    {/* Dashboard - accessible to all authenticated users */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />

                    {/* Platform Admin - God Admin Only */}
                    <Route path="/organizations" element={
                      <ProtectedRoute resource="organizations" godAdminOnly>
                        <Organizations />
                      </ProtectedRoute>
                    } />
                    <Route path="/organizations/:id" element={
                      <ProtectedRoute resource="organizations" godAdminOnly>
                        <OrganizationDetails />
                      </ProtectedRoute>
                    } />
                    <Route path="/audit-logs" element={
                      <ProtectedRoute resource="audit_logs" godAdminOnly>
                        <AuditLogs />
                      </ProtectedRoute>
                    } />
                    <Route path="/permissions" element={
                      <ProtectedRoute resource="permissions" godAdminOnly>
                        <Permissions />
                      </ProtectedRoute>
                    } />

                    {/* Admin Module */}
                    <Route path="/users" element={
                      <ProtectedRoute resource="users">
                        <Users />
                      </ProtectedRoute>
                    } />
                    <Route path="/roles" element={
                      <ProtectedRoute resource="roles">
                        <Roles />
                      </ProtectedRoute>
                    } />
                    <Route path="/teams" element={
                      <ProtectedRoute resource="teams">
                        <Teams />
                      </ProtectedRoute>
                    } />

                    {/* CRM Module */}
                    <Route path="/contacts" element={
                      <ProtectedRoute resource="contacts">
                        <Contacts />
                      </ProtectedRoute>
                    } />
                    <Route path="/accounts" element={
                      <ProtectedRoute resource="accounts">
                        <Accounts />
                      </ProtectedRoute>
                    } />

                    {/* Sales Module */}
                    <Route path="/deals" element={
                      <ProtectedRoute resource="deals">
                        <Deals />
                      </ProtectedRoute>
                    } />

                    {/* Support Module */}
                    <Route path="/tickets" element={
                      <ProtectedRoute resource="tickets">
                        <Tickets />
                      </ProtectedRoute>
                    } />

                    {/* Communication Module */}
                    <Route path="/inbox" element={
                      <ProtectedRoute resource="conversations">
                        <Inbox />
                      </ProtectedRoute>
                    } />
                    <Route path="/channels" element={
                      <ProtectedRoute resource="channels">
                        <Channels />
                      </ProtectedRoute>
                    } />

                    {/* Settings */}
                    <Route path="/settings" element={
                      <ProtectedRoute resource="settings">
                        <Settings />
                      </ProtectedRoute>
                    } />

                    {/* Profile - always accessible to authenticated users */}
                    <Route path="/profile" element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } />

                    {/* 404 */}
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
