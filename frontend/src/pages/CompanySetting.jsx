import { useEffect, useState } from "react";
import axios from "axios";

export default function CompanySettingsForm() {
  const [formData, setFormData] = useState({
    company_logo: "",
    company_name: "",
    company_address: "",
    contact_number: "",
    contact_email: "",
    company_website: "",
    tax_identification_number: "",
  });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/company-settings`)
      .then((response) => {
        setFormData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching company settings:", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${import.meta.env.VITE_BASE_URL}/company-settings`, formData)
      .then((response) => {
        console.log("Company settings updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating company settings:", error);
      });
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-[#D7D4D4] text-white rounded-lg shadow-lg mb-10">
      <section>
        <h2 className="text-xl text-black font-bold mb-4 text-center">Company</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <img className="mx-auto w-32 h-32 object-cover rounded-full border border-gray-400" src={`${import.meta.env.VITE_BASE_URL}/static/${formData.company_logo}`} alt="Company Logo" />
          </div>
          <div className="space-y-2 mt-2">
            <label className="block text-black">Company Name</label>
            <input className="w-full p-2 bg-gray-800 border border-gray-600 rounded" name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Company Name" />
          </div>
          <div className="space-y-2 mt-2">
            <label className="block text-black">Company Address</label>
            <input className="w-full p-2 bg-gray-800 border border-gray-600 rounded" name="company_address" value={formData.company_address} onChange={handleChange} placeholder="Company Address" />
          </div>
          <div className="space-y-2 mt-2">
            <label className="block text-black">Contact Number</label>
            <input className="w-full p-2 bg-gray-800 border border-gray-600 rounded" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number" />
          </div>
          <div className="space-y-2 mt-2">
            <label className="block text-black">Contact Email</label>
            <input className="w-full p-2 bg-gray-800 border border-gray-600 rounded" name="contact_email" value={formData.contact_email} onChange={handleChange} placeholder="Contact Email" />
          </div>
          <div className="space-y-2 mt-2">
            <label className="block text-black">Company Website</label>
            <input className="w-full p-2 bg-gray-800 border border-gray-600 rounded" name="company_website" value={formData.company_website} onChange={handleChange} placeholder="Company Website" />
          </div>
          <div className="space-y-2 mt-2">
            <label className="block text-black">Tax Identification Number</label>
            <input className="w-full p-2 bg-gray-800 border border-gray-600 rounded" name="tax_identification_number" value={formData.tax_identification_number} onChange={handleChange} placeholder="Tax Identification Number" />
          </div>
          <button type="submit" className="w-full mt-5 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded">Save Changes</button>
        </form>
      </section>
    </div>
  );
}