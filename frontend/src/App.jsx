import InoiceForm from "./pages/InoiceForm";
import Auth from "./pages/Auth";
import InvoiceTable from "./pages/InvoiceTable";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/mainLayout";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import Logout from "./components/Logout";

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
