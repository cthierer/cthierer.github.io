import { useContent } from './ContentContext'
import EducationEntry from './EducationEntry'

const getComparableDate = (entry: EducationEntry): number =>
	(entry.endDate ?? entry.startDate ?? new Date(0)).valueOf()

const useRecentEducation = (limit: number = 4): EducationEntry[] => {
	const content = useContent()

	return content
		.filter(entry => entry.category === 'education')
		.map(entry => new EducationEntry(entry.category, entry.data, entry.html, entry.name))
		.sort((entryA, entryB) => getComparableDate(entryB) - getComparableDate(entryA))
		.slice(0, limit)
}

export default useRecentEducation
