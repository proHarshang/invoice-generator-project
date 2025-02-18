import { Link } from "react-router-dom"

function header() {
    return (
        <div className="navbar bg-[#D7D4D4] p-10 py-5 pt-6 items-center flex justify-between">
            <div>
                <span className="btn btn-ghost text-3xl">INVOICE GENERATOR</span>
            </div>
            <div className="text-lg flex gap-7 items-center">
                <Link to='/invoice-table' className="active:scale-95 hover:underline transition-all">Table</Link>
                <Link to='/invoice-form' className="active:scale-95 hover:underline transition-all">Create</Link>
                <Link to='/settings' className="active:scale-95 hover:underline transition-all">Settings</Link>
                <Link to='/logout' className="active:scale-95 hover:underline transition-all">Logout</Link>
            </div>
        </div>
    )
}

export default header