/**
 * @flow
 */

export const ACTION_SET_ACTIVE_SECTION = 'SET_ACTIVE_SECTION'

export type SetActiveSectionAction = {
  type: string,
  section: string,
}

export default function setActiveSection(section: string): SetActiveSectionAction {
  return { type: ACTION_SET_ACTIVE_SECTION, section }
}
