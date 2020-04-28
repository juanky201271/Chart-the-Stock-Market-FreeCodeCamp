import React, { Component } from 'react'
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
  border: 2px solid #555;
  width: 200px;
`
const Title = styled.h1.attrs({ className: 'h1', })``
const Title3 = styled.h3.attrs({ className: 'h3', })`
  font-weight: bold;
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
const Text = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #555;
  display: initial;
`
const InputText = styled.input.attrs({ className: 'form-control', })`
    margin: 5px;
`
const Delete = styled.div.attrs({ className: 'btn btn-danger'})`
  cursor: pointer;
`

class DeleteStock extends Component {
  deleteUser = async event => {
    event.preventDefault()
    const { _id, _this, table, } = this.props
    if (window.confirm(`Do tou want to delete the stock code ${table} ?`,)) {

      await api.deleteStockById(_id).then(stock => {
        _this.setState(state => {
          var cl = []
          state.stocks.map((item, index) => {
            if (item._id === _id) {
              return null
            } else {
              return cl.push(item)
            }
          })
          return { stocks: cl, key: new Date(), }
        })
      })
      .catch(error => {
        console.log(error)
      })

    }
  }
  render() {
    return <Delete onClick={this.deleteUser}>Delete</Delete>
  }
}

const Update = styled.div.attrs({ className: 'btn btn-success'})`
  cursor: pointer;
`

class UpdateStock extends Component {
  updateUser = async event => {
    event.preventDefault()
    const { _id, _this, table, } = this.props
    if (window.confirm(`Do tou want to update the data of the stock code with ${table} ?`,)) {

      await api.updateStockById(_id).then(async stock => {
        await api.getAllStocks().then(stocks => {
          _this.setState({
              stocks: stocks.data.data,
              key: new Date(),
          })
        })
        .catch(error => {
          console.log(error)
        })
      })
      .catch(error => {
        console.log(error)
      })

    }
  }
  render() {
    return <Update onClick={this.updateUser}>Update</Update>
  }
}

const Hide = styled.div.attrs({ className: 'btn btn-secondary'})`
  cursor: pointer;
`

class HideStock extends Component {
  hideUser = async event => {
    event.preventDefault()
    const { _id, _this, } = this.props

      _this.setState(state => {
        return {
          stocksHide: state.stocksHide.concat(_id),
          key: new Date(),
        }
      })

  }
  render() {
    return <Hide onClick={this.hideUser}>Hide</Hide>
  }
}

const Unhide = styled.div.attrs({ className: 'btn btn-secondary'})`
  cursor: pointer;
`

class UnhideStock extends Component {
  unhideUser = async event => {
    event.preventDefault()
    const { _this, } = this.props

      _this.setState(state => {
        return {
          stocksHide: [],
          key: new Date(),
        }
      })

  }
  render() {
    return <Unhide onClick={this.unhideUser}>Unhide</Unhide>
  }
}

const Add = styled.div.attrs({ className: 'btn btn-success'})`
  cursor: pointer;
`

class AddStock extends Component {
  addUser = async event => {
    event.preventDefault()
    const { table, _this, } = this.props
    if (!table) return

    if (_this.state.stocks.filter((item, index) => item.stockCode === table).length === 0) {

      await api.insertStock(table).then(async stock => {
        await api.getAllStocks().then(stocks => {
          _this.setState({
              stocks: stocks.data.data,
              table: '',
              key: new Date(),
          })
        })
        .catch(error => {
          console.log(error)
        })
      })
      .catch(error => {
        alert(`Stock Code ${table} no found!`)
        console.log(error)
      })

    }
    // unhide
    const { stocks, stocksHide, } = _this.state
    const s = stocks.filter((item, index) => item.stockCode === table)
    if (s.length) {
      const _id = s[0]._id
      const stocksHideTemp = stocksHide.filter((item, index) => item !== _id)
      _this.setState({
          stocksHide: stocksHideTemp,
          table: '',
          key: new Date(),
      })
    }

  }
  render() {
    return <Add onClick={this.addUser}>Add</Add>
  }
}

class StocksList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stocks: [],
            isLoading: false,
            stocksHide: [],
            table: '',
            key: new Date(),
        }
        this.handleClickMasonry = this.handleClickMasonry.bind(this)
        this.handleChangeTable = this.handleChangeTable.bind(this)
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
      this.masonry.layout()

    }
    handleChangeTable (event) {
      const table = event.target.value.toUpperCase()
      this.setState({ table: table, })
    }
    render() {
      console.log('stocks', this.state)
        const { stocks, isLoading, stocksHide, table, key, } = this.state

        const stocksShow = stocks.filter((item, index) => stocksHide.indexOf(item._id) < 0 )

        const stockElements = stocksShow.map((item, index) => {
           return (
                <Wrapper key={item.name.substr(0,10).trim() + index.toString()} id={item._id}>
                  <Col>
                    <Row>
                      <Title3 id={item._id + '-h3-'}>{item.stockCode}</Title3>
                      <HideStock _id={item._id}
                                  _this={this} />
                    </Row>

                    <hr />

                    <Text id={item._id + '-text'}>{item.name}</Text>

                    <hr />

                    <Row>
                      { item.removable ?
                        (
                          <>
                            <DeleteStock _id={item._id}
                                         _this={this}
                                         table={item.stockCode} />
                            <UpdateStock _id={item._id}
                                         _this={this}
                                         table={item.stockCode} />
                          </>
                        ) : (
                          <></>
                        )

                      }

                    </Row>

                  </Col>
                </Wrapper>
            )
        })

        stockElements.unshift(
             <Wrapper key={'addStock999'} id={'999'}>
               <Col>
                 <Row>
                   <Title3 id={'999-h3-'}>Add Stock:</Title3>
                 </Row>

                 <InputText id={'999-text'} value={table} onChange={this.handleChangeTable} placeholder="Ex: AAPL, AAT, FB..." />

                 <AddStock table={table}
                           _this={this}
                           key={new Date().toString()} />
                  { stocksHide.length ?
                    (
                      <>
                        <hr />
                        <UnhideStock _this={this} />
                      </>
                    ) : (
                      <></>
                    )
                  }
                  <a href={process.env.PUBLIC_URL + '/EOD_metadata.csv.zip'}  target="_blank" rel="noopener noreferrer">Download List</a>
               </Col>
             </Wrapper>
         )

        let showTable = true
        if (!stocks.length) {
            showTable = false
        }

        let showChart = true
        if (!stocksShow.length) {
            showChart = false
        }

        return (
          <WrapperGen>
              <Title>Stocks</Title>
              <hr />
              {showTable && !isLoading && (
                <>
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
                  <Title>Chart</Title>
                  <hr />
                  { showChart && (
                    <>
                      <Chart dataHide={stocksHide} key={key} />
                      <hr />
                    </>
                  )}
                </>
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
