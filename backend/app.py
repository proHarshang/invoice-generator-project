from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Initialize Flask app and database
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///invoices.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Enable CORS globally
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Handle preflight requests globally
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", request.headers.get("Origin", "*"))
        response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 204  # No content response for OPTIONS

# Sample route
@app.route("/")
def home():
    return jsonify({"message": "Hello from Flask!"})

# Import routes AFTER initializing db
from routes import *

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8000)
