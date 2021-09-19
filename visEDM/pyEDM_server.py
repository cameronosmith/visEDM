import sys, os
from os.path import join

from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from functools import partial

import pandas as pd

from pdb import set_trace as pdb

from .pyEDM_interface import pyEDM_interface

def try_catch_wrap(func):

    try: return jsonify(func(request.json))
    except Exception as inst: return str(inst)

def run_pyEDM_server(df=None,port=5000,serve_html=True,debug=False):

    if df is None:
        if len(sys.argv)>1:
            df = pd.read_csv(sys.argv[1])
        elif type(df)=="str":
            df = pd.read_csv(df)
        else:
            raise Exception("DataFrame nor filepath specified")

    # instantiate the app
    if serve_html :
        base_path = join(os.path.dirname(os.path.abspath(__file__)),"html")
        app = Flask("pyEDM_server",
                    static_folder   = join(base_path,"static"),
                    template_folder = base_path,
                    )
        @app.route('/', defaults={'path': ''})
        @app.route('/<path:path>')
        def catch_all(path):
            return render_template("index.html")
    else:
        app = Flask("pyEDM_server",)

    CORS(app, resources={r'/*': {'origins': '*'}})

    pyedm_int = pyEDM_interface(df)

    for url,func in [("/get_data",pyEDM_interface.get_data),
                     ("/get_prediction",pyEDM_interface.get_prediction),
                     ("/get_projection",pyEDM_interface.get_projection),
                     ("/get_node_interactions",pyEDM_interface.get_node_interactions),
                     ("/get_ccm",pyEDM_interface.get_ccm),
                     ("/get_stg",pyEDM_interface.get_stg),
                     ("/get_cond_emb",pyEDM_interface.get_cond_emb),
                     ]:
        wrapped_func = partial(try_catch_wrap, partial(func,pyedm_int))
        wrapped_func.__name__=url
        app.add_url_rule(url, view_func = wrapped_func, methods=["POST"])

    try:
        app.run(debug=debug, port=port)
    except Exception as ex:
        if str(ex)=="[Errno 98] Address already in use":
            print(f"Port {port} busy, trying {port+1}")
            run_pyEDM_server(df,port+1)
        else:
            print(ex)

#if __name__ == '__main__': run_pyEDM_server()
