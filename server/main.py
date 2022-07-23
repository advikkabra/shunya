from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

API_KEY = "JRF4976WPEMBF0N3JE8MNQGHYC1X"
headers = {"Authorization": f"Bearer: {API_KEY}" }
estimate = 'https://beta3.api.climatiq.io/estimate'

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
        return jsonify(response)

@app.route("/api/shopping/data", methods=["POST"])
def shopping_data():
    if request.method == "POST":
        data = request.get_json()

        total = 0
        for item in data["items"]:
            if item["category"] == "Shoes & Handbags":
                payload = {
                    "emission_factor": {
                        "activity_id": "consumer_goods-type_leather_leather_products"
                    },
                    "parameters": {
                        "money": item["price"] // 80,
                        "money_unit": "eur"
                    }
                }
                response = requests.post(estimate, json=payload, headers=headers).json()
                total += response["co2e"]
            if item["category"] == "Clothing & Accessories":
                payload = {
                    "emission_factor": {
                        "activity_id": "consumer_goods-type_clothing"
                    },
                    "parameters": {
                        "money": item["price"] // 80,
                        "money_unit": "eur"
                    }
                }
                response = requests.post(estimate, json=payload, headers=headers).json()
                total += response["co2e"]
            if item["category"] == "Computers & Accessories":
                payload = {
                    "emission_factor": {
                        "activity_id": "electronics-type_computers"
                    },
                    "parameters": {
                        "money": item["price"] // 80,
                        "money_unit": "eur"
                    }
                }
                response = requests.post(estimate, json=payload, headers=headers).json()
                total += response["co2e"]
            return jsonify({"emissions": total})

if __name__ == '__main__':
    app.run(debug=True)

