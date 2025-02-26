from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS 
from routes import *

# Initialize Flask app and database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///invoices.db'  # SQLite database URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Enable CORS with necessary headers
CORS(app, supports_credentials=True, origins=[
    "https://invoice-generator-project-eiwn.onrender.com",
    "https://invoice-generator-project-server.onrender.com",
    "http://localhost:3000"
])

# Handle preflight requests
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

# Sample route
@app.route("/")
def home():
    return jsonify({"message": "Hello from Flask!"})

# Explicitly handle OPTIONS requests
@app.route('/<path:path>', methods=['post'])
def handle_options(path):
    return '', 204  # No Content

# Import routes after initializing db to avoid circular imports

if __name__ == '__main__':
    app.run(debug=True)