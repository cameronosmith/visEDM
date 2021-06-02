from flask import Flask, jsonify, request
from flask_cors import CORS

from sklearn.decomposition import PCA

import pyEDM

import pdb;
import numpy as np
f=pdb.set_trace

DEBUG = True

# instantiate the app
app = Flask("pyEDM_server")

CORS(app, resources={r'/*': {'origins': '*'}})

df = pyEDM.sampleData["block_3sp"].round(2)

@app.route('/get_data', methods=['POST'])
def get_data():
    return jsonify({
        'header': df.columns.tolist(),
        'data': df.to_numpy().T.tolist()
    })

@app.route('/get_prediction', methods=['POST'])
def get_prediction():

    try:

        SMAP = request.json.pop("method") == "SMap"

        pred_method = pyEDM.SMap if SMAP else pyEDM.Simplex
        pred=pred_method(**request.json,dataFrame=df)

        if SMAP:
            pred = pred["predictions"]

        return jsonify({"data":pred.dropna().to_numpy().T.tolist()})

    except Exception as inst:
        return str(inst)

@app.route('/get_projection', methods=['POST'])
def get_projection():

    cols = request.json["columns"]
    use_time_axis = request.json["time_axis"] or len(cols)==1
    project_3d = request.json["project_3d"]

    dim = 1 if use_time_axis else 2
    if project_3d: dim += 1
    dim = min(dim,len(cols))

    reduction = PCA(dim).fit_transform(df[cols])
    if use_time_axis:
        reduction = np.append(df[["time"]],reduction,1)

    print(reduction.T.tolist())
    return jsonify({"reduction":reduction.T.tolist()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
