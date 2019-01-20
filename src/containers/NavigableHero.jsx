/**
 * @flow
 */

import { connect } from 'react-redux'
import Hero from '../components/Hero'
import navigable from '../behaviors/navigable'
import affixNavMenu from '../store/nav/actions/affixNavMenu'

function mapDispatchToProps(dispatch) {
  return {
    onPass: () => dispatch(affixNavMenu(true)),
    onPassReverse: () => dispatch(affixNavMenu(false)),
  }
}

export default navigable(connect(null, mapDispatchToProps)(Hero))
