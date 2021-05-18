<template>
    <div id="app">
        <div>
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Tab 1" active>
                        <DataFrameTable v-bind:dataframe2="dataframe"/>
                    </b-tab>
                    <b-tab title="Tab 2">
                        <DataFramePlot></DataFramePlot>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

import DataFramePlot from './components/DataFramePlot.vue'
import DataFrameTable from './components/DataFrameTable.vue'

export default {
    name: 'App',
    components: {
        DataFramePlot, 
        DataFrameTable
    },
    data: function() {
        return { 
            dataframe: [[],[]]
        }
    },
    mounted: function() {
        const path = 'http://localhost:5000/get_data';
        return axios.post(path,{"hihi":4}).then((res) => {
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


<!--
Links
  Data: https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function
  Form Input Bindings: https://vuejs.org/v2/guide/forms.html#Basic-Usage
  Watchers: https://vuejs.org/v2/guide/computed.html#Watchers
-->

<!--
<template>
  <div>
    <svg width="500" height="300"></svg>
    <br>
    <input
      type="range"
      v-model="circleSize"
      min="1"
      max="100"
      step="1"
    >
  </div>
</template>

<script>
const d3 = require('d3');
export default {
  data: function() {
    return {
      circleSize: 50
    }
  },
  mounted: function() {
    var svg = d3.select(this.$el).select('svg');
    this.circle = svg
          .append('circle')
          .attr('cx', '250')
          .attr('cy', '150')
          .attr('r', this.circleSize)
  },
  watch: {
    circleSize: function(newValue) {
      this.circle
        .attr('r', newValue)
    }
  }
}
</script>

<style>
</style>
-->
