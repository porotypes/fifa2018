<template>
  <div class="highcharts-container"></div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsDrilldown from 'highcharts/modules/drilldown'
import Highcharts3D from 'highcharts/highcharts-3d'
HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts)
Highcharts3D(Highcharts)

export default {
  props: ['options', 'styles'],
  name: 'highcharts',
  data () {
    return {
      chart: null
    }
  },
  methods: {
    initChart () {
      this.chart = new Highcharts.Chart(this.$el, this.options)
    }
  },
  mounted () {
    this.initChart()
  }
}
</script>

<style>
.highcharts-container {
  margin: 1rem 0;
  width: 100%;
  height: 400px;
}
</style>
