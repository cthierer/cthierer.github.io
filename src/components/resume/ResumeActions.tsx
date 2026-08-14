import { useConfigValue, usePage } from '../../config/ConfigContext'
import DocumentActions from '../document/DocumentActions'

const ResumeActions = () => {
	const resumeDownload = useConfigValue('resumeDownload')
	const homePage = usePage('home')
	const resumePage = usePage('resume')
	const isExternal = /^https?:\/\//.test(resumeDownload)
	const download = isExternal || resumePage?.formats?.includes('pdf') ? resumeDownload : undefined
	return (
		<DocumentActions
			download={download}
			label="Resume"
			backHref={homePage?.path}
			eventPrefix="resume"
		/>
	)
}

export default ResumeActions
