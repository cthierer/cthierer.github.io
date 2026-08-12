import { useConfigValue, usePage } from '../../config/ConfigContext'
import DocumentActions from '../document/DocumentActions'

const ResumeActions = () => {
	const resumeDownload = useConfigValue('resumeDownload')
	const homePage = usePage('home')
	return (
		<DocumentActions
			download={resumeDownload}
			label="Resume"
			backHref={homePage?.path}
			eventPrefix="resume"
		/>
	)
}

export default ResumeActions
