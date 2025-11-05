File path: /service_site/app.py
Minimal Flask app using SQLAlchemy. It uses DATABASE_URL env var (Postgres) if present,
otherwise falls back to a local SQLite file (development only).
"""
import os
from flask import Flask, render_template, request, redirect, url_for
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import declarative_base, sessionmaker
from urllib.parse import urlparse

# Config
DATABASE_URL = os.environ.get("DATABASE_URL")  # e.g. postgresql://user:pass@host:port/dbname
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///orders.db"  # dev fallback

# Create engine & session
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    service = Column(String(200), nullable=False)
    link = Column(Text, nullable=True)
    amount = Column(Integer, nullable=False)
    status = Column(String(50), default="Pending")

# Create tables
Base.metadata.create_all(bind=engine)

app = Flask(__name__)

SERVICES = [
    {"name": "10K Instagram Followers", "price": 49},
    {"name": "50K Instagram Post Likes", "price": 29},
    {"name": "100K Instagram Reel Views", "price": 39},
    {"name": "1K YouTube Subscribers", "price": 49},
    {"name": "10K YouTube Views", "price": 39},
]

@app.route("/")
def home():
    return render_template("index.html", services=SERVICES)

@app.route("/order/<int:idx>")
def order(idx):
    try:
        item = SERVICES[idx]
    except IndexError:
        return "Service not found", 404
    return render_template("payment.html", service=item["name"], amount=item["price"])

@app.route("/pay", methods=["POST"])
def pay():
    service = request.form.get("service")
    link = request.form.get("link", "")
    amount = int(request.form.get("amount", 0))
    db = SessionLocal()
    order = Order(service=service, link=link, amount=amount, status="Pending")
    db.add(order)
    db.commit()
    db.refresh(order)
    db.close()
    # In production, here you'd redirect to a real payment gateway (Razorpay/Stripe) flow.
    return redirect(url_for("success"))

@app.route("/success")
def success():
    return render_template("success.html")

if __name__ == "__main__":
    # Dev server (not for production on Render — Render uses gunicorn)
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)