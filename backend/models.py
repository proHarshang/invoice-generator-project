from app import db
from sqlalchemy.dialects.postgresql import JSON
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import date


class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    invoice_number = db.Column(db.String(100), nullable=False, unique=True)
    customer_name = db.Column(db.String(100), nullable=False)
    customer_email = db.Column(db.String(100), nullable=False)
    items = db.Column(JSON, nullable=False)  # Storing items as JSON
    discounts = db.Column(db.Integer, nullable=False)
    subtotal = db.Column(db.Integer, nullable=False)
    taxes = db.Column(db.Integer, nullable=False)
    total = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(50), nullable=False)
    due_date = db.Column(db.Date, nullable=False)  # Changed to db.Date
    issue_date = db.Column(db.Date, default=date.today)  # Changed to db.Date
    note = db.Column(db.Text, nullable=True)
    
    def __repr__(self):
        return f"<Invoice {self.invoice_number} - {self.customer_name}>"
    
    
class CompanySettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_logo = db.Column(db.String(200), nullable=True)
    company_name = db.Column(db.String(100), nullable=False)
    company_address = db.Column(db.String(200), nullable=False)
    contact_number = db.Column(db.String(20), nullable=False)
    contact_email = db.Column(db.String(100), nullable=False)
    company_website = db.Column(db.String(100), nullable=True)
    tax_identification_number = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"<CompanySettings {self.company_name}>"
    
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.email}>"