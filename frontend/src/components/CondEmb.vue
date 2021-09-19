<template>
    <div>

        <!--EDM Parameters-->

        
        <p>Columns</p>
        <span class="cols_span" v-for="column in all_columns" :key="column">
            <input type="checkbox" :value="column" v-model="selected_columns"> 
            <span > {{column}} </span>
        </span>

        <div>
            <span > Embedded: </span>
            <input type="checkbox" v-model="embedded"> 
        </div>
        <div class="spaced_div">
            <div>
                <span class="plaintext"> E: {{E}} </span>
                <vue-slider v-model="E" :min="0" :max="15"/>
            </div>
            <div>
                <span class="plaintext"> Theta: {{theta}} </span>
                <vue-slider v-model="theta" :min="0" :max="15" :interval="0.01" />
            </div>
            <div>
                <span class="plaintext"> Tau: {{tau}} </span>
                <vue-slider v-model="tau" :min="-15" :max="15"/>
            </div>
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
                <span > Target: </span>
                <v-select v-model="target" :options="all_columns"></v-select>
            </div>
            <div>
                <span > Projection Method: </span>
                <v-select v-model="projection_method" 
                          @click="recompute_projection()"
                          :options="projection_methods"></v-select>
            </div>
        </div>
        <div>
            <span><label for="checkbox" class="plaintext">3D projection</label>
            <input type="checkbox" v-model="project_3d">
            </span>
        </div>



        <div class="spaced_div">
            <div>
                <p>Conditional Embedding Filter:</p>
                <input v-model="cond_emb_filter" placeholder="ex: x > y">
                <button @click="run_projection()">Run Projection</button>
            </div>
        </div>

        <!--Conditional Embedding Projection Plot -->
        <Plotly v-bind:data="projection_plot" :layout="projection_layout"/>
        <Plotly v-bind:data="target_plot" :layout="target_layout"/>

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
        dataframe_init:function(df){
            this.all_columns = this.selected_columns = df[0].slice(1)
            this.data = df[1].slice(1)
            this.max_df_range = df[1][0].length
            this.lib  = [1,df[1][0].length]
            this.pred = [1,2]
            this.target = df[0][1]
        },
        run_projection:function(){
            var msg={"columns":this.selected_columns,"E":this.E,
                     "tau":this.tau,
                     "lib":this.lib, "pred":this.pred,

                     "cond_emb_filter":this.cond_emb_filter,
                     "embedded":this.embedded,
                     "projection_method":this.projection_method,
                     }
            this.get_cond_emb(msg).then((res) => {
                // Catch exception returned as string (report to user later)
                if (typeof(res.data)=="string"){
                    alert("Error: "+res.data)
                    return
                }
                this.projection_data = res.data.projection
            })
        },
    },
    props:[
        'get_cond_emb',
    ],
    data : function(){
        return {
            all_columns: [ ],
            selected_columns: [ ],
            data: [],

            //first is all lib proj, then cond emb proj, targ proj
            projection_data: [], 
            projection_methods:["PCA","Isomap","TSNE","MDS",
               "LocallyLinearEmbedding"],
            projection_method:"PCA",

            E:1,
            theta:1.0,
            tau:-1,
            max_df_range : 1000000,
            lib: [1,1000],
            pred: [1,1000],
            embedded: true,
            project_3d: false,
            cond_emb_filter : "",
            target : "",
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
        projection_plot: function(){
            if (this.projection_data.length==0) return []
            return ["Unfiltered Library","Filtered Library,","Target"].map(
                (name,i)=> ({
                    type: this.project_3d ? 'scatter3d':'scatter',
                    mode: 'markers',
                    x: this.projection_data[i][0],
                    y: this.projection_data[i][1],
                    z: this.projection_data[i][2],
                    name:name,
                    marker: {color: ["red","green","blue"][i], 
                             size:[3,4,7][i],
                             opacity:[.2,.9,.3][i]} 
                    }),
                )
        },
        projection_layout: function(){
            return {
                title:"Conditional Filter: "+this.cond_emb_filter,
            }
        },
        target_plot: function(){
            if (this.data.length==0) return []
            const data_idx = this.all_columns.indexOf(this.target)
            return [
                {
                    y: this.data[data_idx],
                    x: this.data[data_idx].map((_,j)=>j),
                    name:this.target,
                    opacity:.3,
                    color:"yellow",
                },
                {
                    y: this.data[data_idx].slice(this.pred[0],this.pred[1]),
                    x: this.data[data_idx].map((_,j)=>j).slice(this.pred[0],this.pred[1]),
                    name:"Pred Range",
                    opacity:.3,
                    color:"yellow",
                },
            ]
        },
        target_layout: function(){
            return {"title": this.target}
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

</style>

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
    margin:5px;
    width: 100%;
    display:block;
    float:center;
    text-align:center;
    height: 50px;
}
.spaced_div div:first-child {
    border-left: 0;
}
.spaced_div div:last-child {
    border-right: 0;
}
</style>

