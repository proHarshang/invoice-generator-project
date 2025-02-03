from flask import request, jsonify
from app import app, db
from models import Invoice
from pdf_generator import generate_invoice_pdf

@app.route('/generate-invoice', methods=['POST'])
def generate_invoice():
    data = request.json  # Get the data sent in the body of the POST request
    client_name = data['client_name']
    items = data['items']
    total_amount = data['total_amount']

    # Create a new invoice in the database
    invoice = Invoice(client_name=client_name, items=items, total_amount=total_amount)
    db.session.add(invoice)
    db.session.commit()

    # Generate PDF and return its URL or filename
    pdf_filename = generate_invoice_pdf(invoice)
    return jsonify({'message': 'Invoice generated', 'pdf': pdf_filename})

@app.route('/invoices', methods=['GET'])
def get_invoices():
    invoices = Invoice.query.all()  # Get all invoices from the database
    return jsonify([{'id': invoice.id, 'client_name': invoice.client_name, 'total_amount': invoice.total_amount} for invoice in invoices])
