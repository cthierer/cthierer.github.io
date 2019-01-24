/**
 * @flow
 */

import React from 'react'
import type { Element } from 'react'
import { Provider } from 'react-redux'
import store from '../store'

export default function wrapRootElement({ element }: { element: Element<*> }) {
  return React.createElement(Provider, { store }, element)
}
