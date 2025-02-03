import os
from reportlab.pdfgen import canvas

def generate_invoice_pdf(invoice):
    # Path where PDF will be saved
    pdf_path = os.path.join('backend', 'static', f'invoice_{invoice.id}.pdf')

    # Check if the directory exists, if not, create it
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)  # This will create the 'static' folder if it doesn't exist

    c = canvas.Canvas(pdf_path)
    
    # Your PDF generation logic here
    c.drawString(100, 750, f"Invoice ID: {invoice.id}")
    c.drawString(100, 730, f"Client: {invoice.client_name}")
    c.drawString(100, 710, f"Total: ${invoice.total_amount}")
    
    # Save the generated PDF
    c.save()

    return pdf_path  # Return the path to the saved PDF
