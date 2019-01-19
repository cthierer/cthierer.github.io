/**
 * @flow
 */

import { ACTION_REGISTER_SECTION } from './actions/registerSection'
import type { RegisterSectionAction } from './actions/registerSection'
import { ACTION_SET_ACTIVE_SECTION } from './actions/setActiveSection'
import type { SetActiveSectionAction } from './actions/setActiveSection'
import { ACTION_DEREGISTER_SECTION } from './actions/deregisterSection'
import type { DeregisterSectionAction } from './actions/deregisterSection'

/* global HTMLElement */

export type NavState = {
  +activeSection?: string,
  +sections?: { [string]: HTMLElement },
}

export type NavAction =
  SetActiveSectionAction |
  RegisterSectionAction |
  DeregisterSectionAction

export default function navReducer(
  state: NavState = {},
  // $FlowFixMe
  { type, ...data }: NavAction,
): NavState {
  if (!type) {
    return state
  }

  switch (type.toUpperCase()) {
    case ACTION_SET_ACTIVE_SECTION: {
      const { section } = data

      return {
        ...state,
        activeSection: section,
      }
    }
    case ACTION_REGISTER_SECTION: {
      const { section, element } = data
      const { sections: prevSections = {} } = state

      return {
        ...state,
        sections: { ...prevSections, [section]: element },
      }
    }
    case ACTION_DEREGISTER_SECTION: {
      const { section } = data
      const { sections: prevSections = {} } = state
      const sections = { ...prevSections }

      delete sections[section]

      return {
        ...state,
        sections,
      }
    }
    default:
      return state
  }
}
