<template>
    <div id="app">
        <div>
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="DataFrame">
                        <DataFramePlot :get_projection="get_projection" />
                    </b-tab>
                    <b-tab title="Predictions">
                        <Predictions :get_prediction="get_prediction" />
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

import {bus} from './main.js';

import DataFramePlot from './components/DataFramePlot.vue'
import Predictions from './components/Predictions.vue'

export default {
    name: 'App',
    components: {
        DataFramePlot, 
        Predictions, 
    },
    data: function() {
        return { 
            dataframe: [[],[]],
        }
    },
    methods:{
        get_projection(msg){
            const path = 'http://localhost:5000/get_projection';
            return axios.post(path,msg)
        },
        get_prediction(msg){
            const path = 'http://localhost:5000/get_prediction';
            return axios.post(path,msg)
        }
    },
    mounted: function() {
        const path = 'http://localhost:5000/get_data';
        return axios.post(path,{}).then((res) => {
            console.log("Successfully received dataframe from server.")
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
