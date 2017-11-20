import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Header from 'src/components/header'
import * as dpwLogo from 'src/assets/dpw_logo_header.gif'

Enzyme.configure({ adapter: new Adapter() })

describe('<Header />', () => {
  it('should containd the logo', () => {
    const wrapper = shallow(<Header />)
    expect(wrapper.containsMatchingElement(
      <a href={'/index.asp'}><img src={dpwLogo} /></a>
    )).toEqual(true)
  })
})
