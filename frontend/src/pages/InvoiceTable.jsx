import { useEffect, useState } from "react";
import axios from "axios";

const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/invoices`); // Adjust API URL
                const data = await response.json();
                setInvoices(data);
            } catch (error) {
                console.error("Error fetching invoices:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    if (loading) {
        return <p>Loading invoices...</p>;
    }

    console.log("invoices", invoices)

    const formatDate = (dateString) => {
        if (!dateString) return "Not Modified Yet";
        const date = new Date(dateString);
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const handleSubmit = async (url) => {
        try {
            const response = await axios.get(url);
            console.log("Response:", response);
            alert("Invoice processed successfully!");
        } catch (err) {
            console.log("Error:", err);
            alert("Error processing invoice");
        }
    };
    return (
        <div className="overflow-scroll">
            <div className="container !pt-10 !px-0 !mx-10">
                <div className="pb-5">
                    <h1 className="font-bold text-2xl">All Invoices</h1>
                </div>
                <table className='invoice-table'>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Invoice No</th>
                            <th className="text-wrap">Customer</th>
                            <th>Email</th>
                            <th>Due Date</th>
                            <th>Discounts</th>
                            <th>Shipping</th>
                            <th>Taxes</th>
                            <th>Subtotal</th>
                            <th>Grand Total</th>
                            <th>Status</th>
                            <th>Issue Date</th>
                            <th>Note</th>
                            <th>
                                <h1 className="text-center">
                                    Actions
                                </h1>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices?.map((item, index) => {
                            return (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.invoice_number}</td>
                                    <td>{item.customer_name}</td>
                                    <td>{item.customer_email}</td>
                                    <td>{formatDate(item?.due_date)}</td>
                                    <td>{item.discounts}</td>
                                    <td>{item.shippingCharges}</td>
                                    <td>{item.taxes}</td>
                                    <td>{item.subtotal}</td>
                                    <td>{item?.total}</td>
                                    <td>{item?.status}</td>
                                    <td>{formatDate(item?.issue_date)}</td>
                                    <td>{item?.note}</td>
                                    <td className="flex items-center gap-2 w-full">
                                        <div className="action-buttons w-1/2">
                                            <button type="button" onClick={() => handleSubmit(`${import.meta.env.VITE_BASE_URL}/generate-invoice-pdf/${item.id}`)} className="download-button hover:bg-zinc-300">Download</button>
                                            <button type="button" className="delete-button hover:bg-zinc-300">Download and Send</button>
                                        </div>
                                        <div className="action-buttons w-1/2">
                                            <button type="button" className="delete-button hover:bg-zinc-300">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default InvoiceTable