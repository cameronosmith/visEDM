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
                <span class="plaintext"> E: {{E}} </span>
                <vue-slider v-model="E" :min="0" :max="15"/>
            </div>
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
                <span class="plaintext"> Sample: {{sample}} </span>
                <vue-slider v-model="sample" :min="1" :max="100"/>
            </div>
            <div>
                <span class="plaintext"> 
                    Libsizes min/max: {{lib_sizes[0]}} : {{lib_sizes[1]}} 
                    <vue-slider :max="max_df_range" v-model="lib_sizes" />
                </span>
            </div>
            <div>
                <span class="plaintext"> Libsizes increment: {{lib_inc}} </span>
                <vue-slider :max="max_df_range" v-model="lib_inc" />
            </div>
        </div>


        <!--pyEDM Prediction Plot -->
        <button @click="run_prediction()">Run Interactions</button>

        <!--Scatter Plots-->
        <div :style="{height:dyn_plot_height}" >
        <Plotly v-bind:style="{height:dyn_plot_height}" 
                v-bind:data="prediction_plot" :layout="prediction_layout"
                :display-mode-bar="true"/>
        </div>

        </div>
</template>

<script>

import {bus} from '../main.js';
import { Plotly } from 'vue-plotly'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'

//import { permutations } from 'mathjs'

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
            this.max_df_range = df[1][0].length
            var df_tenth    = Math.floor(df[1][0].length/10)
            this.lib_sizes  = [df_tenth,df[1][0].length]
            this.lib_inc = df_tenth
            this.window_size = df_tenth
        },
        run_prediction:function(){
            var msg={"columns":this.selected_columns,"E":this.E,
                     "tau":this.tau,"Tp":this.Tp,"lib_inc":this.lib_inc,
                     "libSizes":this.lib_sizes[0]+" "+
                                this.lib_sizes[1]+" "+this.lib_inc,
                     "window_size":this.window_size,"sample":this.sample,
                     "showPlot":false,
                     }
            this.get_ccm(msg).then((res) => {
                // Catch exception returned as string (report to user later)
                if (typeof(res.data)=="string"){
                    alert("Error: "+res.data)
                    return
                }
                this.interaction_results = res.data
            })
        },
    },
    props:[
        'get_ccm',
    ],
    data : function(){
        return {
            all_columns: [ ],
            selected_columns: [ ],
            data: [],
            projection_methods:["PCA","Isomap","TSNE","MDS",
               "LocallyLinearEmbedding"],
            projection_method:"PCA",

            num_subplot_rows:1,

            E:1,
            tau:-1,
            Tp:1,
            window_size:1000,
            max_df_range : 1000000,
            lib_sizes: [1,1000],
            sample: 10,
            lib_inc:1,
            interaction_results:[],
            prediction_score:"",
        }
    },
    mounted: function(){
        bus.$on('dataframe_init', this.dataframe_init);
    },
    computed:{

        dyn_plot_height:function(){
            return (500+100*this.interaction_results.length)+"px"
        },
        selected_data: function(){
            return this.data.filter((_,idx) =>{
                return this.selected_columns.includes(this.all_columns[idx])
            })
        },
        // DataFrame Subplots
        prediction_plot: function(){
            return this.interaction_results.map((data,idx)=>{
                return {
                    xaxis:"x"+(1+idx),
                    yaxis:"y"+(1+idx),
                    type:"scatter",
                    name: data[0],
                    x: data[1][0],
                    y: data[1][1],
                }
            })
        },
        prediction_layout: function(){
            var layout = {
                grid: { 
                        rows: this.interaction_results.length,
                        columns: 1,
                        pattern: 'independent'},
                title:"DataFrame Subplots" +((this.interaction_results.length)?
                    "":" (Will populate after 'Run Interactions')"),

            }
            for (var i=0;i<this.interaction_results.length;i++){
                layout["yaxis"+(1+i)]={"title":this.interaction_results[i][0]}
            }
            return layout
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

