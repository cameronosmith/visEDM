<template>
    <div id="app">
        <div>
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="DataFrame">
                        <DataFramePlot :get_projection="get_projection" />
                    </b-tab>
                    <b-tab title="Conditional Embedding">
                        <ConditionalEmbedding :get_cond_emb="get_cond_emb"/>
                    </b-tab>
                    <b-tab title="Predictions">
                        <Predictions :get_prediction="get_prediction" />
                    </b-tab>
                    <b-tab title="STGA">
                        <StateTransitionAnalysis :get_stg="get_stg"
                               :get_node_interactions="get_node_interactions"/>
                    </b-tab>
                    <b-tab title="CCM">
                        <ConvergentCrossMapAnalysis :get_ccm="get_ccm"/>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

import {bus} from '../main.js';

import DataFramePlot                from './DataFramePlot.vue'
import Predictions                  from './Predictions.vue'
import ConvergentCrossMapAnalysis   from './CCM.vue'
import StateTransitionAnalysis      from './STGA.vue'
import ConditionalEmbedding         from './CondEmb.vue'

export default {
    name: 'App',
    components: {
        DataFramePlot, 
        Predictions, 
        ConvergentCrossMapAnalysis,
        StateTransitionAnalysis,
        ConditionalEmbedding,
    },
    data: function() {
        return { 
            dataframe: [[],[]],
        }
    },
    methods:{
        server_request(endpoint,msg){
            return axios.post('http://localhost:5000/'+endpoint,msg)
        },
        get_ccm(msg){
            return this.server_request("get_ccm",msg)
        },
        get_stg(msg){
            return this.server_request("get_stg",msg)
        },
        get_cond_emb(msg){
            return this.server_request("get_cond_emb",msg)
        },
        get_node_interactions(msg){
            return this.server_request("get_node_interactions",msg)
        },
        get_projection(msg){
            return this.server_request("get_projection",msg)
        },
        get_prediction(msg){
            return this.server_request("get_prediction",msg)
        }
    },
    mounted: function() {
        return this.server_request("get_data",{}).then((res) => {
            if (typeof(res.data)=="string"){
                alert("Server Side Error: "+res.data)
                return
            }
            this.dataframe = [res.data.header,res.data.data] 
            bus.$emit('dataframe_init', this.dataframe);
        })
    }

}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

</style>
