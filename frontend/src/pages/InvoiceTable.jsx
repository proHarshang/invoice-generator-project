
const InvoiceTable = () => {

    const invoices = [
        {
            invoiceNumber: "INV-001",
            customerName: "John Doe",
            email: "john.doe@example.com",
            dueDate: "2024-02-15",
            discounts: "$10",
            subtotal: "$100",
            taxes: "$5",
            shippingCharges: "$8",
            grandTotal: "$103",
            status: "Paid",
            issueDate: "2024-02-01",
            note: "Thank you for your business!"
        },
        {
            invoiceNumber: "INV-002",
            customerName: "Jane Smith",
            email: "jane.smith@example.com",
            dueDate: "2024-02-20",
            discounts: "$15",
            subtotal: "$200",
            taxes: "$10",
            shippingCharges: "$5",
            grandTotal: "$200",
            status: "Unpaid",
            issueDate: "2024-02-05",
            note: "Payment due within 15 days."
        },
        {
            invoiceNumber: "INV-003",
            customerName: "Alice Brown",
            email: "alice.brown@example.com",
            dueDate: "2024-02-18",
            discounts: "$5",
            subtotal: "$150",
            taxes: "$7",
            shippingCharges: "$6",
            grandTotal: "$158",
            status: "Pending",
            issueDate: "2024-02-08",
            note: "Pending approval."
        },
        {
            invoiceNumber: "INV-004",
            customerName: "Robert Johnson",
            email: "robert.johnson@example.com",
            dueDate: "2024-02-25",
            discounts: "$20",
            subtotal: "$250",
            taxes: "$12",
            shippingCharges: "$10",
            grandTotal: "$252",
            status: "Paid",
            issueDate: "2024-02-10",
            note: "Discount applied for loyalty."
        },
        {
            invoiceNumber: "INV-005",
            customerName: "Emily Davis",
            email: "emily.davis@example.com",
            dueDate: "2024-02-22",
            discounts: "$0",
            subtotal: "$180",
            taxes: "$9",
            shippingCharges: "$7",
            grandTotal: "$196",
            status: "Overdue",
            issueDate: "2024-02-12",
            note: "Late fee may apply."
        }
    ];

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

    return (
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
                                <td>{item.invoiceNumber}</td>
                                <td>{item.customerName}</td>
                                <td>{item.email}</td>
                                <td>{formatDate(item?.dueDate)}</td>
                                <td>{item.discounts}</td>
                                <td>{item.shippingCharges}</td>
                                <td>{item.taxes}</td>
                                <td>{item.subtotal}</td>
                                <td>{item?.grandTotal}</td>
                                <td>{item?.status}</td>
                                <td>{formatDate(item?.issueDate)}</td>
                                <td>{item?.note}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default InvoiceTable