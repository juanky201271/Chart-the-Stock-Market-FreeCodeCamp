import React, { useState, useEffect } from "react"
import socketIOClient from "socket.io-client"
import api from '../api'
const ENDPOINT = process.env.PUBLIC_URL

function Soc({_this}) {
  const [response, setResponse] = useState(" waiting ")

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT)
    socket.on("Stock", data => {
      setResponse(data.message)
      api.getAllStocks().then(stocks => {
        _this.setState({
            stocks: stocks.data.data,
            key: new Date(),
            socket: data.message,
        })
      })
      .catch(error => {
        console.log(error)
      })
    })
  }, [_this])

  return (
    <div style={{ fontSize: '20px', color: '#ddd', backgroundColor: '#222' }}>
      ::: {response} :::
    </div>
  )
}

export default Soc
