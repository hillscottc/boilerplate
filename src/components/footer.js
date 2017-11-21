import React from 'react'

const itemStyle = {display: 'inline'}

const Footer = () => (
  <div>
    <hr style={{borderTop: '1px solid #8c8b8b'}} />
    <ul style={{ display: 'inline', marginTop: '15px'}}>
      <li style={itemStyle}>
        <a href={'/contact.asp'}>Contact Us</a>
        &nbsp; | &nbsp;
      </li>
      <li style={itemStyle}>
        <a href={'/smforms/TermsAndConditions.html'} target={'_blank'}>Terms & Conditions of Use</a>
        &nbsp; | &nbsp;
      </li>
      <li style={itemStyle}>
        <a href={'/needAssistance.asp'}>Help</a>
        &nbsp; | &nbsp;
      </li>
      <li style={itemStyle}>
        <a href={'/needAssistance.asp#Site'}>Site Map</a>
      </li>
    </ul>
  </div>
)

export default Footer
