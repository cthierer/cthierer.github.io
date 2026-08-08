import type Entry from './Entry'

const singletonKinds = new Set(['profile', 'metrics', 'skills', 'experience', 'education'])

const isResumeSection = (entry: Entry): boolean =>
	entry.category === 'resume' && entry.data.archetype === 'resume-section'

export const validateResumeSections = (content: readonly Entry[]): void => {
	const usedOrders = new Map<number, string>()
	const usedKinds = new Map<string, string>()

	for (const entry of content.filter(isResumeSection)) {
		const order = entry.data.order
		const kind = entry.data.kind
		if (typeof order !== 'number' || typeof kind !== 'string') {
			continue
		}

		const existingOrder = usedOrders.get(order)
		if (existingOrder) {
			throw new Error(
				`Duplicate resume section order ${order}: ${existingOrder} and ${entry.name}.`,
			)
		}
		usedOrders.set(order, entry.name)

		if (!singletonKinds.has(kind)) {
			continue
		}
		const existingKind = usedKinds.get(kind)
		if (existingKind) {
			throw new Error(`Duplicate resume section kind "${kind}": ${existingKind} and ${entry.name}.`)
		}
		usedKinds.set(kind, entry.name)
	}
}
