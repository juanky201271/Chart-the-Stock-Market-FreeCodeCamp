import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'
import api from '../api'

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataHide: this.props.dataHide,
      dataChart: {},
      lineOptions: {},
    }
    this.colors18 = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9',
      '#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6']
  }
  componentDidMount = async () => {
    const { dataHide, } = this.state

    var data = {}
    await api.getAllStocksData().then(stocks => {
      data = stocks.data.data
    })
    .catch(error => {
      console.log(error)
    })

    const dataShow = data.filter((item, index) => dataHide.indexOf(item._id) < 0 )

    var dataChart = {
      datasets: [],
    }
    var t = this.colors18.length
    var c = 0
    dataShow.forEach((item, index) => {
      const label = item.stockCode
      var data = []
      item.dataset.dataset.data.map((item, ind) => data.push({x: item[0], y: item[1]}))
      dataChart.datasets.push({
        label: label,
        fill: false,
        lineTension: 0.1,
        backgroundColor: this.colors18[index],
        borderColor: this.colors18[index],
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: this.colors18[index],
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: this.colors18[index],
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [...data],
      })
      c++
      if (c === t) {
        c = 0
      }
    })

    const lineOptions = {
      scales: {
        xAxes: [{
          gridLines: {
            display: true,
          },
          type: 'time'
        }],
        yAxes: [{
          // stacked: true,
          gridLines: {
            display: true,
          },
          ticks: {
            beginAtZero: true,
            // Return an empty string to draw the tick line but hide the tick label
            // Return `null` or `undefined` to hide the tick line entirely
          },
        }],
      },
      legend: {
        display: true,
      },
      tooltips: {
        enabled: false,
      },
    }

    this.setState({
      dataChart: dataChart,
      lineOptions: lineOptions,
    })

  }
  render() {
    console.log('Chart', this.state)
    const { dataChart, lineOptions, } = this.state
    return (
      <div>
         <Line
           data={dataChart}
           options={lineOptions}
         />
      </div>
    )
  }
}

export default Chart
