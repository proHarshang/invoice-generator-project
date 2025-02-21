import { useEffect, useState } from "react";

const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingDownload, setLoadingDownload] = useState(null);
    const [loadingSend, setLoadingSend] = useState(null);
    const [loadingDelete, setLoadingDelete] = useState(null);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/invoices`);
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

    const downloadPDF = async (invoiceId) => {
        setLoadingDownload(invoiceId);
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/generate-invoice-pdf/${invoiceId}`);
            const data = await response.json();
            console.log("data", data);

            if (data.pdf) {
                // ✅ Open the correct relative URL
                window.open(`${import.meta.env.VITE_BASE_URL}/static/${data.pdf}`, "_blank");
            } else {
                console.error("Error generating PDF:", data.message);
            }
        } catch (error) {
            console.error("Error downloading invoice:", error);
        } finally {
            setLoadingDownload(null);
        }
    };

    const generateAndSendPDF = async (invoiceId) => {
        setLoadingSend(invoiceId);
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/generate-and-send-invoice-pdf/${invoiceId}`);
            const data = await response.json();
            alert(data.message); // Show confirmation message
        } catch (error) {
            console.error("Error sending invoice:", error);
        } finally {
            setLoadingSend(null);
        }
    };

    const deleteInvoice = async (invoiceId) => {
        setLoadingDelete(invoiceId);
        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/delete-invoice/${invoiceId}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            alert(data.message); // Show confirmation message
            setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
        } catch (error) {
            console.error("Error deleting invoice:", error);
        } finally {
            setLoadingDelete(null);
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
                            <th>Taxes</th>
                            <th>Subtotal</th>
                            <th>Grand Total</th>
                            <th>Status</th>
                            <th>Issue Date</th>
                            <th>Note</th>
                            <th><h1 className="text-center">Actions</h1></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.invoice_number}</td>
                                <td>{item.customer_name}</td>
                                <td>{item.customer_email}</td>
                                <td>{formatDate(item?.due_date)}</td>
                                <td>{item.discounts}</td>
                                <td>{item.taxes}</td>
                                <td>{item.subtotal}</td>
                                <td>{item?.total}</td>
                                <td>{item?.status}</td>
                                <td>{formatDate(item?.issue_date)}</td>
                                <td>{item?.note}</td>
                                <td className="flex flex-col items-center w-full">
                                    <div className="action-buttons flex gap-2 mb-2">
                                        <button
                                            type="button"
                                            className="download-button hover:bg-zinc-300"
                                            onClick={() => downloadPDF(item.id)}
                                            disabled={loadingDownload === item.id}
                                        >
                                            {loadingDownload === item.id ? "Downloading..." : "Download"}
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-button hover:bg-zinc-300"
                                            onClick={() => deleteInvoice(item.id)}
                                            disabled={loadingDelete === item.id}
                                        >
                                            {loadingDelete === item.id ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                    <div className="action-buttons">
                                        <button
                                            type="button"
                                            className="download-send-button hover:bg-zinc-300 text-nowrap"
                                            onClick={() => generateAndSendPDF(item.id)}
                                            disabled={loadingSend === item.id}
                                        >
                                            {loadingSend === item.id ? "Sending..." : "Download and Send"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoiceTable;