import React, { useState, useEffect } from "react"
import socketIOClient from "socket.io-client"
const ENDPOINT = process.env.PUBLIC_URL

function Soc() {
  const [response, setResponse] = useState("... waiting ...")

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT)
    socket.on("Stock", data => {
      setResponse(data.message)
    })
  }, [])

  return (
    <div style={{ fontSize: '25px' }}>
      -&gt;&lt;- {response}
    </div>
  )
}

export default Soc
