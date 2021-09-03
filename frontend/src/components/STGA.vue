<template>
    <div>

        <!--EDM Parameters-->

        <div id='app'>
            <p>Columns</p>
            <span class="cols_span" v-for="column in all_columns" :key="column">
                <input type="checkbox" :value="column" v-model="selected_columns"> 
                <span > {{column}} </span>
            </span>
        </div>

        <div class="spaced_div">
           <div>
                <span class="plaintext"> Lib: {{lib[0]}} : {{lib[1]}} </span>
                <vue-slider :max="max_df_range" v-model="lib" />
           </div>
           <div>
                <span class="plaintext"> Pred: {{pred[0]}} : {{pred[1]}} </span>
                <vue-slider :max="max_df_range" v-model="pred"/>
           </div>
        </div>

        <div class="spaced_div">
            <div>
                <span class="plaintext"> Tau: {{tau}} </span>
                <vue-slider v-model="tau" :min="-15" :max="15"/>
            </div>
            <div>
                <span class="plaintext"> Tp: {{Tp}} </span>
                <vue-slider v-model="Tp" :min="0" :max="15"/>
            </div>
        </div>

        <div class="spaced_div">
            <div>
                <span class="plaintext"> Window size: {{window_size}} </span>
                <vue-slider :drag-on-click="true" 
                    v-model="window_size" :min="1" :max="max_window_size"/>
            </div>
            <div>
                <span class="plaintext"> Window idx: {{interaction_window_idx}} </span>
                <vue-slider v-model="interaction_window_idx" :min="1" 
                    :max="Math.round(max_window_size/window_size)"/>
            </div>
        </div>

        <!-- Projection Selection -->
        <div class="spaced_div">
            <div>
                <span > Projection Method: </span>
                <v-select v-model="projection_method" 
                          @click="recompute_projection()"
                          :options="projection_methods"></v-select>
            </div>
        </div>

        <!-- STG Projection and Interaction Matrix Plots -->
        <button @click="run_prediction()">Run Interactions</button>
        <div class="spaced_div" id='app'>
            <div>
            <input type="checkbox" v-model="project_3d"> 
            <span> Project 3D </span>
            </div>
            <div>
            <input type="checkbox" v-model="use_node_colors"> 
            <span> Use STG nodes as color </span>
            </div>
            </div>
        <Plotly v-on:selected="create_stg_node"
           v-bind:data="stg_reduction_plot" :layout="stg_reduction_layout"/>
        <br>
        <Plotly v-on:click="stg_node_click"
        v-bind:data="node_interaction_plot" :layout="node_interaction_layout"/>
        <br>
    </div>
        
</template>

<script>

import {bus} from '../main.js';
import { Plotly } from 'vue-plotly'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.component('v-select', vSelect)

export default {

    components: {
        Plotly,
        VueSlider,
    },
    methods:{
        stg_node_click:function(points_data){
            var pt_idx = points_data["points"][0]["pointIndex"]
            // If shift pressed, rename 
            if (points_data["event"].shiftKey){
                var copy_names = [...this.node_names]
                copy_names[pt_idx]=prompt("New node name:")
                this.node_names=copy_names
            }
            // Else delete node
            else {
                this.stg_nodes.splice(pt_idx,1)
                this.node_means.splice(pt_idx,1)
                this.node_colors.splice(pt_idx,1)
                this.node_names.splice(pt_idx,1)
                this.stg_node_interactions.splice(pt_idx,1)
                for (var i=0;i<this.stg_node_interactions.length;i++){
                    this.stg_node_interactions[i].splice(pt_idx,1)
                } 
            }
        },

        create_stg_node:function(lasso_data){

            this.use_node_colors = true

            var pts = lasso_data["lassoPoints"]
            var pts_avg = ["x","y"].map(c=>pts[c].reduce((acc,c) =>acc+c,0)/pts[c].length)
            this.node_means.push(pts_avg)
            this.node_names.push("Node "+(this.stg_nodes.length+1))

            var rand_intensity = () => Math.random() * 256 >> 0;
            this.node_colors.push(`rgb(${rand_intensity()}, ${rand_intensity()}, 
                ${rand_intensity()})`);

            this.stg_nodes.push(lasso_data["points"].map(x=>x["pointIndex"]))
            var msg={"nodes":this.stg_nodes, "window_size":this.window_size}
            this.get_node_interactions(msg).then((res) => {
                if (typeof(res.data)=="string"){
                    alert("Server Side Error: "+res.data)
                    return
                }
                this.stg_node_interactions = res.data.transition_mats[0]
            })
        },
        dataframe_init:function(df){
            this.all_columns = this.selected_columns = df[0].slice(1)
            this.max_df_range = df[1][0].length
            this.lib  = [1,df[1][0].length]
            this.pred = [1,df[1][0].length]
            this.max_window_size = df[1][0].length-1
            this.window_size = df[1][0].length-1
            this.run_prediction()
        },
        run_prediction:function(){
            var msg={"columns":this.selected_columns,"E":1,
                     "tau":this.tau,"Tp":this.Tp,"theta":1,
                     "embedded":true, "showPlot":false,
                     "lib":this.lib[0]+" "+this.lib[1],
                     "pred":this.pred[0]+" "+this.pred[1],
                     "projection_method":this.projection_method,
                     }
            this.get_stg(msg).then((res) => {
                // Catch exception returned as string (report to user later)
                if (typeof(res.data)=="string"){
                    alert("Server Side Error: "+res.data)
                    return
                }
                this.stg_reduction = res.data.reduction
                this.coef_mat_split = res.data.coef_mat
                this.max_window_idx = res.data.coef_mat.length-1
            })
        },
    },
    props:[
        'get_stg',
        'get_node_interactions',
    ],
    data : function(){
        return {
            all_columns: [ ],
            selected_columns: [ ],
            data: [],
            tmp:[],

            // each element is a list of point indices
            stg_nodes:[],
            stg_node_interactions:[],
            node_names:[],
            node_means:[],
            node_colors:[],

            projection_methods:["PCA","Isomap","TSNE","MDS","LocallyLinearEmbedding"],
            projection_method:"PCA",

            E:1,
            tau:-1,
            Tp:1,
            lib: [1,1000],
            pred:[1,1],
            project_3d:false,
            use_node_colors:false,
            max_df_range : 1000000,
            stg_reduction : [],
            coef_mat_split : [],

            interaction_window_idx : 1,
            max_window_idx : 1,
            window_size : 1,
            max_window_size : 100,
            window_idxs: [],
        }
    },
    mounted: function(){
        bus.$on('dataframe_init', this.dataframe_init);
    },

    computed:{

        selected_data: function(){
            return this.data.filter((_,idx) =>{
                return this.selected_columns.includes(this.all_columns[idx])
            })
        },
                
        // DataFrame Subplots
        stg_reduction_plot: function(){

            if (this.stg_reduction.length==0) return []
            const n_row = this.stg_reduction[0].length

            var colors = [...Array(n_row).keys() ].map(i=>(i/n_row))

            if (this.use_node_colors){
                colors = [...Array(n_row).keys() ].map(()=>(`rgb(0,0,0)`))
                for (var i=0;i<this.stg_nodes.length;i++){
                    for (var j=0;j<this.stg_nodes[i].length;j++){
                        colors[this.stg_nodes[i][j]] = this.node_colors[i];
                    }
                }
            }

            var data = [{
                type: this.project_3d ? 'scatter3d':'scatter',
                mode: 'lines+markers',
                x: this.stg_reduction[0],
                y: this.stg_reduction[1],
                line:{
                    color:'grey',
                    width:.1,
                    opacity:.1,
                },
                marker: { color:colors, size: this.project_3d ? 5 : 10, 
                    opacity:1,}
                }, 
            ]

            if (this.project_3d) data[0]["z"] = this.stg_reduction[2]

            return data

            },
            stg_reduction_layout: function(){
                var layout = {
                    title:"STGA Projection"+ ((this.stg_nodes.length)? "":
                          " (Drag around a set of points to create a STG node)"),
                    dragmode: "lasso",
                }
                return layout
            },
            node_interaction_layout: function(){
                var layout = {
                    annotations: [],
                    title:"STG Node Interactions"+ ((this.stg_nodes.length)? 
                            " (Click on node to delete, Shift+Click to rename)":
                            " (Nodes will appear when you select them above)")
                };

                const delta=.05
                for (var i=0;i<this.stg_node_interactions.length;i++){
                    for (var j=0;j<this.stg_node_interactions.length;j++){
                        const sign = i<j ? 1:-1;
                        if (i!=j){
                            layout["annotations"].push({
                                xref: 'x', axref:'x', yref: 'y', ayref:'y',
                                showarrow: true, arrowhead: 1,
                                arrowsize:1.5,
                                arrowcolor : this.node_colors[i],
                                arrowwidth: .2*this.stg_node_interactions[i][j],
                                x:  this.node_means[i][0],
                                y:  this.node_means[i][1]+delta*sign,
                                ax: this.node_means[j][0],
                                ay: this.node_means[j][1]+delta*sign,
                                opacity:.5,
                            })
                        }
                    }
                }
                return layout
            },
            node_interaction_plot: function(){

                if (!this.node_means.length) return []

                // Size is defined as amount node occupies in window * 200
                var node_to_window_pop = this.stg_nodes.map(node=>node.filter(idx=>
                    idx >= this.window_size*(this.interaction_window_idx-1) &&
                    idx <= this.window_size *this.interaction_window_idx).length)
                var total_occ = node_to_window_pop.reduce((a, b) => a + b, 0)
                var sizes = node_to_window_pop.map(x=>Math.max(60,200*x/total_occ))

                var means=this.node_means
                
                var data = [
                  {
                    text: this.node_names,
                    x: means.map(x=>x[0]),
                    y: means.map(x=>x[1]),
                    type: 'scatter',
                    mode: 'markers+text',
                    marker:{  color:this.node_colors,
                              size :sizes},
                  }
                ];
                return data
            },
    },
}
</script>

<style scoped>
.cols_span{
    display:inline-block;
    color:black;
    padding-right:15px;
}
/* container that evenly spaces divs inside it */
.spaced_div {
    display: flex;
    justify-content: space-evenly;
    margin:30px;
}
.spaced_div div {
    margin:10px;
    width: 100%;
    height: 50px;
}
.spaced_div div:first-child {
    border-left: 0;
}
.spaced_div div:last-child {
    border-right: 0;
}
</style>


