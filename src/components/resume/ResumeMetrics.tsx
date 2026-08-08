import type { ResumeMetricsSection } from '../../content/resume'

const ResumeMetrics = ({ section }: { readonly section: ResumeMetricsSection }) => {
	const { metrics, title } = section

	if (metrics.length === 0) {
		return null
	}

	return (
		<section className="resume-metrics" aria-labelledby="resume-metrics">
			<h2 id="resume-metrics" className="resume-metrics-heading">
				{title}
			</h2>
			<dl className="resume-metrics-list">
				{metrics.map(metric => (
					<div className="resume-metric" key={`${metric.value}-${metric.label}`}>
						<dt className="resume-metric-value">{metric.value}</dt>
						<dd className="resume-metric-label">{metric.label}</dd>
						{metric.detail ? <dd className="resume-metric-detail">{metric.detail}</dd> : null}
					</div>
				))}
			</dl>
		</section>
	)
}

export default ResumeMetrics
