import React from 'react'
import { NavLink } from 'react-router-dom'
import * as dpwLogo from '../assets/dpw_logo_header.gif'
import * as helpIcon from '../assets/help.png'
import * as emailIcon from '../assets/email.png'
import * as keyIcon from '../assets/key.png'

const navItemStyle = {display: 'inline', paddingRight: '10px'}

const Header = () => (
  <div>
    <div style={{float: 'left', display: 'inline'}}>
      <a href={'/index.asp'}><img src={dpwLogo} /></a>
    </div>
    <nav className='Nav' style={{float: 'left', display: 'inline', marginTop: '15px', marginLeft: '15px', fontSize: '14pt'}}>
      <NavLink activeStyle={{ color: 'red' }}to='/book'>Book Search</NavLink>
      &nbsp; | &nbsp;
      <NavLink activeStyle={{ color: 'red' }} to='/comic'>Comic Search</NavLink>
    </nav>
    <ul style={{float: 'left', display: 'inline', marginTop: '15px', marginLeft: '50px'}}>
      <li style={navItemStyle}>
        <a href={'/needAssistance.asp'}><img src={helpIcon} /> Need Help?</a>
      </li>
      <li style={navItemStyle}>
        <a href={'mailto:CP.Disney.Publishing@disney.com'}><img src={emailIcon} /> Contact Us</a>
      </li>
      <li style={navItemStyle}>
        <a href={'/smforms/signoff.html'}><img src={keyIcon} /> Logout</a>
      </li>
    </ul>
    <hr style={{clear: 'both'}} />
  </div>
)

export default Header
