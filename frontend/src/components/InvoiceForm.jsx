import { useState } from "react";
import axios from "axios";

const InvoiceForm = () => {
    const [invoice, setInvoice] = useState({
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
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://127.0.0.1:5000/generate-invoice", invoice);
            console.log("response : ", response);
            alert("Invoice generated!");
        } catch (err) {
            console.log("err : ", err);
            alert("Error generating invoice");
        }
    };

    return (
        // <form onSubmit={handleSubmit}>
        //     <input type="text" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        //     <textarea placeholder="Items" value={items} onChange={(e) => setItems(e.target.value)} />
        //     <input type="number" placeholder="Total Amount" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
        //     <button type="submit">Generate Invoice</button>
        // </form>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="invoice_number"
                    placeholder="Invoice Number"
                    className="border p-2 w-full bg-[#D7D4D4] text-black"
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="customer_name"
                    placeholder="Customer Name"
                    className="border p-2 w-full bg-[#D7D4D4] text-black"
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="customer_email"
                    placeholder="Customer Email"
                    className="border p-2 w-full bg-[#D7D4D4] text-black"
                    onChange={handleChange}
                />
            </div>

            <h2 className="font-bold mt-4">Items</h2>
            {invoice.items.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 mt-2">
                    <input
                        type="text"
                        name="unit_name"
                        placeholder="Unit Name"
                        className="border p-2 bg-[#D7D4D4] text-black"
                        onChange={(e) => handleItemChange(index, e)}
                    />
                    <input
                        type="number"
                        name="qty"
                        placeholder="Quantity"
                        className="border p-2 bg-[#D7D4D4] text-black"
                        onChange={(e) => handleItemChange(index, e)}
                    />
                    <input
                        type="number"
                        name="unit_cost"
                        placeholder="Unit Cost"
                        className="border p-2 bg-[#D7D4D4] text-black"
                        onChange={(e) => handleItemChange(index, e)}
                    />
                    <input
                        type="number"
                        name="total"
                        value={item.total}
                        readOnly
                        className="border p-2 bg-[#D7D4D4] text-black"
                    />
                </div>
            ))}
            <button type="button" onClick={addItem} className="mt-2 bg-black text-white p-2 rounded">
                + Add Item
            </button>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <input type="number" name="discounts" placeholder="Discounts" className="border p-2 bg-[#D7D4D4] text-black" onChange={handleChange} />
                <input type="number" name="subtotal" placeholder="Subtotal" className="border p-2 bg-[#D7D4D4] text-black" onChange={handleChange} />
                <input type="number" name="taxes" placeholder="Taxes" className="border p-2 bg-[#D7D4D4] text-black" onChange={handleChange} />
                <input type="number" name="total" placeholder="Total" className="border p-2 bg-[#D7D4D4] text-black" onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
                <input type="date" name="due_date" className="border p-2 bg-[#D7D4D4] text-black" onChange={handleChange} />
                <input type="date" name="issue_date" className="border p-2 bg-[#D7D4D4] text-black" onChange={handleChange} />
            </div>

            <textarea name="note" placeholder="Note" className="border p-2 w-full mt-4 bg-[#D7D4D4] text-black" onChange={handleChange}></textarea>

            <button type="submit" className="mt-4 bg-black text-white p-3 rounded w-full">
                Submit Invoice
            </button>
        </form>
    );
};

export default InvoiceForm;
