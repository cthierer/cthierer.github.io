/**
 * @flow
 */

import { createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import navReducer from './nav'
import type { NavState, NavAction } from './nav'

export type State = {
  +nav: NavState,
}

type Action = NavAction
type Reducer = (State | void, Action) => State
type Dispatch = Action => void

const appReducer: Reducer = combineReducers({
  nav: navReducer,
})

const store = createStore<State, Action, Dispatch>(
  appReducer,
  composeWithDevTools(),
)

export default store
