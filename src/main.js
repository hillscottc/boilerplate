import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AppContainer } from 'react-hot-loader'

import { Modal } from 'react-overlays'
Modal.prototype.componentWillMount = function componentWillMount () {
  this.focus = function focus () {}
}

const userEl = document.getElementById('user')

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component
        user={{
          contactId: userEl.getAttribute('data-contact-id'),
          login: userEl.getAttribute('data-login'),
          customerType: userEl.getAttribute('data-customer-type'),
          roles: userEl.getAttribute('data-roles').split(','),
          region: userEl.getAttribute('data-region'),
          dpwUser: (userEl.getAttribute('data-dpw-user') === 'True')
        }} />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => render(App))
}
