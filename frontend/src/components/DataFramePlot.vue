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

        <!-- Projection Selection -->
        <div class="spaced_div">
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

        <!--Data Projection-->
        <Plotly v-bind:data="df_projection"/>


        <!--Scatter Plots-->
        <div :style="{height:dyn_plot_height}" >
        <Plotly v-bind:style="{height:dyn_plot_height}" 
                v-bind:data="df_subplots" :layout="df_subplots_layout"
                :display-mode-bar="true"/>
        </div>

        <!--Dataframe Table-->
        <Plotly v-bind:data="df_table"/>

    </div>
</template>

<style>
#height_filler {
    height: 100%;
}
</style>


<script>

import { Plotly } from 'vue-plotly'
import {bus} from '../main.js';

export default {

    components: {
        Plotly,
    },
    methods:{
        dataframe_init:function(df){
            this.all_columns = this.selected_columns = df[0].slice(1)
            this.data = df[1].slice(1)
            this.recompute_projection()
        },
        recompute_projection:function(){
            if (this.selected_columns.length){
                var msg={"columns":this.selected_columns,
                         "time_axis":false,
                         "projection_method":this.projection_method,
                         "project_3d":this.project_3d}
                this.get_projection(msg).then((res) => {
                    if (typeof(res.data)=="string"){
                        alert("Server Side Error: "+res.data)
                        return
                    }
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
            projection_methods:["PCA","Isomap","TSNE","MDS",
               "LocallyLinearEmbedding"],
            projection_method:"PCA",

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
        dyn_plot_height:function(){
            return (1000+100*this.selected_columns.length)+"px"
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
                        name: this.selected_columns[idx],
                        y: data,
                    }
            })
        },
        df_subplots_layout: function(){
            var layout = {
                grid: { 
                        rows: this.selected_columns.length,
                        columns: 1,
                        pattern: 'independent'},
                title:"DataFrame Subplots",
                annotations: []
            }
            for (var i=0;i<this.selected_data.length;i++){
                layout["yaxis"+(1+i)]={"title":this.selected_columns[i]}
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

