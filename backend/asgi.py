from flask import Flask
from flask_asgi import ASGIApp  # Converts Flask to ASGI

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello from Flask ASGI!"

# Convert Flask to ASGI
asgi_app = ASGIApp(app)

if __name__ == "__main__":
    app.run()
