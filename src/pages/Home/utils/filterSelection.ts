import { FilterType } from '@/shared/api/types/Filter'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'

export type SelectionState = Record<string, string[]>

export const toSelectionState = (
	filters: SearchRequestFilter
): SelectionState => {
	return filters.reduce<SelectionState>((acc, filter) => {
		acc[filter.id] = filter.optionsIds
		return acc
	}, {})
}

export const toSearchRequestFilters = (
	selection: SelectionState
): SearchRequestFilter => {
	return Object.entries(selection)
		.filter(([, optionIds]) => optionIds.length > 0)
		.map(([id, optionIds]) => ({
			id,
			type: FilterType.OPTION,
			optionsIds: optionIds
		}))
}

export const toggleSelection = (
	selection: SelectionState,
	filterId: string,
	optionId: string
): SelectionState => {
	const current = new Set(selection[filterId] ?? [])

	if (current.has(optionId)) {
		current.delete(optionId)
	} else {
		current.add(optionId)
	}

	return {
		...selection,
		[filterId]: Array.from(current)
	}
}
