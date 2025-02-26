import InoiceForm from "./pages/InoiceForm";
import Auth from "./pages/Auth";
import CompanySetting from "./pages/CompanySetting";
import InvoiceTable from "./pages/InvoiceTable";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Logout from "./components/Logout";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout>

          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/invoice-form" element={
              <PrivateRoute>
                <InoiceForm />
              </PrivateRoute>
            } />
            <Route path="/invoice-table" element={
              <PrivateRoute>
                <InvoiceTable />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <CompanySetting />
              </PrivateRoute>
            } />
            <Route path="/logout" element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            } />
          </Routes>
        </MainLayout>

      </Router>
    </AuthProvider>
  );
}

export default App;
