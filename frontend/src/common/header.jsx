
function header() {
    return (
        <div className="navbar bg-[#D7D4D4] p-10 py-5 pt-6 items-end flex justify-between">
            <div>
                <a className="btn btn-ghost text-3xl">LOGO</a>
            </div>
            <div className="text-lg flex gap-7 items-center">
                <a href="/invoice-form">Create</a>
                <a href="">Settings</a>
                <a href="">Logout</a>
            </div>
        </div >
    )
}

export default header