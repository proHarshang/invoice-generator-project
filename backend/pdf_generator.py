import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from models import CompanySettings

def generate_invoice_pdf(invoice):
    # Path where PDF will be saved
    pdf_path = os.path.join('backend', 'static', f'invoice_{invoice.id}.pdf')

    # Check if the directory exists, if not, create it
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)  # This will create the 'static' folder if it doesn't exist

    c = canvas.Canvas(pdf_path)
    width, height = letter

    # Fetch company settings
    company_settings = CompanySettings.query.first()

    if company_settings:
        # Draw company logo
        if company_settings.company_logo:
            logo_path = os.path.join('backend', 'static', company_settings.company_logo)
            if os.path.exists(logo_path):
                logo = ImageReader(logo_path)
                c.drawImage(logo, 40, height - 100, width=100, height=50, preserveAspectRatio=True, mask='auto')

        # Draw company details
        c.setFont("Helvetica-Bold", 12)
        c.drawString(150, height - 50, company_settings.company_name)
        c.setFont("Helvetica", 10)
        c.drawString(150, height - 65, company_settings.company_address)
        c.drawString(150, height - 80, f"Website: {company_settings.company_website}")
        c.drawString(150, height - 95, f"Email: {company_settings.contact_email}")

    # Your PDF generation logic here
    c.setFont("Helvetica", 12)
    c.drawString(100, 750, f"Invoice ID: {invoice.id}")
    c.drawString(100, 730, f"Client: {invoice.customer_name}")
    c.drawString(100, 710, f"Total: ${invoice.total}")

    # Save the generated PDF
    c.save()

    return pdf_path  # Return the path to the saved PDF
