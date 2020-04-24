import React, { Component } from 'react'
import { Doughnut } from 'react-chartjs-2'
import api from '../api'

class Chart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _id: this.props._id,
      dataChart: {},
      question: '',
    }
    this.colors18 = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9',
      '#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6']
  }
  componentDidMount = async () => {
    const { _id } = this.state
    await api.getPollById(_id).then(poll => {
      const labels = poll.data.data.answers.map((item, ind) => item.answer)
      const label = poll.data.data.question
      const data = poll.data.data.answers.map((item, ind) => item.votes)
      var backgroundColor = []
      var hoverBackgroundColor = []
      var t = this.colors18.length
      var c = 0
      for (let i = 0; i < poll.data.data.answers.length; i++) {
        backgroundColor.push(this.colors18[i])
        hoverBackgroundColor.push(this.colors18[i].substr(0,2) + this.colors18[i].substr(3,1) + this.colors18[i].substr(5,1))
        c++
        if (c === t) {
          c = 0
        }
      }

      const dataChart = {
        labels: [...labels],
        datasets: [
          {
            label: label,
            backgroundColor: backgroundColor,
            hoverBackgroundColor: hoverBackgroundColor,
            data: [...data],
          },
        ],
      }
      this.setState({
        dataChart: dataChart,
        question: label,
      })
    })
    .catch(error => {
      console.log(error)
    })
  }
  render() {
    const { dataChart, question } = this.state
    return (
      <div>
         <Doughnut
           data={dataChart}
           options={{
             title:{
               display:false,
               text:'Chart of Poll: ' + question,
               fontSize:20
             },
             legend:{
               display:true,
               position:'right'
             }
           }}
         />
      </div>
    )
  }
}

export default Chart
