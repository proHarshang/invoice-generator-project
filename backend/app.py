from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS 

# Initialize Flask app and database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///invoices.db'  # SQLite database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# CORS(app)
# Enable CORS for the entire app
CORS(app, resources={r"/*": {"origins": [
    "*",
    "https://invoice-generator-project-eiwn.onrender.com",
    "https://invoice-generator-project-server.onrender.com",
    "http://localhost:3000"
]}})

# Import routes after initializing db to avoid circular imports
from routes import *

if __name__ == '__main__':
    app.run(debug=True)
