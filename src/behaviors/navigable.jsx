/**
 * @flow
 */

import React, { Component } from 'react'
import type { AbstractComponent, ElementRef } from 'react'
import { connect } from 'react-redux'
import { Visibility } from 'semantic-ui-react'
import setActiveSection from '../store/nav/actions/setActiveSection'
import registerSection from '../store/nav/actions/registerSection'
import deregisterSection from '../store/nav/actions/deregisterSection'

/* global HTMLElement */

type NavigableProps = {
  id: string,
  setActive: (string) => void,
  register: (string, HTMLElement) => void,
  deregister: (string) => void,
}

function mapDispatchToProps(dispatch) {
  return {
    setActive: (section) => {
      dispatch(setActiveSection(section))
    },
    register: (section, element) => {
      dispatch(registerSection(section, element))
    },
    deregister: (section) => {
      dispatch(deregisterSection(section))
    },
  }
}

function navigable<Config: {}>(
  WrappedComponent: AbstractComponent<Config>,
) {
  class NavigableComponent extends Component<NavigableProps & Config> {
    constructor(props: NavigableProps & Config) {
      super(props)
      this.elementRef = React.createRef()
    }

    componentDidMount() {
      const { id, register } = this.props
      const { current } = this.elementRef

      if (current) {
        register(id, current)
      }
    }

    componentWillUnmount() {
      const { id, deregister } = this.props
      deregister(id)
    }

    setActive = () => {
      const { id, setActive } = this.props
      setActive(id)
    }

    elementRef: ElementRef<typeof Visibility>

    render() {
      const { props } = this

      return (
        <Visibility
          once={false}
          onTopPassed={this.setActive}
          onBottomPassedReverse={this.setActive}
          ref={this.elementRef}
        >
          <WrappedComponent {...props} />
        </Visibility>
      )
    }
  }

  return connect(() => ({}), mapDispatchToProps)(NavigableComponent)
}

export default navigable
