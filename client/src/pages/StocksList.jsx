import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'
import { Chart } from '../components'
import styled from 'styled-components'
import Masonry from 'react-masonry-component'

const masonryOptions = {
  transitionDuration: 0
}
const imagesLoadedOptions = {
  background: '.my-bg-image-el'
}

const WrapperGen = styled.div`
  margin: 5px 5px 5px 5px;
  padding: 10px 10px 10px 10px;
`
const Wrapper = styled.div`
  margin: 5px 5px 5px 5px;
  padding: 10px 10px 10px 10px;
  background-color: #ddd;
  border-radius: 10px;
  border: 1px solid magenta;
  width: 200px;
`
const Title = styled.h1.attrs({ className: 'h1', })``
const Title3 = styled.h3.attrs({ className: 'h3', })`
  font-weight: bold;
  cursor: pointer;
`
const Title4 = styled.h5.attrs({ className: 'h5', })``
const Img = styled.img`
  max-width: 200px;
  min-width: 100px;
  cursor: pointer;
`
const Icon = styled.img`
  cursor: pointer;
`
const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: baseline;
`
const TextUser = styled.div`
  font-size: 11px;
  font-weight: bold;
  color: magenta;
  cursor: pointer;
`
const Text = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #555;
  display: none;
`
const Delete = styled.div.attrs({ className: 'btn btn-danger'})`
  cursor: pointer;
`

class DeleteStock extends Component {
  deleteUser = async event => {
    event.preventDefault()
    const { _id, _this, } = this.props
    if (window.confirm(`Do tou want to delete the stock code ${_id} ?`,)) {

      await api.deleteStockById(_id)
      .catch(error => {
        console.log(error)
      })

      _this.setState(state => {
        var cl = []
        state.stocks.map((item, index) => {
          if (item._id === _id) {
            return null
          } else {
            return cl.push(item)
          }
        })
        return { stocks: cl }
      })

    }
  }
  render() {
    return <Delete onClick={this.deleteUser}>Delete</Delete>
  }
}

class StocksList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stocks: [],
            isLoading: false,
        }
    }
    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllStocks().then(stocks => {
            this.setState({
                stocks: stocks.data.data,
                isLoading: false,
            })
        })
        .catch(error => {
          console.log(error)
          this.setState({
              isLoading: false,
          })
        })
    }
    handleClickMasonry (event) {
      console.log('Masonry', event.target.id)
      const stock_id = event.target.id.split("-")[0]
      const obj = event.target.id.split("-")[1]

      if (!stock_id || !obj) return

      console.log(document.getElementById(stock_id))
      if (obj !== 'likes') {
        if (document.getElementById(stock_id).style.width === "400px") {
          document.getElementById(stock_id).style.width="200px"
        } else {
          document.getElementById(stock_id).style.width="400px"
        }
        if (document.getElementById(stock_id + '-text').style.display === "initial")
        {
          document.getElementById(stock_id + '-text').style.display="none"
        } else {
          document.getElementById(stock_id + '-text').style.display="initial"
        }
        this.masonry.layout()
      }

    }

    render() {
      console.log('stocks', this.state)
        const { stocks, isLoading } = this.state

        const stockElements = stocks.map((item, index) => {
           return (
                <Wrapper key={item.title.substr(0,10).trim() + index.toString()} id={item._id}>
                  <Col>

                    <Title3 id={item._id + '-h3-' + item.views.toString()}>{item.stockCode}</Title3>


                    <Text id={item._id + '-text'}>{item.stockName}</Text>

                    <Row>
                      <DeleteStock _id={item._id}
                                   _this={this} />
                    </Row>

                  </Col>
                </Wrapper>
            )
        })

        let showTable = true
        if (!stocks.length) {
            showTable = false
        }

        return (
          <WrapperGen>
              <Title>Chart</Title>
              <hr />
              <Chart />
              <hr />
              {showTable && !isLoading && (
                <Masonry
                    className={'my-gallery-class'} // default ''
                    elementType={'div'} // default 'div'
                    options={masonryOptions} // default {}
                    disableImagesLoaded={false} // default false
                    updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
                    imagesLoadedOptions={imagesLoadedOptions} // default {}
                    onClick={this.handleClickMasonry}
                    ref={function(c) {this.masonry = this.masonry || c.masonry;}.bind(this)}
                >
                  {stockElements}
                </Masonry>
              )}

              {!showTable && (
                  <hr />
              )}

              {isLoading && (
                  <h3>Loading Stocks</h3>
              )}
          </WrapperGen>
        )
    }
}

export default StocksList
