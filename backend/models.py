from app import db

class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(100), nullable=False)
    items = db.Column(db.Text, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    date_created = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f"<Invoice {self.id} - {self.client_name}>"
