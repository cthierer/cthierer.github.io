/**
 * @flow
 */

import { connect } from 'react-redux'
import NavMenu from '../components/NavMenu'
import type { State } from '../store'

function mapStateToProps({ nav: { activeSection = 'home' } = {} }: State) {
  return { active: activeSection }
}

export default connect(mapStateToProps)(NavMenu)
