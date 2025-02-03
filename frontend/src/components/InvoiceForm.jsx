import { useState } from "react";
import axios from "axios";

const InvoiceForm = () => {
    const [clientName, setClientName] = useState("");
    const [items, setItems] = useState("");
    const [totalAmount, setTotalAmount] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const invoiceData = { client_name: clientName, items, total_amount: totalAmount };
        try {
            const response = await axios.post("http://127.0.0.1:5000/generate-invoice", invoiceData);
            console.log("response : ", response)
            alert("Invoice generated!");
        } catch (err) {
            console.log("err : ", err)
            alert("Error generating invoice");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <textarea placeholder="Items" value={items} onChange={(e) => setItems(e.target.value)} />
            <input type="number" placeholder="Total Amount" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
            <button type="submit">Generate Invoice</button>
        </form>
    );
};

export default InvoiceForm;
