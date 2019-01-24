/**
 * @flow
 */

export const ACTION_REGISTER_SECTION = 'REGISTER_SECTION'

export type SectionConfig = {
  routable: boolean,
}

export type RegisterSectionAction = {
  type: string,
  section: string,
  config: SectionConfig,
}

export default function registerSection(
  section: string,
  {
    routable = false,
  }: {
    routable?: boolean,
  } = {},
): RegisterSectionAction {
  return {
    type: ACTION_REGISTER_SECTION,
    section,
    config: { routable },
  }
}
