import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("./key.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

app = Flask(__name__)
CORS(app)

API_KEY = "JRF4976WPEMBF0N3JE8MNQGHYC1X"
headers = {"Authorization": f"Bearer: {API_KEY}" }
estimate = 'https://beta3.api.climatiq.io/estimate'

def get_goods_estimate(item, act_id):
    payload = {
        "emission_factor": {
            "activity_id": f"{act_id}"
        },
        "parameters": {
            "money": item["price"] // 80,
            "money_unit": "eur"
        }
    }
    response = requests.post(estimate, json=payload, headers=headers).json()
    return response

def increment_monthly(emissions, email):
    month = datetime.datetime.now().date().month - 1
    year = datetime.datetime.now().date().year

    monthly_ref = db.collection("monthly").where('month', '==', month).where('year', '==', year).where('email', '==', email).get()

    if monthly_ref:
        for item in monthly_ref:
            doc = db.collection("monthly").document(item.id)
            doc.update({"emissions": firestore.Increment(emissions)})
    else:
        db.collection("monthly").add({"month": month, "year": year, "emissions": emissions, "email":email})


@app.route('/')
def home():
    return "<title>Welcome to the Shunya API</title>"

@app.route('/api/flights', methods=["POST"])
def post_flightdata():
    if request.method == "POST":
        data = request.get_json()
        payload = {"legs": []}
        for route in data['routes']:
            payload["legs"].append({
                "from": route["from"],
                "to": route["to"],
                "passengers": route["passengers"],
                "class": "economy"
            })
        response = requests.post('https://beta3.api.climatiq.io/travel/flights', json=payload, headers=headers).json()
        
        for i in range(len(data['routes'])):
            doc = {
                'description': f"{data['routes'][i]['from']} --> {data['routes'][i]['to']}",
                'emissions': response['legs'][i]['co2e'],
                'date': datetime.datetime.now().date().day,
                'month': datetime.datetime.now().date().month - 1,
                'year': datetime.datetime.now().date().year,
                'email': data['routes'][i]['email']
            }

            db.collection('transactions').add(doc)
            increment_monthly(response['legs'][i]['co2e'], data['routes'][i]['email'])

        return jsonify(response)

@app.route("/api/shopping/data", methods=["POST"])
def shopping_data():
    if request.method == "POST":
        data = request.get_json()

        total = 0
        for item in data["items"]:
            if item["category"] == "Shoes & Handbags":
                response = get_goods_estimate(item, "consumer_goods-type_leather_leather_products")
                total += response["co2e"]
            if item["category"] == "Clothing & Accessories":
                response = get_goods_estimate(item, "consumer_goods-type_clothing")
                total += response["co2e"]
            if item["category"] == "Computers & Accessories":
                response = get_goods_estimate(item, "electronics-type_computers")
                total += response["co2e"]
            return jsonify({"emissions": total})

@app.route('/api/shopping', methods=["POST"])
def shopping():
    if request.method == "POST":
        data = request.get_json()

        for item in data["items"]:
            response = {}
            if item["category"] == "Shoes & Handbags":
                response = get_goods_estimate(item, "consumer_goods-type_leather_leather_products")
            if item["category"] == "Clothing & Accessories":
                response = get_goods_estimate(item, "consumer_goods-type_clothing")
            if item["category"] == "Computers & Accessories":
                response = get_goods_estimate(item, "electronics-type_computers")
            doc = {
                'description': item["title"],
                'emissions': response['co2e'],
                'date': datetime.datetime.now().date().day,
                'month': datetime.datetime.now().date().month - 1,
                'year': datetime.datetime.now().date().year,
                'email': item['email']
            }

            db.collection('transactions').add(doc)
            increment_monthly(response['co2e'], item['email'])

        return jsonify(data)

@app.route('/api/getdashboard', methods=["POST"])
def get_dashboard():
    if request.method == "POST":
        data = request.get_json()
        month_names = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]
        emissions = []
        months = []
        transactions = []

        monthly_ref = db.collection("monthly").where('email', '==', data["email"]).get()

        monthly_data = []
        
        if monthly_ref:
            for item in monthly_ref:
                monthly_data.append(item)
                
        monthly_data = sorted(monthly_data, key=lambda x: (x.get("year") * 100 + x.get("month")), reverse=True)

        for item in monthly_data:
            emissions.append(round(item.get("emissions"), 1))
            months.append(f'{month_names[item.get("month")]} {item.get("year")}')

        transactions_ref = db.collection("transactions").where('email', '==', data["email"]).get()

        transactions_data = []
        if transactions_ref:
            for item in transactions_ref:
                transactions_data.append(item)
                
        transactions_data = sorted(transactions_data, key=lambda x: (x.get("year") * 10000 + x.get("month") * 100 + x.get("date")), reverse=True)

        for item in transactions_data:
            transactions.append({
                "date": item.get("date"),
                "month": item.get("month"),
                "year": item.get("year"),
                "description": item.get("description"),
                "emissions": item.get("emissions")
            })


        return jsonify({"emissions": emissions, "months": months, "transactions": transactions})

if __name__ == '__main__':
    app.run(debug=True)

