<template>
    <div id="app">
        <div>
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Tab 1">
                        <DataFramePlot 
                           :get_projection="get_projection"
                           :get_prediction="get_prediction"
                                    v-bind:dataframe="dataframe"></DataFramePlot>
                    </b-tab>
                    <b-tab title="Tab 2">
                        <!--<DataFrameTable v-bind:dataframe2="dataframe"/>-->
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

import DataFramePlot from './components/DataFramePlot.vue'

export default {
    name: 'App',
    components: {
        DataFramePlot, 
        //DataFrameTable
    },
    data: function() {
        return { 
            dataframe: [[],[]]
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
