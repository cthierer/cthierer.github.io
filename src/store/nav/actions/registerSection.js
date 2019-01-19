/**
 * @flow
 */

/* global HTMLElement */

export const ACTION_REGISTER_SECTION = 'REGISTER_SECTION'

export type RegisterSectionAction = {
  type: string,
  section: string,
  element: HTMLElement,
}

export default function registerSection(
  section: string,
  element: HTMLElement,
): RegisterSectionAction {
  return { type: ACTION_REGISTER_SECTION, section, element }
}
