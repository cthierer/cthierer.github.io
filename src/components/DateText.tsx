interface TimeTextProps {
	readonly date: Date
	readonly children: React.ReactNode
}

interface DateRangeTextProps {
	readonly startDate: Date
	readonly endDate?: Date
	readonly variant?: 'month' | 'year'
	readonly presentLabel?: string
}

interface YearTextProps {
	readonly date: Date
}

const monthFormatter = new Intl.DateTimeFormat('en-US', {
	month: 'short',
	year: 'numeric',
	timeZone: 'UTC',
})

const yearFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	timeZone: 'UTC',
})

const padDatePart = (value: number): string => value.toString().padStart(2, '0')

const getYearDateTime = (date: Date): string => date.getUTCFullYear().toString()

const getMonthDateTime = (date: Date): string =>
	`${date.getUTCFullYear()}-${padDatePart(date.getUTCMonth() + 1)}`

const TimeText = ({ date, children }: TimeTextProps) => (
	<time dateTime={getMonthDateTime(date)}>{children}</time>
)

export const YearText = ({ date }: YearTextProps) => (
	<time dateTime={getYearDateTime(date)}>{yearFormatter.format(date)}</time>
)

const DateRangeText = ({
	startDate,
	endDate,
	variant = 'month',
	presentLabel = 'Present',
}: DateRangeTextProps) => {
	if (variant === 'year') {
		return (
			<>
				<time dateTime={getYearDateTime(startDate)}>{yearFormatter.format(startDate)}</time> -{' '}
				{endDate ? (
					<time dateTime={getYearDateTime(endDate)}>{yearFormatter.format(endDate)}</time>
				) : (
					presentLabel
				)}
			</>
		)
	}

	return (
		<>
			<TimeText date={startDate}>{monthFormatter.format(startDate)}</TimeText> -{' '}
			{endDate ? (
				<TimeText date={endDate}>{monthFormatter.format(endDate)}</TimeText>
			) : (
				presentLabel
			)}
		</>
	)
}

export default DateRangeText
