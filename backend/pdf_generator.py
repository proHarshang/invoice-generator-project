import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
from models import CompanySettings


def generate_invoice_pdf(invoice):
    # Define save path inside "static"
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

    # Draw company logo (if available)
    if company_settings and company_settings.company_logo:
        logo_path = os.path.join(base_dir, "static", company_settings.company_logo)
        if os.path.exists(logo_path):
            logo = ImageReader(logo_path)
            c.drawImage(logo, 40, height - 100, width=120, height=60, preserveAspectRatio=True, mask='auto')

    # Company Details
    c.setFont("Helvetica-Bold", 14)
    c.drawString(180, height - 50, company_settings.company_name or "Your Company Name")
    c.setFont("Helvetica", 10)
    c.drawString(180, height - 65, company_settings.company_address or "Company Address")
    c.drawString(180, height - 80, f"Website: {company_settings.company_website or 'N/A'}")
    c.drawString(180, height - 95, f"Email: {company_settings.contact_email or 'N/A'}")

    # Invoice Title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(400, height - 50, "INVOICE")

    # Invoice Details
    c.setFont("Helvetica", 12)
    c.drawString(400, height - 80, f"Invoice #: {invoice.invoice_number}")
    c.drawString(400, height - 95, f"Issue Date: {invoice.issue_date}")
    c.drawString(400, height - 110, f"Due Date: {invoice.due_date}")

    # Customer Details
    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, height - 140, "Bill To:")
    c.setFont("Helvetica", 12)
    c.drawString(100, height - 140, invoice.customer_name)
    c.drawString(100, height - 155, invoice.customer_email)

    # Table Headers (Updated Order: S.No, Description, Unit Price, QTY, Total)
    table_data = [["S.No", "DESCRIPTION", "UNIT PRICE", "QTY", "TOTAL"]]

    # Add invoice items to table
    for index, item in enumerate(invoice.items, start=1):
        table_data.append([
            index,  # Serial number
            item["unit_name"],  # Description
            f"${item['unit_cost']}",  # Unit Price
            item["qty"],  # QTY moved after Unit Price
            f"${item['total']}"  # Total
        ])

    # Add subtotal, tax, discount, total
    table_data.append(["", "", "", "Subtotal:", f"${invoice.subtotal}"])
    table_data.append(["", "", "", "Taxes:", f"${invoice.taxes}"])
    table_data.append(["", "", "", "Discounts:", f"-${invoice.discounts}"])
    table_data.append(["", "", "", "Grand Total:", f"${invoice.total}"])

    # Create Table
    table = Table(table_data, colWidths=[40, 230, 80, 60, 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 6),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    # Draw Table
    table.wrapOn(c, width, height)
    table.drawOn(c, 40, height - 300)

    # Notes Section
    c.setFont("Helvetica", 10)
    c.drawString(40, height - 350, "Note:")
    c.setFont("Helvetica-Oblique", 10)
    c.drawString(80, height - 350, invoice.note or "No additional notes.")

    # Save PDF
    c.save()

    return pdf_path  # Return the saved PDF path
