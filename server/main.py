from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

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
            if item["category"] == "Shoes & Handbags":
                pass
            if item["category"] == "Clothing & Accessories":
                pass
            if item["category"] == "Computers & Accessories":
                pass


if __name__ == '__main__':
    app.run(debug=True)

