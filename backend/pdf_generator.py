import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from models import CompanySettings


def generate_invoice_pdf(invoice):
 # Define the correct save path inside "static"
    base_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_dir = os.path.join(base_dir, "static")
    
    os.makedirs(pdf_dir, exist_ok=True)  # Ensure folder exists

    # Save path
    pdf_filename = f"invoice_{invoice.id}.pdf"
    pdf_path = os.path.join(pdf_dir, pdf_filename)

    # Generate PDF
    c = canvas.Canvas(pdf_path, pagesize=letter)
    width, height = letter

    # Fetch company settings
    company_settings = CompanySettings.query.first()
    
    if company_settings and company_settings.company_logo:
        logo_path = os.path.join(base_dir, "static", company_settings.company_logo)
        if os.path.exists(logo_path):
            logo = ImageReader(logo_path)
            c.drawImage(logo, 40, height - 100, width=100, height=50, preserveAspectRatio=True, mask='auto')

        # Draw company details
        c.setFont("Helvetica-Bold", 12)
        c.drawString(150, height - 50, company_settings.company_name or "No Name")
        c.setFont("Helvetica", 10)
        c.drawString(150, height - 65, company_settings.company_address or "No Address")
        c.drawString(150, height - 80, f"Website: {company_settings.company_website or 'N/A'}")
        c.drawString(150, height - 95, f"Email: {company_settings.contact_email or 'N/A'}")

    # Debugging invoice data
    print("Invoice Data:", invoice)

    # Ensure invoice attributes exist
    customer_name = invoice.customer_name if hasattr(invoice, 'customer_name') else "Unknown Customer"
    total_amount = invoice.total if hasattr(invoice, 'total') else 0

    # Add invoice details
    c.setFont("Helvetica", 12)
    c.drawString(100, 750, f"Invoice ID: {invoice.id}")
    c.drawString(100, 730, f"Client: {customer_name}")
    c.drawString(100, 710, f"Total: ${total_amount}")

    # Save PDF
    c.save()

    return pdf_path  # Return the saved PDF path
