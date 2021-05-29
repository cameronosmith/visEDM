
<template>
    <div>

        <!--Dataframe table-->
        <Plotly v-bind:data="table" :layout="table_layout" 
                                            :display-mode-bar="true"></Plotly>

        <!--Dimension Selection-->
        <span class="plaintext">
            To exclude a column from the list of columns used in the scatter
            plots and dimensionality reduction projection, click on its name.
        </span>
        <ul>
            <li v-for='dim in dims' :key="dim.data" >
                <span @click="exclude_dim(dim)"
                v-bind:class="{ active: valid_dim(dim), nonactive:!valid_dim(dim) }">
                    {{dim}}</span>
            </li>
        </ul>


        <!--Scatter Plots-->

        <br>
        <integer-plusminus :min=1 :max=10 v-model="num_rows" class="center_div">
            <p class="plaintext">Rows: {{ num_rows }} </p>
        </integer-plusminus>

        <Plotly v-bind:data="scatter_plots" :layout="scatter_plots_layout" 
                :display-mode-bar="true"></Plotly>

        <!--Data Projection-->

        <button @click="run_projection()">Run Projection</button>

        <br>
        <input type="checkbox" id="checkbox" v-model="time_axis_on_projection">
        <label for="checkbox" class="plaintext">Include time axis on projection</label>

        <br>
        <input type="checkbox" id="checkbox" v-model="project_3d">
        <label for="checkbox" class="plaintext">3D projection</label>

        <Plotly v-bind:data="reduction_plot" :layout="reduction_plot_layout" 
                :display-mode-bar="true"></Plotly>

    </div>
</template>

<style>
.center_div{
    display: flex;
    align-items: center;
    justify-content: center;
}
.plaintext{
    color:black
}
.active {
    color: red;
}
.nonactive {
    color: blue;
}

</style>
<script>
import { Plotly } from 'vue-plotly'
import { IntegerPlusminus } from 'vue-integer-plusminus'

export default {
    methods:{
        run_projection:function(){
            var cols = []
            for (var col of this.dataframe[0]){
                if (!this.exclude_dims.includes(col)) cols.push(col)
            }
            var msg={"columns":cols,"time_axis":this.time_axis_on_projection,
                     "project_3d":this.project_3d}

            this.get_projection(msg).then((res) => {
                this.reduction = res.data["reduction"]
            })
        },
        exclude_dim:function(x){
            if (this.exclude_dims.includes(x)) 
                this.exclude_dims = this.exclude_dims.filter((item) => item !== x);
            else this.exclude_dims.push(x)
        },
        valid_dim: function(x){
            return this.exclude_dims.includes(x)
        }
    },
    props:[
        'dataframe',
        'get_projection',
    ],
    components: {
        Plotly,
        IntegerPlusminus,
    },
    data : function(){
        return {

            table_layout: {title:"DataFrame Table"},
            num_rows:1,

            time_axis_on_projection:false,
            project_3d:false,
            reduction:[],
            exclude_dims: ["time"],

        }
    },

    computed: {

        dims: function(){
            return this.dataframe[0].slice(1)
        },

        reduction_plot: function(){
            var color=[]
            if (this.reduction[0])
                for (var i=0;i<this.reduction[0].length;i++)
                    color.push(i/this.reduction[0].length)

            return [
                {
                    type: this.project_3d ? 'scatter3d':'scatter',
                    mode: !this.project_3d&&this.time_axis_on_projection ? '':'markers',
                    x:this.reduction[0],
                    y:this.reduction[1],
                    z:this.reduction[2],
                    marker:{
                        color:color,
                        size:5,
                    }
                }
            ]
        },
        reduction_plot_layout: function(){
            return {title:"DataFrame Table"}
        },

        table: function(){

            var data = [];
            var colnames = [];

            for (var i=0; i<this.dataframe[1].length; i++) {
                var col_name = this.dataframe[0][i]
                if (!this.exclude_dims.includes(col_name) || col_name=="time"){
                    data.push(this.dataframe[1][i])
                    colnames.push(this.dataframe[0][i])
                }
            }
            return [{
                type: 'table',
                header: {
                    values: colnames,
                    align: "center",
                    line: {width: 1, color: 'black'},
                    fill: {color: "grey"},
                    font: {family: "Arial", size: 12, color: "white"}
                },
                cells: {
                    values: data,
                    align: "center",
                    line: {color: "black", width: 1},
                    font: {family: "Arial", size: 11, color: ["black"]}
                }
            }]
        },

        scatter_plots: function(){

            var data = [];

            var j=1
            for (var i=1; i<this.dataframe[1].length; i++) {
                var col_name = this.dataframe[0][i]
                if (!this.exclude_dims.includes(col_name)){
                    data.push({
                        xaxis:"x"+j,
                        yaxis:"y"+j,
                        type:"scatter",
                        x: this.dataframe[1][0],
                        y: this.dataframe[1][i],
                    })
                    j++
                }
            }
            return data;
        },
        scatter_plots_layout: function(){
            var j=this.dataframe[0].length-this.exclude_dims.length
            var layout = {
                grid: {rows: this.num_rows, 
                    columns: Math.ceil(j/this.num_rows), 
                    pattern: 'independent'},
                title:"DataFrame Subplots",
            }
            j=1
            for (var i=1; i<this.dataframe[1].length; i++) {
                var col_name = this.dataframe[0][i]
                if (!this.exclude_dims.includes(col_name)){
                    layout["yaxis"+j]={title:col_name};
                    j++
                }
            }
            return layout
        },
    }
}
</script>
