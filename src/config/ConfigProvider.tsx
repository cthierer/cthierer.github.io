import ConfigContext from './ConfigContext'
import Config from './Config'

interface ConfigProviderProps {
	config: Config
	children: React.ReactNode
}

const ConfigProvider = ({ config, children }: ConfigProviderProps) => (
	<ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
)

export default ConfigProvider
