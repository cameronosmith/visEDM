from flask import Flask, jsonify, request
from flask_cors import CORS

import pdb;
f=pdb.set_trace

DEBUG = True

# instantiate the app
app = Flask("pyEDM_server")

CORS(app, resources={r'/*': {'origins': '*'}})

import seaborn as sns
iris = sns.load_dataset('iris')

@app.route('/get_data', methods=['POST'])
def get_data():
    return jsonify({
        'header': iris.columns.tolist(),
        'data': iris.to_numpy().T.tolist()
    })
@app.route('/run_prediction', methods=['POST'])
def run_prediction():
    data = request.json

if __name__ == '__main__':
    app.run(debug=True, port=5000)
