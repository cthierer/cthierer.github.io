import { useResumeMetrics } from '../../content/resume'

const ResumeMetrics = () => {
	const metrics = useResumeMetrics()
	if (metrics.length === 0) {
		return null
	}

	return (
		<section className="resume-metrics" aria-labelledby="resume-metrics">
			<h2 id="resume-metrics" className="resume-metrics-heading">
				At a glance
			</h2>
			<div className="resume-metrics-list">
				{metrics.map(metric => (
					<div className="resume-metric" key={`${metric.value}-${metric.label}`}>
						<p className="resume-metric-value">{metric.value}</p>
						<p className="resume-metric-label">{metric.label}</p>
						{metric.detail ? <p className="resume-metric-detail">{metric.detail}</p> : null}
					</div>
				))}
			</div>
		</section>
	)
}

export default ResumeMetrics
