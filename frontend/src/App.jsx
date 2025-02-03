import InoiceForm from "./pages/InoiceForm";
import Auth from "./pages/Auth";
import InvoiceTable from "./pages/InvoiceTable";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layout/mainLayout";

function App() {
  return (
    <Router>
      <MainLayout>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/invoice-form" element={<InoiceForm />} />
        <Route path="/invoice-table" element={<InvoiceTable />} />
      </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
