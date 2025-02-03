import InvoiceForm from "../components/InvoiceForm";

const InoiceForm = () => {
    return (
        <div className="container !pt-10 !px-0 !mx-10">
            <div className="pb-5">
                <h1 className="font-bold text-2xl">Create Invoice</h1>
            </div>
            <InvoiceForm />
        </div>
    );
}

export default InoiceForm