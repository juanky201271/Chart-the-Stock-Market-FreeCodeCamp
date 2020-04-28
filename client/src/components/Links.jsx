import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Soc } from '../components'

class Links extends Component {
  render() {
    return (
      <>
        <Link to="/" className="navbar-brand">
          <div style={{ color: '#222' }} >Chart the Stock Market</div>
        </Link>
        <Soc />
      </>
    )
  }
}

export default Links
