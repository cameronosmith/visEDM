from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from functools import partial

from pdb import set_trace as pdb

from pyEDM_interface import pyEDM_interface

DEBUG = True
# True if should serve web client at pyEDM server address
production_build = True

def try_catch_wrap(func):

    try: return jsonify(func(request.json))
    except Exception as inst: return str(inst)

def run_pyEDM_server(df,port=5000):

    # instantiate the app
    if production_build:
        app = Flask("pyEDM_server",
                    static_folder = "./dist/static",
                    template_folder = "./dist"
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
        app.run(debug=True, port=port)
    except Exception as ex:
        if str(ex)=="[Errno 98] Address already in use":
            print(f"Port {port} busy, trying {port+1}")
            run_pyEDM_server(df,port+1)
        else:
            print(ex)

if __name__ == '__main__':
    import pyEDM
    #df = pyEDM.sampleData["circle"].round(2)
    #df = pyEDM.sampleData["block_3sp"].round(2)
    df = pyEDM.sampleData["sardine_anchovy_sst"].round(2)
    run_pyEDM_server(df)
