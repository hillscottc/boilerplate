import React from 'react'
import PropTypes from 'prop-types'
import { HashRouter as Router, Route } from 'react-router-dom'
import Header from './components/header'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import ComicSearch from './containers/comic-search'

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
      <Route path='/comic' component={props => <ComicSearch user={user} />} />
    </div>
  </Router>
)

App.propTypes = {
  user: PropTypes.object
}

export default App
