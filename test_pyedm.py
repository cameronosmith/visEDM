import pyEDM_server
import pyEDM
df = pyEDM.sampleData["block_3sp"].round(2)
pyEDM_server.run_pyEDM_server(df)
