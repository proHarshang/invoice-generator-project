import { useState } from "react";
import axios from "axios";

const InvoiceForm = () => {
    const defaultInvoice = {
        invoice_number: "",
        customer_name: "",
        customer_email: "",
        items: [{ unit_name: "", qty: 1, unit_cost: 0, total: 0 }],
        discounts: 0,
        subtotal: 0,
        taxes: 0,
        total: 0,
        status: "Pending",
        due_date: "",
        issue_date: "",
        note: "",
    };

    const [invoice, setInvoice] = useState(defaultInvoice);
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingGenerate, setLoadingGenerate] = useState(false);

    const handleChange = (e) => {
        setInvoice({ ...invoice, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, e) => {
        const newItems = [...invoice.items];
        newItems[index][e.target.name] = e.target.value;
        newItems[index].total = newItems[index].qty * newItems[index].unit_cost;
        setInvoice({ ...invoice, items: newItems });
    };

    const addItem = () => {
        setInvoice({
            ...invoice,
            items: [...invoice.items, { unit_name: "", qty: 1, unit_cost: 0, total: 0 }],
        });
    };

    const handleSubmit = async (url, setLoading) => {
        setLoading(true);
        try {
            const response = await axios.post(url, invoice);
            console.log("Response:", response);
            alert("Invoice processed successfully!");
        } catch (err) {
            console.log("Error:", err);
            alert("Error processing invoice");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={(e) => e.preventDefault()} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-4">
                <input type="text" name="invoice_number" placeholder="Invoice Number" className="border p-2 w-full" onChange={handleChange} />
                <input type="text" name="customer_name" placeholder="Customer Name" className="border p-2 w-full" onChange={handleChange} />
                <input type="email" name="customer_email" placeholder="Customer Email" className="border p-2 w-full" onChange={handleChange} />
            </div>

            <h2 className="font-bold mt-4">Items</h2>
            {invoice.items.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 mt-2">
                    <input type="text" name="unit_name" placeholder="Unit Name" className="border p-2" onChange={(e) => handleItemChange(index, e)} />
                    <input type="number" name="qty" placeholder="Quantity" className="border p-2" onChange={(e) => handleItemChange(index, e)} />
                    <input type="number" name="unit_cost" placeholder="Unit Cost" className="border p-2" onChange={(e) => handleItemChange(index, e)} />
                    <input type="number" name="total" value={item.total} readOnly className="border p-2" />
                </div>
            ))}
            <button type="button" onClick={addItem} className="mt-2 bg-black text-white p-2 rounded">+ Add Item</button>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <input type="number" name="discounts" placeholder="Discounts" className="border p-2" onChange={handleChange} />
                <input type="number" name="subtotal" placeholder="Subtotal" className="border p-2" onChange={handleChange} />
                <input type="number" name="taxes" placeholder="Taxes" className="border p-2" onChange={handleChange} />
                <input type="number" name="total" placeholder="Total" className="border p-2" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <input type="date" name="due_date" className="border p-2" onChange={handleChange} />
                <input type="date" name="issue_date" className="border p-2" onChange={handleChange} />
            </div>

            <textarea name="note" placeholder="Note" className="border p-2 w-full mt-4" onChange={handleChange}></textarea>

            <div className="flex gap-4 mt-4">
                <button 
                    onClick={() => handleSubmit(`${import.meta.env.VITE_BASE_URL}/save-invoice`, setLoadingSave)} 
                    className="bg-black text-white p-3 rounded w-full"
                    disabled={loadingSave}
                >
                    {loadingSave ? "Saving..." : "Save Invoice"}
                </button>
                
                <button 
                    onClick={() => handleSubmit(`${import.meta.env.VITE_BASE_URL}/save-and-generate-invoice-pdf`, setLoadingGenerate)} 
                    className="bg-green-600 text-white p-3 rounded w-full"
                    disabled={loadingGenerate}
                >
                    {loadingGenerate ? "Generating..." : "Save & Download"}
                </button>

                <button 
                    type="reset" 
                    className="bg-white text-black border p-3 rounded w-full"
                >
                    Reset
                </button>
            </div>
        </form>
    );
};

export default InvoiceForm;
