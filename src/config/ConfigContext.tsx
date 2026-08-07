import { createContext, useContext } from 'react'
import Config from './Config'

const ConfigContext = createContext<Config | null>(null)

export default ConfigContext

export const useConfig = (): Config => {
	const config = useContext(ConfigContext)

	if (!config) {
		throw new Error('useConfig must be used inside a ConfigProvider')
	}

	return config
}

export const useConfigValue = <K extends keyof Config>(name: K): Config[K] => {
	const config = useConfig()
	return config[name]
}

export const usePage = (pageKey: 'home' | 'resume' | 'privacy') => {
	const pages = useConfigValue('pages')
	const page = pages.find(({ key }) => key === pageKey)
	return page
}
