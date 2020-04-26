import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { StocksList, } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  render() {
    return (
      <Router>

        <NavBar/>
        <Switch>
          <Route path="/" exact component={StocksList} />
        </Switch>

      </Router>
    )
  }
}

export default App
