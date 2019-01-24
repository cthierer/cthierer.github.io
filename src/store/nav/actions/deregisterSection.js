/**
 * @flow
 */

export const ACTION_DEREGISTER_SECTION = 'DEREGISTER_SECTION'

export type DeregisterSectionAction = {
  type: string,
  section: string,
}

export default function deregisterSection(
  section: string
): DeregisterSectionAction {
  return {
    type: ACTION_DEREGISTER_SECTION,
    section,
  }
}
