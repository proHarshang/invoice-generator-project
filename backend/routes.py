from flask import request, jsonify
from app import app, db
from models import Invoice, CompanySettings, User
from pdf_generator import generate_invoice_pdf
from email_sender import send_email
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data['email']
    password = data['password']

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 400

    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return jsonify({'message': 'Invalid email or password'}), 401

    return jsonify({'message': 'Login successful'})

@app.route('/save-invoice', methods=['POST'])
def save_invoice():
    try:
        data = request.get_json()
        app.logger.info(f"Received data: {data}")

        if not data:
            return jsonify({"error": "No data provided"}), 400

        invoice = Invoice(
            invoice_number=data.get("invoice_number"),
            customer_name=data.get("customer_name"),
            customer_email=data.get("customer_email"),
            items=data.get("items"),  # Ensure items are included
            subtotal=float(data.get("subtotal", 0)),  # Ensure it's a float
            total=float(data.get("total", 0)),
            discounts=float(data.get("discounts", 0)),
            taxes=float(data.get("taxes", 0)),
            status=data.get("status"),
            due_date=datetime.strptime(data.get("due_date"), "%Y-%m-%d") if data.get("due_date") else None,
            issue_date=datetime.strptime(data.get("issue_date"), "%Y-%m-%d") if data.get("issue_date") else None,
            note=data.get("note"),
        )

        db.session.add(invoice)
        db.session.commit()

        return jsonify({"message": "Invoice saved successfully", "invoice_id": invoice.id}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error saving invoice: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route('/save-and-generate-invoice-pdf', methods=['POST'])
def generate_invoice():
    try:
        data = request.get_json()

        # Extract required fields
        invoice_number = data["invoice_number"]
        customer_name = data["customer_name"]
        customer_email = data["customer_email"]
        items = data["items"]
        discounts = data.get("discounts", 0)
        subtotal = data["subtotal"]
        taxes = data["taxes"]
        total = data["total"]
        status = data["status"]

        # Convert date fields properly
        issue_date_str = data.get("issue_date", None)
        due_date_str = data.get("due_date", None)

        issue_date = datetime.strptime(issue_date_str, "%Y-%m-%d").date() if issue_date_str else datetime.utcnow().date()
        due_date = datetime.strptime(due_date_str, "%Y-%m-%d").date() if due_date_str else None

        note = data.get("note", "")

        # Save the invoice to the database
        invoice = Invoice(
            invoice_number=invoice_number,
            customer_name=customer_name,
            customer_email=customer_email,
            items=items,
            discounts=discounts,
            subtotal=subtotal,
            taxes=taxes,
            total=total,
            status=status,
            due_date=due_date,
            issue_date=issue_date,
            note=note
        )

        db.session.add(invoice)
        db.session.commit()

        # Generate PDF
        pdf_filename = generate_invoice_pdf(invoice)

        return jsonify({'message': 'Invoice generated successfully', 'pdf': pdf_filename}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to generate invoice', 'details': str(e)}), 500

@app.route('/generate-invoice-pdf/<int:id>', methods=['GET'])
def generate_invoice_pdf_by_id(id):
    invoice = Invoice.query.get_or_404(id)
    pdf_filename = generate_invoice_pdf(invoice)
    return jsonify({'message': 'Invoice PDF generated', 'pdf': pdf_filename})

@app.route('/generate-and-send-invoice-pdf/<int:id>', methods=['GET'])
def generate_and_send_invoice_pdf(id):
    invoice = Invoice.query.get_or_404(id)
    pdf_filename = generate_invoice_pdf(invoice)
    
    # Send the PDF to the customer's email
    subject = f"Invoice {invoice.invoice_number}"
    body = f"Dear {invoice.customer_name},\n\nPlease find attached your invoice.\n\nThank you."
    send_email(invoice.customer_email, subject, body, pdf_filename)
    
    return jsonify({'message': 'Invoice PDF generated and sent to customer', 'pdf': pdf_filename})

@app.route('/invoices', methods=['GET'])
def get_invoices():
    invoices = Invoice.query.all()  # Get all invoices from the database
    return jsonify([{
        'id': invoice.id,
        'invoice_number': invoice.invoice_number,
        'customer_name': invoice.customer_name,
        'customer_email': invoice.customer_email,
        'items': invoice.items,
        'discounts': invoice.discounts,
        'subtotal': invoice.subtotal,
        'taxes': invoice.taxes,
        'total': invoice.total,
        'status': invoice.status,
        'due_date': invoice.due_date,
        'issue_date': invoice.issue_date,
        'note': invoice.note
    } for invoice in invoices])
    
@app.route('/update-invoice/<int:id>', methods=['PUT'])
def update_invoice(id):
    data = request.json
    invoice = Invoice.query.get_or_404(id)

    invoice.invoice_number = data['invoice_number']
    invoice.customer_name = data['customer_name']
    invoice.customer_email = data['customer_email']
    invoice.items = data['items']
    invoice.discounts = data['discounts']
    invoice.subtotal = data['subtotal']
    invoice.taxes = data['taxes']
    invoice.total = data['total']
    invoice.status = data['status']
    invoice.due_date = data['due_date']
    invoice.issue_date = data.get('issue_date', invoice.issue_date)
    invoice.note = data.get('note', invoice.note)

    db.session.commit()
    return jsonify({'message': 'Invoice updated'})

@app.route('/delete-invoice/<int:id>', methods=['DELETE'])
def delete_invoice(id):
    invoice = Invoice.query.get_or_404(id)
    db.session.delete(invoice)
    db.session.commit()
    return jsonify({'message': 'Invoice deleted'})

@app.route('/delete-all-invoices', methods=['DELETE'])
def delete_all_invoices():
    try:
        num_rows_deleted = db.session.query(Invoice).delete()
        db.session.commit()
        return jsonify({'message': f'{num_rows_deleted} invoices deleted'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete invoices', 'error': str(e)}), 500

@app.route('/drop-invoice-table', methods=['DELETE'])
def drop_invoice_table():
    try:
        Invoice.__table__.drop(db.engine)
        db.session.commit()
        return jsonify({'message': 'Invoice table dropped'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to drop invoice table', 'error': str(e)}), 500

# Company Settings Endpoints
@app.route('/company-settings', methods=['GET'])
def get_company_settings():
    settings = CompanySettings.query.first()
    if settings:
        return jsonify({
            'company_logo': settings.company_logo,
            'company_name': settings.company_name,
            'company_address': settings.company_address,
            'contact_number': settings.contact_number,
            'contact_email': settings.contact_email,
            'company_website': settings.company_website,
            'tax_identification_number': settings.tax_identification_number
        })
    else:
        return jsonify({'message': 'No company settings found'}), 404

@app.route('/company-settings', methods=['POST'])
def create_company_settings():
    data = request.json
    settings = CompanySettings(
        company_logo=data.get('company_logo'),
        company_name=data['company_name'],
        company_address=data['company_address'],
        contact_number=data['contact_number'],
        contact_email=data['contact_email'],
        company_website=data.get('company_website'),
        tax_identification_number=data['tax_identification_number']
    )
    db.session.add(settings)
    db.session.commit()
    return jsonify({'message': 'Company settings created'})

@app.route('/company-settings', methods=['PUT'])
def update_company_settings():
    data = request.form
    settings = CompanySettings.query.first()
    if not settings:
        return jsonify({'message': 'No company settings found'}), 404

    settings.company_name = data.get('company_name', settings.company_name)
    settings.company_address = data.get('company_address', settings.company_address)
    settings.contact_number = data.get('contact_number', settings.contact_number)
    settings.contact_email = data.get('contact_email', settings.contact_email)
    settings.company_website = data.get('company_website', settings.company_website)
    settings.tax_identification_number = data.get('tax_identification_number', settings.tax_identification_number)

    if 'company_logo' in request.files:
        logo = request.files['company_logo']
        logo_filename = f"company_logo_{settings.id}.png"
        logo_path = os.path.join('static', logo_filename)
        logo.save(logo_path)
        settings.company_logo = logo_filename

    db.session.commit()
    return jsonify({
        'message': 'Company settings updated',
        'company_logo': settings.company_logo,
        'company_name': settings.company_name,
        'company_address': settings.company_address,
        'contact_number': settings.contact_number,
        'contact_email': settings.contact_email,
        'company_website': settings.company_website,
        'tax_identification_number': settings.tax_identification_number
    })