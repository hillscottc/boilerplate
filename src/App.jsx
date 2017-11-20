import React from 'react'
import PropTypes from 'prop-types'
import { HashRouter as Router, Route } from 'react-router-dom'
import Header from './components/header'
import ComicSearch from './containers/comic-search'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'

const App = ({user}) => (
  <Router>
    <div>
      <Header />
      <Route path='/' />
      <Route path='/comic' component={props => <ComicSearch user={user} />} />
    </div>
  </Router>
)

App.propTypes = {
  user: PropTypes.object
}

export default App
