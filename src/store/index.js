/**
 * @flow
 */

import { createStore, combineReducers } from 'redux'
import nav from './nav'
import type { NavState, NavAction } from './nav'

/* global window */

export type State = {
  +nav: NavState,
}

type Action = NavAction

type Reducer = (State | void, Action) => State

type Dispatch = (Action) => void

const reducer: Reducer = combineReducers({
  nav,
})

const store = createStore<State, Action, Dispatch>(
  reducer,
  // eslint-disable-next-line
   window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

export default store
