from app import app, db
from models import Invoice

def create_db():
    # Use the app context to create the tables
    with app.app_context():
        db.create_all()
        print("Database and tables created successfully!")

if __name__ == '__main__':
    create_db()
