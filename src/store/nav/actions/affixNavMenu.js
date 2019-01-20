/**
 * @flow
 */

export const ACTION_AFFIX_NAV_MENU = 'AFFIX_NAV_MENU'

export type AffixNavMenuType = {
  type: string,
  affixed: boolean,
}

export default function affixNavMenu(affixed: boolean) {
  return { type: ACTION_AFFIX_NAV_MENU, affixed }
}
