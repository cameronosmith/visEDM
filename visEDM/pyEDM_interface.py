import pyEDM
from itertools import product,combinations
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA
from sklearn.manifold import Isomap, LocallyLinearEmbedding, MDS, TSNE
from pdb import set_trace as pdb #debug

def low_dim_projection(df,projection_name):

    project = {"PCA":PCA,"Isomap":Isomap,"TSNE":TSNE,"MDS":MDS,
               "LocallyLinearEmbedding":LocallyLinearEmbedding,
               }[projection_name]

    return project(n_components=min(3,df.shape[1])).fit_transform(df.dropna())

class pyEDM_interface():

    def __init__(self,dataFrame):
        self.df = dataFrame

    def get_data(self,request):
        return { 'header': self.df.columns.tolist(),
                 'data':   self.df.to_numpy().T.tolist()
               }

    def get_prediction(self,request):

        method_name = request.pop("method")
        ce_filter = request.pop("cond_emb_filter")


        pred_method = { "SMap"    : pyEDM.SMap,
                        "Simplex" : pyEDM.Simplex,
                        "PredictNonlinear" : pyEDM.PredictNonlinear,
                        "EmbedDimension" : pyEDM.EmbedDimension,
                        "PredictInterval" : pyEDM.PredictInterval,
                      }[method_name]

        if len(ce_filter) and pred_method in [pyEDM.SMap,pyEDM.Simplex]:
            validLib = self.df.eval(ce_filter)
            if validLib.dtype!="bool":
                raise Exception("Result of conditional filter must yield boolean")
            request["validLib"] = validLib


        pred = pred_method(**request,dataFrame=self.df)

        if pred_method==pyEDM.SMap: pred = pred["predictions"]

        return {"data":pred.dropna().to_numpy().T.tolist()}

    def get_projection(self,request):

        cols = request["columns"]
        reduction = low_dim_projection(self.df[cols],request["projection_method"])
        if len(cols)==1: reduction = np.append(self.df[["time"]],reduction,1)

        return {"reduction":reduction.T.tolist()}

    def get_cond_emb(self,request):

        lib,pred,filter_,projection_method = (request.pop(x) for x in
                          ("lib","pred","cond_emb_filter","projection_method"))
        embedding = self.df if request.pop("embedded") else\
                                    pyEDM.Embed(**request,dataFrame=self.df)

        reduction = low_dim_projection(embedding,projection_method)

        cond_emb_proj = []*3
        if len(filter_)!=0:
            valid_lib = self.df.eval(filter_)
            if valid_lib.dtype!="bool":
                raise Exception("Result of conditional filter must yield boolean")
            cond_emb_proj = reduction[valid_lib[:reduction.shape[0]]].T.tolist()

        lib_proj  = reduction[lib[0]:min(reduction.shape[0],lib[1])].T.tolist()
        pred_proj = reduction[pred[0]:min(reduction.shape[0],pred[1])].T.tolist()

        return {"projection":[lib_proj,cond_emb_proj,pred_proj]}

    def get_node_interactions(self,request):

        nodes = request["nodes"]
        transition_mats=[]
        for idx_window in np.array_split(np.arange(self.df.shape[0]),
                                  self.df.shape[0]//request["window_size"]):
            transition_mat = np.zeros((len(nodes),len(nodes)))
            for row_1,row_2 in zip(idx_window,idx_window[1:]):
                for (i,node_1),(j,node_2) in product(enumerate(nodes),repeat = 2):
                    transition_mat[i,j] += int(row_1 in node_1 and row_2 in node_2)
            transition_mats.append(transition_mat.T.tolist())

        return {"transition_mats":transition_mats}

    def get_stg(self,request):

        obs  = []
        coef = []

        projection_name = request.pop("projection_method")

        for targ in request["columns"]:
            pred = pyEDM.SMap(dataFrame=self.df, target=targ, **request)
            obs.append(pred["predictions"]["Observations"])
            coef.append(pred["coefficients"].iloc[:,2:])

        obs = pd.concat(obs,axis=1)
        obs.columns=request["columns"]

        coef   = pd.concat(coef,axis=1)
        stg_df = pd.concat([obs,coef],axis=1)

        coef,stg_df = [x.iloc[request["Tp"]:-request["Tp"]] for x in (coef,stg_df)]

        reduction = low_dim_projection(stg_df,projection_name)

        coef_splits = [ x.tolist() for x in np.split(coef.mean(0),
                                              len(request["columns"])) ]

        return {"reduction":reduction.T.tolist(), "coef_mat": coef_splits  }


    def get_ccm(self,request):

        # Run pairwise relationship analysis for every column in columns

        results = []

        for c1,c2 in combinations(request["columns"],2):

            pred = pyEDM.CCM(dataFrame=self.df,columns=c1,target=c2,
                             libSizes=request["libSizes"],
                             sample=request["sample"],E=request["E"])

            results.append(("%s:%s"%(c1,c2),
                            pred.iloc[:,[0,1]].to_numpy().T.tolist()))
            results.append(("%s:%s"%(c2,c1),
                            pred.iloc[:,[0,2]].to_numpy().T.tolist()))

        return results
