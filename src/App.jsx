import React from 'react'
import PropTypes from 'prop-types'
import { HashRouter as Router, Route } from 'react-router-dom'
import Header from './components/header'
import './App.css'

// const App = () => (
//   <div className='App'>
//     <div className='App-header'>
//       <img src={logo} className='App-logo shake-rotate' alt='logo' />
//     </div>
//     <Hello msg='Hello World' />
//     <Router>
//       {renderRoutes(routes)}
//     </Router>
//   </div>
// )

const App = ({user}) => (
  <Router>
    <div>
      <Header />
      <Route path='/' />
    </div>
  </Router>
)

App.propTypes = {
  user: PropTypes.object
}

export default App
