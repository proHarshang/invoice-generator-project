import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

export const generateInvoice = (invoiceData) => {
  return axios.post(`${API_URL}/generate-invoice`, invoiceData);
};

export const fetchInvoices = () => {
  return axios.get(`${API_URL}/invoices`);
};
