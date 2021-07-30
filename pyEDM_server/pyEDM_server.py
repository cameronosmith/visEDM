from flask import Flask, jsonify, request
from flask_cors import CORS

from sklearn.decomposition import PCA

import pyEDM

from itertools import product,combinations

import numpy as np
import pandas as pd

import pdb;
f=pdb.set_trace

DEBUG = True

# instantiate the app
app = Flask("pyEDM_server")

CORS(app, resources={r'/*': {'origins': '*'}})

df = pyEDM.sampleData["block_3sp"].round(2)
reduced_df=None
#df = pyEDM.sampleData["sardine_anchovy_sst"].round(2)

@app.route('/get_data', methods=['POST'])
def get_data():
    return jsonify({
        'header': df.columns.tolist(),
        'data': df.to_numpy().T.tolist()
    })

@app.route('/get_prediction', methods=['POST'])
def get_prediction():

    try:
        method_name = request.json.pop("method")
        pred_method = { "SMap"    : pyEDM.SMap,
                        "Simplex" : pyEDM.Simplex,
                        "PredictNonlinear" : pyEDM.PredictNonlinear,
                        "EmbedDimension" : pyEDM.EmbedDimension,
                        "PredictInterval" : pyEDM.PredictInterval,
                      }[method_name]

        pred = pred_method(**request.json,dataFrame=df)

        if pred_method==pyEDM.SMap: pred = pred["predictions"]

        return jsonify({"data":pred.dropna().to_numpy().T.tolist()})

    except Exception as inst:
        return str(inst)

@app.route('/get_node_interactions', methods=['POST'])
def get_node_interactions():

    try:
        nodes = request.json["nodes"]
        transition_mats=[]
        for idx_window in np.array_split(np.arange(df.shape[0]),
                                      df.shape[0]//request.json["window_size"]):
            transition_mat = np.zeros((len(nodes),len(nodes)))
            for row_1,row_2 in zip(idx_window,idx_window[1:]):
                for (i,node_1),(j,node_2) in product(enumerate(nodes),repeat = 2):
                    transition_mat[i,j] += int(row_1 in node_1 and row_2 in node_2)
            transition_mats.append(transition_mat.T.tolist())

        return jsonify({"transition_mats":transition_mats, })

    except Exception as inst:
        return str(inst)

@app.route('/get_stg', methods=['POST'])
def get_stg():

    try:

        obs  = []
        coef = []
        for targ in request.json["columns"]:
            pred = pyEDM.SMap(dataFrame=df, target=targ, **request.json)
            obs.append(pred["predictions"]["Observations"])
            coef.append(pred["coefficients"].iloc[:,2:])
        obs = pd.concat(obs,axis=1)
        obs.columns=request.json["columns"]

        coef = pd.concat(coef,axis=1)
        stg_df = pd.concat([obs,coef],axis=1)

        coef,stg_df = [x.iloc[request.json["Tp"]:-request.json["Tp"]] for x in
                                                                  (coef,stg_df)]

        reduction = PCA(3).fit_transform(stg_df)

        coef_splits = [ x.tolist() for x in np.split(coef.mean(0),
                                              len(request.json["columns"])) ]

        return jsonify({"reduction":reduction.T.tolist(),
                        "coef_mat": coef_splits,
                        })

    except Exception as inst:
        return str(inst)


@app.route('/get_ccm', methods=['POST'])
def get_ccm():

    try:

        # Run pairwise relationship analysis for every column in columns

        results = []

        for c1,c2 in combinations(request.json["columns"],2):

            pred = pyEDM.CCM(dataFrame=df,columns=c1,target=c2,
                             libSizes=request.json["libSizes"],
                             sample=request.json["sample"],E=request.json["E"])

            results.append(("%s:%s"%(c1,c2),
                            pred.iloc[:,[0,1]].to_numpy().T.tolist()))
            results.append(("%s:%s"%(c2,c1),
                            pred.iloc[:,[0,2]].to_numpy().T.tolist()))

        return jsonify(results)

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

    return jsonify({"reduction":reduction.T.tolist()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
