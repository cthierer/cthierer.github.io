/**
 * @flow
 */

import { ACTION_SET_ACTIVE_SECTION } from './actions/setActiveSection'
import type { SetActiveSectionAction } from './actions/setActiveSection'
import { ACTION_DEREGISTER_SECTION } from './actions/deregisterSection'
import type { DeregisterSectionAction } from './actions/deregisterSection'
import { ACTION_REGISTER_SECTION } from './actions/registerSection'
import type { RegisterSectionAction, SectionConfig } from './actions/registerSection'

export type NavState = {
  +activeSection?: string,
  +sections?: { [string]: SectionConfig },
}

export type NavAction =
  SetActiveSectionAction
  | DeregisterSectionAction
  | RegisterSectionAction

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
      const { section, config } = data
      const { sections = {} } = state

      return {
        ...state,
        sections: {
          ...sections,
          [section]: config,
        },
      }
    }
    case ACTION_DEREGISTER_SECTION: {
      const { section } = data
      const { sections: { [section]: currSection, ...otherSections } = {} } = state

      return {
        ...state,
        sections: otherSections,
      }
    }
    default:
      return state
  }
}
