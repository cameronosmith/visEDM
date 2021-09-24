webpackJsonp([2],{"6XC6":function(e,t){},"9M+g":function(e,t){},EWfp:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("mtWM"),s=n.n(i),a=n("NHnr"),o=n("Oesl"),r=n("Rsbb"),c=n("SuKo"),l=n("cUqr"),d=n("sJZU"),_={name:"App",components:{DataFramePlot:o.default,Predictions:r.default,ConvergentCrossMapAnalysis:c.default,StateTransitionAnalysis:l.default,ConditionalEmbedding:d.default},data:function(){return{dataframe:[[],[]]}},methods:{server_request:function(e,t){return s.a.post("http://localhost:5000/"+e,t)},get_ccm:function(e){return this.server_request("get_ccm",e)},get_stg:function(e){return this.server_request("get_stg",e)},get_cond_emb:function(e){return this.server_request("get_cond_emb",e)},get_node_interactions:function(e){return this.server_request("get_node_interactions",e)},get_projection:function(e){return this.server_request("get_projection",e)},get_prediction:function(e){return this.server_request("get_prediction",e)}},mounted:function(){var e=this;return this.server_request("get_data",{}).then(function(t){"string"!=typeof t.data?(e.dataframe=[t.data.header,t.data.data],a.bus.$emit("dataframe_init",e.dataframe)):alert("Server Side Error: "+t.data)})}},u={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",[n("b-card",{attrs:{"no-body":""}},[n("b-tabs",{attrs:{card:""}},[n("b-tab",{attrs:{title:"Conditional Embedding"}},[n("ConditionalEmbedding",{attrs:{get_cond_emb:e.get_cond_emb}})],1),e._v(" "),n("b-tab",{attrs:{title:"Predictions"}},[n("Predictions",{attrs:{get_prediction:e.get_prediction}})],1),e._v(" "),n("b-tab",{attrs:{title:"STGA"}},[n("StateTransitionAnalysis",{attrs:{get_stg:e.get_stg,get_node_interactions:e.get_node_interactions}})],1),e._v(" "),n("b-tab",{attrs:{title:"DataFrame"}},[n("DataFramePlot",{attrs:{get_projection:e.get_projection}})],1),e._v(" "),n("b-tab",{attrs:{title:"CCM"}},[n("ConvergentCrossMapAnalysis",{attrs:{get_ccm:e.get_ccm}})],1)],1)],1)],1)])},staticRenderFns:[]};var p=n("VU/8")(_,u,!1,function(e){n("TAzE")},null,null);t.default=p.exports},Fogc:function(e,t){},JQyg:function(e,t){},Jmt5:function(e,t){},KgMc:function(e,t){},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("/5sW"),s=n("EWfp"),a=n("Dd8w"),o=n.n(a),r=n("/ocq"),c=[].map(function(e){return o()({},e,{component:function(){return n("mUJ2")("./"+e.component+".vue")}})});i.default.use(r.a);new r.a({routes:c,mode:"history"});var l=n("Tqaz");n("Jmt5"),n("9M+g");n.d(t,"bus",function(){return d}),i.default.config.productionTip=!1;var d=new i.default;i.default.use(l.a),new i.default({render:function(e){return e(s.default)}}).$mount("#app")},Oesl:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("Gu7T"),s=n.n(i),a=n("KkKn"),o=n("NHnr"),r={components:{Plotly:a.Plotly},methods:{dataframe_init:function(e){this.all_columns=this.selected_columns=e[0].slice(1),this.data=e[1].slice(1),this.recompute_projection()},recompute_projection:function(){var e=this;if(this.selected_columns.length){var t={columns:this.selected_columns,projection_method:this.projection_method};this.get_projection(t).then(function(t){"string"!=typeof t.data?e.projection_data=t.data.reduction:alert("Server Side Error: "+t.data)})}}},props:["get_projection"],data:function(){return{all_columns:[],selected_columns:[],data:[],projection_data:[],projection_methods:["PCA","Isomap","TSNE","MDS","LocallyLinearEmbedding"],projection_method:"PCA",projection_layout:{title:"Projection"},project_3d:!1}},mounted:function(){o.bus.$on("dataframe_init",this.dataframe_init)},computed:{selected_data:function(){var e=this;return this.recompute_projection(),this.data.filter(function(t,n){return e.selected_columns.includes(e.all_columns[n])})},dyn_plot_height:function(){return 1e3+100*this.selected_columns.length+"px"},df_table:function(){return[{type:"table",header:{values:this.selected_columns,fill:{color:"grey"},font:{family:"Arial",size:12,color:"white"}},cells:{values:this.selected_data,line:{color:"black",width:1},font:{family:"Arial",size:11,color:["black"]}}}]},df_subplots:function(){var e=this;return this.selected_data.map(function(t,n){return{xaxis:"x"+(1+n),yaxis:"y"+(1+n),type:"scatter",name:e.selected_columns[n],y:t}})},df_subplots_layout:function(){for(var e={grid:{rows:this.selected_columns.length,columns:1,pattern:"independent"},title:"DataFrame Subplots",annotations:[]},t=0;t<this.selected_data.length;t++)e["yaxis"+(1+t)]={title:this.selected_columns[t]};return e},df_projection:function(){if(0==this.projection_data.length)return[];var e=this.projection_data[0].length;return[{type:this.project_3d?"scatter3d":"scatter",mode:"markers",x:this.projection_data[0],y:this.projection_data[1],z:this.projection_data[2],marker:{color:[].concat(s()(Array(e).keys())).map(function(t){return t/e}),size:5}}]}}},c={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{attrs:{id:"app"}},[n("p",[e._v("Columns")]),e._v(" "),e._l(e.all_columns,function(t){return n("span",{key:t,staticClass:"cols_span"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.selected_columns,expression:"selected_columns"}],attrs:{type:"checkbox"},domProps:{value:t,checked:Array.isArray(e.selected_columns)?e._i(e.selected_columns,t)>-1:e.selected_columns},on:{change:function(n){var i=e.selected_columns,s=n.target,a=!!s.checked;if(Array.isArray(i)){var o=t,r=e._i(i,o);s.checked?r<0&&(e.selected_columns=i.concat([o])):r>-1&&(e.selected_columns=i.slice(0,r).concat(i.slice(r+1)))}else e.selected_columns=a}}}),e._v(" "),n("span",[e._v(" "+e._s(t)+" ")])])})],2),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",[e._v(" Projection Method: ")]),e._v(" "),n("v-select",{attrs:{options:e.projection_methods},on:{click:function(t){return e.recompute_projection()}},model:{value:e.projection_method,callback:function(t){e.projection_method=t},expression:"projection_method"}})],1)]),e._v(" "),n("div",[n("span",[n("label",{staticClass:"plaintext",attrs:{for:"checkbox"}},[e._v("3D projection")]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.project_3d,expression:"project_3d"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.project_3d)?e._i(e.project_3d,null)>-1:e.project_3d},on:{change:function(t){var n=e.project_3d,i=t.target,s=!!i.checked;if(Array.isArray(n)){var a=e._i(n,null);i.checked?a<0&&(e.project_3d=n.concat([null])):a>-1&&(e.project_3d=n.slice(0,a).concat(n.slice(a+1)))}else e.project_3d=s}}})])]),e._v(" "),n("Plotly",{attrs:{data:e.df_projection,layout:e.projection_layout}}),e._v(" "),n("div",{style:{height:e.dyn_plot_height}},[n("Plotly",{style:{height:e.dyn_plot_height},attrs:{data:e.df_subplots,layout:e.df_subplots_layout,"display-mode-bar":!0}})],1),e._v(" "),n("Plotly",{attrs:{data:e.df_table}})],1)},staticRenderFns:[]};var l=n("VU/8")(r,c,!1,function(e){n("sq+l"),n("Fogc")},"data-v-4994df6a",null);t.default=l.exports},QRMv:function(e,t){},R870:function(e,t){},Rsbb:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("NHnr"),s=n("KkKn"),a=n("lCKi"),o=n.n(a),r=(n("KgMc"),n("/5sW")),c=n("T1ft"),l=n.n(c);n("R870");r.default.component("v-select",l.a);var d={components:{Plotly:s.Plotly,VueSlider:o.a},methods:{dataframe_init:function(e){this.all_columns=this.selected_columns=e[0].slice(1),this.data=e[1].slice(1),this.max_df_range=e[1][0].length,this.lib=[1,e[1][0].length],this.pred=[1,e[1][0].length],this.target=e[0][1]},run_prediction:function(){var e=this,t={columns:this.selected_columns,E:this.E,cond_emb_filter:this.cond_emb_filter,target:this.target,tau:this.tau,Tp:this.Tp,lib:this.lib[0]+" "+this.lib[1],method:this.method,pred:this.pred[0]+" "+this.pred[1],embedded:this.embedded,showPlot:!1};"SMap"==this.method&&(t.theta=this.theta),"EmbedDimension"==this.method&&delete t.E,"PredictInterval"==this.method&&delete t.Tp,this.get_prediction(t).then(function(t){"string"!=typeof t.data?e.predictions=t.data.data:alert("Error: "+t.data)})}},props:["get_prediction"],data:function(){return{all_columns:[],selected_columns:[],data:[],E:1,theta:1,tau:-1,Tp:1,max_df_range:1e6,lib:[1,1e3],pred:[1,1],target:"",embedded:!0,available_methods:["Simplex","SMap","EmbedDimension","PredictNonlinear","PredictInterval"],method:"Simplex",cond_emb_filter:"",predictions:[],prediction_score:""}},mounted:function(){i.bus.$on("dataframe_init",this.dataframe_init)},computed:{selected_data:function(){var e=this;return this.data.filter(function(t,n){return e.selected_columns.includes(e.all_columns[n])})},prediction_plot:function(){return[{x:this.predictions[0],y:this.predictions[1],name:"Obs."}].concat(this.available_methods.slice(0,2).includes(this.method)?{x:this.predictions[0],y:this.predictions[2],name:"Pred."}:[])},prediction_layout:function(){return{title:this.prediction_score}}}},_={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("p",[e._v("Columns")]),e._v(" "),e._l(e.all_columns,function(t){return n("span",{key:t,staticClass:"cols_span"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.selected_columns,expression:"selected_columns"}],attrs:{type:"checkbox"},domProps:{value:t,checked:Array.isArray(e.selected_columns)?e._i(e.selected_columns,t)>-1:e.selected_columns},on:{change:function(n){var i=e.selected_columns,s=n.target,a=!!s.checked;if(Array.isArray(i)){var o=t,r=e._i(i,o);s.checked?r<0&&(e.selected_columns=i.concat([o])):r>-1&&(e.selected_columns=i.slice(0,r).concat(i.slice(r+1)))}else e.selected_columns=a}}}),e._v(" "),n("span",[e._v(" "+e._s(t)+" ")])])}),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",[e._v(" Method: ")]),e._v(" "),n("v-select",{attrs:{options:e.available_methods},model:{value:e.method,callback:function(t){e.method=t},expression:"method"}})],1),e._v(" "),n("div",[n("span",[e._v(" Target: ")]),e._v(" "),n("v-select",{attrs:{options:e.all_columns},model:{value:e.target,callback:function(t){e.target=t},expression:"target"}})],1)]),e._v(" "),n("div",[n("span",[e._v(" Embedded: ")]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.embedded,expression:"embedded"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.embedded)?e._i(e.embedded,null)>-1:e.embedded},on:{change:function(t){var n=e.embedded,i=t.target,s=!!i.checked;if(Array.isArray(n)){var a=e._i(n,null);i.checked?a<0&&(e.embedded=n.concat([null])):a>-1&&(e.embedded=n.slice(0,a).concat(n.slice(a+1)))}else e.embedded=s}}})]),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",{staticClass:"plaintext"},[e._v(" E: "+e._s(e.E)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:0,max:15},model:{value:e.E,callback:function(t){e.E=t},expression:"E"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Theta: "+e._s(e.theta)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:0,max:15,interval:.01},model:{value:e.theta,callback:function(t){e.theta=t},expression:"theta"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Tau: "+e._s(e.tau)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:-15,max:15},model:{value:e.tau,callback:function(t){e.tau=t},expression:"tau"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Tp: "+e._s(e.Tp)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:0,max:15},model:{value:e.Tp,callback:function(t){e.Tp=t},expression:"Tp"}})],1)]),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",{staticClass:"plaintext"},[e._v(" Lib: "+e._s(e.lib[0])+" : "+e._s(e.lib[1])+" ")]),e._v(" "),n("vue-slider",{attrs:{max:e.max_df_range},model:{value:e.lib,callback:function(t){e.lib=t},expression:"lib"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Pred: "+e._s(e.pred[0])+" : "+e._s(e.pred[1])+" ")]),e._v(" "),n("vue-slider",{attrs:{max:e.max_df_range},model:{value:e.pred,callback:function(t){e.pred=t},expression:"pred"}})],1)]),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("p",[e._v("Conditional Embedding Filter:")]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.cond_emb_filter,expression:"cond_emb_filter"}],attrs:{placeholder:"ex: x > y"},domProps:{value:e.cond_emb_filter},on:{input:function(t){t.target.composing||(e.cond_emb_filter=t.target.value)}}})])]),e._v(" "),n("button",{on:{click:function(t){return e.run_prediction()}}},[e._v("Run Prediction")]),e._v(" "),n("Plotly",{attrs:{data:e.prediction_plot,layout:e.prediction_layout}})],2)},staticRenderFns:[]};var u=n("VU/8")(d,_,!1,function(e){n("b7eL"),n("6XC6")},"data-v-174ddb57",null);t.default=u.exports},SuKo:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("NHnr"),s=n("KkKn"),a=n("lCKi"),o=n.n(a),r=(n("KgMc"),n("/5sW")),c=n("T1ft"),l=n.n(c);n("R870");r.default.component("v-select",l.a);var d={components:{Plotly:s.Plotly,VueSlider:o.a},methods:{dataframe_init:function(e){this.all_columns=this.selected_columns=e[0].slice(1),this.max_df_range=e[1][0].length;var t=Math.floor(e[1][0].length/10);this.lib_sizes=[t,e[1][0].length],this.lib_inc=t,this.window_size=t},run_prediction:function(){var e=this,t={columns:this.selected_columns,E:this.E,tau:this.tau,Tp:this.Tp,lib_inc:this.lib_inc,libSizes:this.lib_sizes[0]+" "+this.lib_sizes[1]+" "+this.lib_inc,window_size:this.window_size,sample:this.sample,showPlot:!1};this.get_ccm(t).then(function(t){"string"!=typeof t.data?e.interaction_results=t.data:alert("Error: "+t.data)})}},props:["get_ccm"],data:function(){return{all_columns:[],selected_columns:[],data:[],projection_methods:["PCA","Isomap","TSNE","MDS","LocallyLinearEmbedding"],projection_method:"PCA",num_subplot_rows:1,E:1,tau:-1,Tp:1,window_size:1e3,max_df_range:1e6,lib_sizes:[1,1e3],sample:10,lib_inc:1,interaction_results:[],prediction_score:""}},mounted:function(){i.bus.$on("dataframe_init",this.dataframe_init)},computed:{dyn_plot_height:function(){return 500+100*this.interaction_results.length+"px"},selected_data:function(){var e=this;return this.data.filter(function(t,n){return e.selected_columns.includes(e.all_columns[n])})},prediction_plot:function(){return this.interaction_results.map(function(e,t){return{xaxis:"x"+(1+t),yaxis:"y"+(1+t),type:"scatter",name:e[0],x:e[1][0],y:e[1][1]}})},prediction_layout:function(){for(var e={grid:{rows:this.interaction_results.length,columns:1,pattern:"independent"},title:"DataFrame Subplots"+(this.interaction_results.length?"":" (Will populate after 'Run Interactions')")},t=0;t<this.interaction_results.length;t++)e["yaxis"+(1+t)]={title:this.interaction_results[t][0]};return e}}},_={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{attrs:{id:"app"}},[n("p",[e._v("Columns")]),e._v(" "),e._l(e.all_columns,function(t){return n("span",{key:t,staticClass:"cols_span"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.selected_columns,expression:"selected_columns"}],attrs:{type:"checkbox"},domProps:{value:t,checked:Array.isArray(e.selected_columns)?e._i(e.selected_columns,t)>-1:e.selected_columns},on:{change:function(n){var i=e.selected_columns,s=n.target,a=!!s.checked;if(Array.isArray(i)){var o=t,r=e._i(i,o);s.checked?r<0&&(e.selected_columns=i.concat([o])):r>-1&&(e.selected_columns=i.slice(0,r).concat(i.slice(r+1)))}else e.selected_columns=a}}}),e._v(" "),n("span",[e._v(" "+e._s(t)+" ")])])})],2),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",{staticClass:"plaintext"},[e._v(" E: "+e._s(e.E)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:0,max:15},model:{value:e.E,callback:function(t){e.E=t},expression:"E"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Tau: "+e._s(e.tau)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:-15,max:15},model:{value:e.tau,callback:function(t){e.tau=t},expression:"tau"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Tp: "+e._s(e.Tp)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:0,max:15},model:{value:e.Tp,callback:function(t){e.Tp=t},expression:"Tp"}})],1)]),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",{staticClass:"plaintext"},[e._v(" Sample: "+e._s(e.sample)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:1,max:100},model:{value:e.sample,callback:function(t){e.sample=t},expression:"sample"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" \n                Libsizes min/max: "+e._s(e.lib_sizes[0])+" : "+e._s(e.lib_sizes[1])+" \n                "),n("vue-slider",{attrs:{max:e.max_df_range},model:{value:e.lib_sizes,callback:function(t){e.lib_sizes=t},expression:"lib_sizes"}})],1)]),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Libsizes increment: "+e._s(e.lib_inc)+" ")]),e._v(" "),n("vue-slider",{attrs:{max:e.max_df_range},model:{value:e.lib_inc,callback:function(t){e.lib_inc=t},expression:"lib_inc"}})],1)]),e._v(" "),n("button",{on:{click:function(t){return e.run_prediction()}}},[e._v("Run Interactions")]),e._v(" "),n("div",{style:{height:e.dyn_plot_height}},[n("Plotly",{style:{height:e.dyn_plot_height},attrs:{data:e.prediction_plot,layout:e.prediction_layout,"display-mode-bar":!0}})],1)])},staticRenderFns:[]};var u=n("VU/8")(d,_,!1,function(e){n("X1DW")},"data-v-024ec730",null);t.default=u.exports},TAzE:function(e,t){},X1DW:function(e,t){},b7eL:function(e,t){},cUqr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("Gu7T"),s=n.n(i),a=n("NHnr"),o=n("KkKn"),r=n("lCKi"),c=n.n(r),l=(n("KgMc"),n("/5sW")),d=n("T1ft"),_=n.n(d);n("R870");l.default.component("v-select",_.a);var u={components:{Plotly:o.Plotly,VueSlider:c.a},methods:{stg_node_click:function(e){var t=e.points[0].pointIndex;if(e.event.shiftKey){var n=[].concat(s()(this.node_names));n[t]=prompt("New node name:"),this.node_names=n}else{this.stg_nodes.splice(t,1),this.node_means.splice(t,1),this.node_colors.splice(t,1),this.node_names.splice(t,1),this.stg_node_interactions.splice(t,1);for(var i=0;i<this.stg_node_interactions.length;i++)this.stg_node_interactions[i].splice(t,1)}},create_stg_node:function(e){var t=this;this.use_node_colors=!0;var n=e.lassoPoints,i=["x","y"].map(function(e){return n[e].reduce(function(e,t){return e+t},0)/n[e].length});this.node_means.push(i),this.node_names.push("Node "+(this.stg_nodes.length+1));var s=function(){return 256*Math.random()>>0};this.node_colors.push("rgb("+s()+", "+s()+", \n                "+s()+")"),this.stg_nodes.push(e.points.map(function(e){return e.pointIndex}));var a={nodes:this.stg_nodes,window_size:this.window_size};this.get_node_interactions(a).then(function(e){"string"!=typeof e.data?t.stg_node_interactions=e.data.transition_mats[0]:alert("Server Side Error: "+e.data)})},dataframe_init:function(e){this.all_columns=this.selected_columns=e[0].slice(1),this.max_df_range=e[1][0].length,this.lib=[1,e[1][0].length],this.pred=[1,e[1][0].length],this.max_window_size=e[1][0].length-1,this.window_size=e[1][0].length-1,this.run_prediction()},run_prediction:function(){var e=this,t={columns:this.selected_columns,E:1,tau:this.tau,Tp:this.Tp,theta:1,embedded:!0,showPlot:!1,lib:this.lib[0]+" "+this.lib[1],pred:this.pred[0]+" "+this.pred[1],projection_method:this.projection_method};this.get_stg(t).then(function(t){"string"!=typeof t.data?(e.stg_reduction=t.data.reduction,e.coef_mat_split=t.data.coef_mat,e.max_window_idx=t.data.coef_mat.length-1):alert("Server Side Error: "+t.data)})}},props:["get_stg","get_node_interactions"],data:function(){return{all_columns:[],selected_columns:[],data:[],tmp:[],stg_nodes:[],stg_node_interactions:[],node_names:[],node_means:[],node_colors:[],projection_methods:["PCA","Isomap","TSNE","MDS","LocallyLinearEmbedding"],projection_method:"PCA",E:1,tau:-1,Tp:1,lib:[1,1e3],pred:[1,1],project_3d:!1,use_node_colors:!1,max_df_range:1e6,stg_reduction:[],coef_mat_split:[],interaction_window_idx:1,max_window_idx:1,window_size:1,max_window_size:100,window_idxs:[]}},mounted:function(){a.bus.$on("dataframe_init",this.dataframe_init)},computed:{selected_data:function(){var e=this;return this.data.filter(function(t,n){return e.selected_columns.includes(e.all_columns[n])})},stg_reduction_plot:function(){if(0==this.stg_reduction.length)return[];var e=this.stg_reduction[0].length,t=[].concat(s()(Array(e).keys())).map(function(t){return t/e});if(this.use_node_colors){t=[].concat(s()(Array(e).keys())).map(function(){return"rgb(0,0,0)"});for(var n=0;n<this.stg_nodes.length;n++)for(var i=0;i<this.stg_nodes[n].length;i++)t[this.stg_nodes[n][i]]=this.node_colors[n]}var a=[{type:this.project_3d?"scatter3d":"scatter",mode:"lines+markers",x:this.stg_reduction[0],y:this.stg_reduction[1],line:{color:"grey",width:.1,opacity:.1},marker:{color:t,size:this.project_3d?5:10,opacity:1}}];return this.project_3d&&(a[0].z=this.stg_reduction[2]),a},stg_reduction_layout:function(){return{title:"STGA Projection"+(this.stg_nodes.length?"":" (Drag around a set of points to create a STG node)"),dragmode:"lasso"}},node_interaction_layout:function(){for(var e={annotations:[],title:"STG Node Interactions"+(this.stg_nodes.length?" (Click on node to delete, Shift+Click to rename)":" (Nodes will appear when you select them above)")},t=0;t<this.stg_node_interactions.length;t++)for(var n=0;n<this.stg_node_interactions.length;n++){var i=t<n?1:-1;t!=n&&e.annotations.push({xref:"x",axref:"x",yref:"y",ayref:"y",showarrow:!0,arrowhead:1,arrowsize:1.5,arrowcolor:this.node_colors[t],arrowwidth:.1*this.stg_node_interactions[t][n],x:this.node_means[t][0],y:this.node_means[t][1]+.05*i,ax:this.node_means[n][0],ay:this.node_means[n][1]+.05*i,opacity:.5})}return e},node_interaction_plot:function(){var e=this;if(!this.node_means.length)return[];var t=this.stg_nodes.map(function(t){return t.filter(function(t){return t>=e.window_size*(e.interaction_window_idx-1)&&t<=e.window_size*e.interaction_window_idx}).length}),n=t.reduce(function(e,t){return e+t},0),i=t.map(function(e){return Math.max(60,200*e/n)}),s=this.node_means;return[{text:this.node_names,x:s.map(function(e){return e[0]}),y:s.map(function(e){return e[1]}),type:"scatter",mode:"markers+text",marker:{color:this.node_colors,size:i}}]}}},p={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("div",{attrs:{id:"app"}},[n("p",[e._v("Columns")]),e._v(" "),e._l(e.all_columns,function(t){return n("span",{key:t,staticClass:"cols_span"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.selected_columns,expression:"selected_columns"}],attrs:{type:"checkbox"},domProps:{value:t,checked:Array.isArray(e.selected_columns)?e._i(e.selected_columns,t)>-1:e.selected_columns},on:{change:function(n){var i=e.selected_columns,s=n.target,a=!!s.checked;if(Array.isArray(i)){var o=t,r=e._i(i,o);s.checked?r<0&&(e.selected_columns=i.concat([o])):r>-1&&(e.selected_columns=i.slice(0,r).concat(i.slice(r+1)))}else e.selected_columns=a}}}),e._v(" "),n("span",[e._v(" "+e._s(t)+" ")])])})],2),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",{staticClass:"plaintext"},[e._v(" Lib: "+e._s(e.lib[0])+" : "+e._s(e.lib[1])+" ")]),e._v(" "),n("vue-slider",{attrs:{max:e.max_df_range},model:{value:e.lib,callback:function(t){e.lib=t},expression:"lib"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Pred: "+e._s(e.pred[0])+" : "+e._s(e.pred[1])+" ")]),e._v(" "),n("vue-slider",{attrs:{max:e.max_df_range},model:{value:e.pred,callback:function(t){e.pred=t},expression:"pred"}})],1)]),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",{staticClass:"plaintext"},[e._v(" Tau: "+e._s(e.tau)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:-15,max:15},model:{value:e.tau,callback:function(t){e.tau=t},expression:"tau"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Tp: "+e._s(e.Tp)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:0,max:15},model:{value:e.Tp,callback:function(t){e.Tp=t},expression:"Tp"}})],1)]),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",{staticClass:"plaintext"},[e._v(" Window size: "+e._s(e.window_size)+" ")]),e._v(" "),n("vue-slider",{attrs:{"drag-on-click":!0,min:1,max:e.max_window_size},model:{value:e.window_size,callback:function(t){e.window_size=t},expression:"window_size"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Window idx: "+e._s(e.interaction_window_idx)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:1,max:Math.round(e.max_window_size/e.window_size)},model:{value:e.interaction_window_idx,callback:function(t){e.interaction_window_idx=t},expression:"interaction_window_idx"}})],1)]),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",[e._v(" Projection Method: ")]),e._v(" "),n("v-select",{attrs:{options:e.projection_methods},on:{click:function(t){return e.recompute_projection()}},model:{value:e.projection_method,callback:function(t){e.projection_method=t},expression:"projection_method"}})],1)]),e._v(" "),n("button",{on:{click:function(t){return e.run_prediction()}}},[e._v("Run Interactions")]),e._v(" "),n("div",{staticClass:"spaced_div",attrs:{id:"app"}},[n("div",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.project_3d,expression:"project_3d"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.project_3d)?e._i(e.project_3d,null)>-1:e.project_3d},on:{change:function(t){var n=e.project_3d,i=t.target,s=!!i.checked;if(Array.isArray(n)){var a=e._i(n,null);i.checked?a<0&&(e.project_3d=n.concat([null])):a>-1&&(e.project_3d=n.slice(0,a).concat(n.slice(a+1)))}else e.project_3d=s}}}),e._v(" "),n("span",[e._v(" Project 3D ")])]),e._v(" "),n("div",[n("input",{directives:[{name:"model",rawName:"v-model",value:e.use_node_colors,expression:"use_node_colors"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.use_node_colors)?e._i(e.use_node_colors,null)>-1:e.use_node_colors},on:{change:function(t){var n=e.use_node_colors,i=t.target,s=!!i.checked;if(Array.isArray(n)){var a=e._i(n,null);i.checked?a<0&&(e.use_node_colors=n.concat([null])):a>-1&&(e.use_node_colors=n.slice(0,a).concat(n.slice(a+1)))}else e.use_node_colors=s}}}),e._v(" "),n("span",[e._v(" Use STG nodes as color ")])])]),e._v(" "),n("Plotly",{attrs:{data:e.stg_reduction_plot,layout:e.stg_reduction_layout},on:{selected:e.create_stg_node}}),e._v(" "),n("br"),e._v(" "),n("Plotly",{attrs:{data:e.node_interaction_plot,layout:e.node_interaction_layout},on:{click:e.stg_node_click}}),e._v(" "),n("br")],1)},staticRenderFns:[]};var m=n("VU/8")(u,p,!1,function(e){n("vHy9")},"data-v-2eee0ae4",null);t.default=m.exports},mUJ2:function(e,t,n){var i={"./App.vue":["EWfp"],"./CCM.vue":["SuKo"],"./CondEmb.vue":["sJZU"],"./DataFramePlot.vue":["Oesl"],"./Home.vue":["lO7g",0],"./Predictions.vue":["Rsbb"],"./STGA.vue":["cUqr"]};function s(e){var t=i[e];return t?Promise.all(t.slice(1).map(n.e)).then(function(){return n(t[0])}):Promise.reject(new Error("Cannot find module '"+e+"'."))}s.keys=function(){return Object.keys(i)},s.id="mUJ2",e.exports=s},sJZU:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=n("NHnr"),s=n("KkKn"),a=n("lCKi"),o=n.n(a),r=(n("KgMc"),n("/5sW")),c=n("T1ft"),l=n.n(c);n("R870");r.default.component("v-select",l.a);var d={components:{Plotly:s.Plotly,VueSlider:o.a},methods:{dataframe_init:function(e){this.all_columns=this.selected_columns=e[0].slice(1),this.data=e[1].slice(1),this.max_df_range=e[1][0].length,this.lib=[1,e[1][0].length],this.pred=[1,2],this.target=e[0][1]},run_projection:function(){var e=this,t={columns:this.selected_columns,E:this.E,tau:this.tau,lib:this.lib,pred:this.pred,cond_emb_filter:this.cond_emb_filter,embedded:this.embedded,projection_method:this.projection_method};this.get_cond_emb(t).then(function(t){"string"!=typeof t.data?e.projection_data=t.data.projection:alert("Error: "+t.data)})}},props:["get_cond_emb"],data:function(){return{all_columns:[],selected_columns:[],data:[],projection_data:[],projection_methods:["PCA","Isomap","TSNE","MDS","LocallyLinearEmbedding"],projection_method:"PCA",E:1,theta:1,tau:-1,max_df_range:1e6,lib:[1,1e3],pred:[1,1e3],embedded:!0,project_3d:!1,cond_emb_filter:"",target:""}},mounted:function(){i.bus.$on("dataframe_init",this.dataframe_init)},computed:{selected_data:function(){var e=this;return this.data.filter(function(t,n){return e.selected_columns.includes(e.all_columns[n])})},projection_plot:function(){var e=this;return 0==this.projection_data.length?[]:["Unfiltered Library","Filtered Library,","Target"].map(function(t,n){return{type:e.project_3d?"scatter3d":"scatter",mode:"markers",x:e.projection_data[n][0],y:e.projection_data[n][1],z:e.projection_data[n][2],name:t,marker:{color:["red","green","blue"][n],size:[3,4,7][n],opacity:[.2,.9,.3][n]}}})},projection_layout:function(){return{title:"Conditional Filter: "+this.cond_emb_filter}},target_plot:function(){if(0==this.data.length)return[];var e=this.all_columns.indexOf(this.target);return[{y:this.data[e],x:this.data[e].map(function(e,t){return t}),name:this.target,opacity:.3,color:"yellow"},{y:this.data[e].slice(this.pred[0],this.pred[1]),x:this.data[e].map(function(e,t){return t}).slice(this.pred[0],this.pred[1]),name:"Pred Range",opacity:.3,color:"yellow"}]},target_layout:function(){return{title:this.target}}}},_={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("p",[e._v("Columns")]),e._v(" "),e._l(e.all_columns,function(t){return n("span",{key:t,staticClass:"cols_span"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.selected_columns,expression:"selected_columns"}],attrs:{type:"checkbox"},domProps:{value:t,checked:Array.isArray(e.selected_columns)?e._i(e.selected_columns,t)>-1:e.selected_columns},on:{change:function(n){var i=e.selected_columns,s=n.target,a=!!s.checked;if(Array.isArray(i)){var o=t,r=e._i(i,o);s.checked?r<0&&(e.selected_columns=i.concat([o])):r>-1&&(e.selected_columns=i.slice(0,r).concat(i.slice(r+1)))}else e.selected_columns=a}}}),e._v(" "),n("span",[e._v(" "+e._s(t)+" ")])])}),e._v(" "),n("div",[n("span",[e._v(" Embedded: ")]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.embedded,expression:"embedded"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.embedded)?e._i(e.embedded,null)>-1:e.embedded},on:{change:function(t){var n=e.embedded,i=t.target,s=!!i.checked;if(Array.isArray(n)){var a=e._i(n,null);i.checked?a<0&&(e.embedded=n.concat([null])):a>-1&&(e.embedded=n.slice(0,a).concat(n.slice(a+1)))}else e.embedded=s}}})]),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",{staticClass:"plaintext"},[e._v(" E: "+e._s(e.E)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:0,max:15},model:{value:e.E,callback:function(t){e.E=t},expression:"E"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Theta: "+e._s(e.theta)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:0,max:15,interval:.01},model:{value:e.theta,callback:function(t){e.theta=t},expression:"theta"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Tau: "+e._s(e.tau)+" ")]),e._v(" "),n("vue-slider",{attrs:{min:-15,max:15},model:{value:e.tau,callback:function(t){e.tau=t},expression:"tau"}})],1)]),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",{staticClass:"plaintext"},[e._v(" Lib: "+e._s(e.lib[0])+" : "+e._s(e.lib[1])+" ")]),e._v(" "),n("vue-slider",{attrs:{max:e.max_df_range},model:{value:e.lib,callback:function(t){e.lib=t},expression:"lib"}})],1),e._v(" "),n("div",[n("span",{staticClass:"plaintext"},[e._v(" Pred: "+e._s(e.pred[0])+" : "+e._s(e.pred[1])+" ")]),e._v(" "),n("vue-slider",{attrs:{max:e.max_df_range},model:{value:e.pred,callback:function(t){e.pred=t},expression:"pred"}})],1)]),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("span",[e._v(" Target: ")]),e._v(" "),n("v-select",{attrs:{options:e.all_columns},model:{value:e.target,callback:function(t){e.target=t},expression:"target"}})],1),e._v(" "),n("div",[n("span",[e._v(" Projection Method: ")]),e._v(" "),n("v-select",{attrs:{options:e.projection_methods},on:{click:function(t){return e.recompute_projection()}},model:{value:e.projection_method,callback:function(t){e.projection_method=t},expression:"projection_method"}})],1)]),e._v(" "),n("div",[n("span",[n("label",{staticClass:"plaintext",attrs:{for:"checkbox"}},[e._v("3D projection")]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.project_3d,expression:"project_3d"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(e.project_3d)?e._i(e.project_3d,null)>-1:e.project_3d},on:{change:function(t){var n=e.project_3d,i=t.target,s=!!i.checked;if(Array.isArray(n)){var a=e._i(n,null);i.checked?a<0&&(e.project_3d=n.concat([null])):a>-1&&(e.project_3d=n.slice(0,a).concat(n.slice(a+1)))}else e.project_3d=s}}})])]),e._v(" "),n("div",{staticClass:"spaced_div"},[n("div",[n("p",[e._v("Conditional Embedding Filter:")]),e._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.cond_emb_filter,expression:"cond_emb_filter"}],attrs:{placeholder:"ex: x > y"},domProps:{value:e.cond_emb_filter},on:{input:function(t){t.target.composing||(e.cond_emb_filter=t.target.value)}}}),e._v(" "),n("button",{on:{click:function(t){return e.run_projection()}}},[e._v("Run Projection")])])]),e._v(" "),n("Plotly",{attrs:{data:e.projection_plot,layout:e.projection_layout}}),e._v(" "),n("Plotly",{attrs:{data:e.target_plot,layout:e.target_layout}})],2)},staticRenderFns:[]};var u=n("VU/8")(d,_,!1,function(e){n("QRMv"),n("JQyg")},"data-v-1b30258a",null);t.default=u.exports},"sq+l":function(e,t){},vHy9:function(e,t){}},["NHnr"]);
//# sourceMappingURL=app.9f0394b8c9d4893c9a62.js.map