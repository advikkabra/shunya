from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

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
        headers = {"Authorization": f"Bearer: JRF4976WPEMBF0N3JE8MNQGHYC1X"}
        response = requests.post('https://beta3.api.climatiq.io/travel/flights', json=payload, headers=headers).json()
        return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)

