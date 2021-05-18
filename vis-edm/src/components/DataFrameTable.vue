
<template>
    <div>
    <div v-if="dataframe2[0].length > 0">
        <Plotly v-bind:data="cdata" :layout="layout" :display-mode-bar="true"></Plotly>
    </div>
    <div v-if="dataframe2[0].length == 0">
        loading page
    </div>
    </div>

</template>

<script>

import { Plotly } from 'vue-plotly'

export default {
    components: {
        Plotly
    },
    props:[
        'dataframe2'
    ],
    data: function(){ 
        return {
            layout: {title:"hi"}
        }
    },

    computed: {
        cdata: function(){
            return [{
                type: 'table',
                header: {
                    values: this.dataframe2[0],
                    align: "center",
                    line: {width: 1, color: 'black'},
                    fill: {color: "grey"},
                    font: {family: "Arial", size: 12, color: "white"}
                },
                cells: {
                    values: this.dataframe2[1],
                    align: "center",
                    line: {color: "black", width: 1},
                    font: {family: "Arial", size: 11, color: ["black"]}
                }
            }]
            /*
                ,
                layout:{
                    title: ""
                }
                */
        }
    }
}
</script>
