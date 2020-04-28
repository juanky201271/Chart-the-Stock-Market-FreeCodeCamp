import React, { useState, useEffect } from "react"
import socketIOClient from "socket.io-client"
const ENDPOINT = process.env.PUBLIC_URL

function Soc({_this}) {
  const [response, setResponse] = useState(" waiting ")

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT)
    socket.on("Stock", data => {
      setResponse(data.message)
      _this.setState({
        socket: data.message,
        key: new Date(),
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
