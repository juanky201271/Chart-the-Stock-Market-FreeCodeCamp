import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Links extends Component {
  render() {
    return (
      <>
        <Link to="/" className="navbar-brand">
          <div style={{ color: '#222' }} >Chart the Stock Market</div>
        </Link>
      </>
    )
  }
}

export default Links
