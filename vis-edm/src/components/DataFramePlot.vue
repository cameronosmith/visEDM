<template>
    <div>

        <!--Column Selection-->
        <div id='app'>
          <p>Columns</p>
          <span class="cols_span" v-for="column in all_columns" :key="column">
            <input type="checkbox" :value="column" v-model="selected_columns"> 
            <span > {{column}} </span>
          </span>
        </div>

        <!--Dataframe Table-->
        <Plotly v-bind:data="df_table"/>

        <!--Scatter Plots-->
        <Plotly v-bind:data="df_subplots" :layout="df_subplots_layout"
                :display-mode-bar="true"/>

        <!--Data Projection-->

        <input @click="recompute_projection()" type="checkbox" v-model="project_3d">
        <label for="checkbox" class="plaintext">3D projection</label>
        <Plotly v-bind:data="df_projection"/>

    </div>
</template>

<script>

import { Plotly } from 'vue-plotly'
import {bus} from '../main.js';

export default {

    components: {
        Plotly,
    },
    methods:{
        dataframe_init:function(df){
            this.all_columns = df[0] = this.selected_columns = df[0].slice(1)
            this.data = df[1].slice(1)
            this.recompute_projection()
        },
        recompute_projection:function(){
            if (this.selected_columns.length){
                var msg={"columns":this.selected_columns,
                         "time_axis":false,
                         "project_3d":this.project_3d}
                this.get_projection(msg).then((res) => {
                    this.projection_data = res.data.reduction
                })
            }
        },
    },
    props:[
        'get_projection',
    ],
    data : function(){
        return {

            all_columns: [ ],
            selected_columns: [ ],
            data: [],
            projection_data: [],

            project_3d: false,
        }
    },
    mounted: function(){
        bus.$on('dataframe_init', this.dataframe_init);
    },
    computed:{
        // The subset of the dataframe defined by the selected columns
        selected_data: function(){
            this.recompute_projection()
            return this.data.filter((_,idx) =>{
                return this.selected_columns.includes(this.all_columns[idx])
            })
        },
        // DataFrame Table
        df_table: function(){
            return [{
                type: 'table',
                header: {
                    values: this.selected_columns,
                    fill: {color: "grey"},
                    font: {family: "Arial", size: 12, color: "white"}
                },
                cells: {
                    values: this.selected_data,
                    line: {color: "black", width: 1},
                    font: {family: "Arial", size: 11, color: ["black"]}
                }
            }]
        },
        // DataFrame Subplots
        df_subplots: function(){
            return this.selected_data.map((data,idx)=>{
                return {
                        xaxis:"x"+(1+idx),
                        yaxis:"y"+(1+idx),
                        type:"scatter",
                        y: data,
                    }
            })
        },
        df_subplots_layout: function(){
            var layout = {
                grid: {rows: 1, 
                       columns: this.selected_columns.length,
                    pattern: 'independent'},
                title:"DataFrame Subplots",
            }
            return layout
        },
        // DataFrame Projection
        df_projection: function(){
            if (this.projection_data.length==0) return []
            const n_row = this.projection_data[0].length
            return [
                {
                    type: this.project_3d ? 'scatter3d':'scatter',
                    mode: 'markers',
                    x: this.projection_data[0],
                    y: this.projection_data[1],
                    z: this.projection_data[2],
                    marker: { color: [...Array(n_row).keys()].map(i=>i/n_row), 
                             size:5, 
                    },
                }
            ]
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

