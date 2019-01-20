/**
 * @flow
 */

import React, { Component } from 'react'
import type { AbstractComponent } from 'react'
import { connect } from 'react-redux'
import { Visibility, Divider } from 'semantic-ui-react'
import setActiveSection from '../store/nav/actions/setActiveSection'
import registerSection from '../store/nav/actions/registerSection'
import deregisterSection from '../store/nav/actions/deregisterSection'

type NavigableProps = {
  id: string,
  routable?: boolean,
  setActive: (string) => void,
  register: (string, boolean) => void,
  deregister: (string) => void,
}

function mapDispatchToProps(dispatch) {
  return {
    setActive: (section) => {
      dispatch(setActiveSection(section))
    },
    register: (section, routable) => {
      dispatch(registerSection(section, { routable }))
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
    static defaultProps = {
      routable: false,
    }

    componentDidMount() {
      this.registerSection()
    }

    componentWillUnmount() {
      this.deregisterSection()
    }

    deregisterSection = () => {
      const { id, deregister } = this.props
      deregister(id)
    }

    registerSection = () => {
      const { id, routable = false, register } = this.props
      register(id, routable)
    }

    setActive = () => {
      const { id, setActive } = this.props
      setActive(id)
    }

    render() {
      const { props } = this
      const id = props.routable ? `/${props.id}` : undefined

      return (
        <Visibility
          once={false}
          onTopPassed={this.setActive}
          onBottomPassedReverse={this.setActive}
          offset={100}
          fireOnMount={false}
          updateOn="repaint"
        >
          {id && <Divider id={id} />}
          <WrappedComponent {...props} />
        </Visibility>
      )
    }
  }

  return connect(() => ({}), mapDispatchToProps)(NavigableComponent)
}

export default navigable
