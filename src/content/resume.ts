interface ResumeSectionBase {
	readonly entryName: string
	readonly html: string
	readonly markdown: string
	readonly order: number
	readonly title: string
}

export interface ResumeProfile extends ResumeSectionBase {
	readonly headline: string
	readonly kind: 'profile'
	readonly location: string
	readonly name: string
}
export interface ResumeMetric {
	readonly detail?: string
	readonly label: string
	readonly value: string
}
export interface ResumeMetricsSection extends ResumeSectionBase {
	readonly kind: 'metrics'
	readonly metrics: readonly ResumeMetric[]
}
export interface ResumeSkillGroup {
	readonly items: readonly string[]
	readonly label: string
}
export interface ResumeSkillsSection extends ResumeSectionBase {
	readonly groups: readonly ResumeSkillGroup[]
	readonly kind: 'skills'
}
export interface ResumeProseSection extends ResumeSectionBase {
	readonly kind: 'prose'
}
export interface ResumeExperienceSection extends ResumeSectionBase {
	readonly kind: 'experience'
	readonly limit?: number
}
export interface ResumeEducationSection extends ResumeSectionBase {
	readonly kind: 'education'
}
export type ResumeSection =
	| ResumeProfile
	| ResumeMetricsSection
	| ResumeSkillsSection
	| ResumeProseSection
	| ResumeExperienceSection
	| ResumeEducationSection
