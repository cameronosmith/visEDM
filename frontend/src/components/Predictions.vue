<template>
    <div>

        <!--EDM Parameters-->

        
        <p>Columns</p>
        <span class="cols_span" v-for="column in all_columns" :key="column">
            <input type="checkbox" :value="column" v-model="selected_columns"> 
            <span > {{column}} </span>
        </span>

        <div class="spaced_div">
            <div>
                <span > Method: </span>
                <v-select v-model="method" :options="available_methods"/>
            </div>
            <div>
                <span > Target: </span>
                <v-select v-model="target" :options="all_columns"></v-select>
            </div>
        </div>


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
            <div>
                <span class="plaintext"> Tp: {{Tp}} </span>
                <vue-slider v-model="Tp" :min="0" :max="15"/>
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
                <p>Conditional Embedding Filter:</p>
                <input v-model="cond_emb_filter" placeholder="ex: x > y">
            </div>
        </div>


        <!--pyEDM Prediction Plot -->
        <button @click="run_prediction()">Run Prediction</button>
        <Plotly v-bind:data="prediction_plot" :layout="prediction_layout"/>

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
            this.pred = [1,df[1][0].length]
            this.target = df[0][1]
        },
        run_prediction:function(){
            var msg={"columns":this.selected_columns,"E":this.E,
                     "cond_emb_filter":this.cond_emb_filter,
                     "target":this.target,"tau":this.tau,"Tp":this.Tp,
                     "lib":this.lib[0]+" "+this.lib[1],"method":this.method,
                     "pred":this.pred[0]+" "+this.pred[1],
                     "embedded":this.embedded, "showPlot":false,
                     }
            if (this.method=="SMap") msg["theta"]=this.theta
            if (this.method=="EmbedDimension") delete msg["E"]
            if (this.method=="PredictInterval") delete msg["Tp"]
            
            this.get_prediction(msg).then((res) => {
                // Catch exception returned as string (report to user later)
                if (typeof(res.data)=="string"){
                    alert("Error: "+res.data)
                    return
                }
                this.predictions = res.data.data
            })
        },
    },
    props:[
        'get_prediction',
    ],
    data : function(){
        return {
            all_columns: [ ],
            selected_columns: [ ],
            data: [],

            E:1,
            theta:1.0,
            tau:-1,
            Tp:1,
            max_df_range : 1000000,
            lib: [1,1000],
            pred:[1,1],
            target: "",
            embedded: false,
            available_methods: ['Simplex','SMap','EmbedDimension',
                                'PredictNonlinear','PredictInterval'],
            method: 'Simplex',

            cond_emb_filter : "",

            predictions:[],
            prediction_score:"",
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
        prediction_plot: function(){
            return [{x:this.predictions[0],y:this.predictions[1],name:"Obs."}
              ].concat(!this.available_methods.slice(0,2).includes(this.method)?
                 []:{x:this.predictions[0],y:this.predictions[2],name:"Pred."})
        },
        prediction_layout: function(){
            return {"title": this.prediction_score}
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

