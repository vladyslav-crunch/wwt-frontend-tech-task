import { useQuery } from '@tanstack/react-query'

import type { FilterItem } from '@/shared/api/types/Filter'
import filterData from '@/shared/temp/filterData.json'

interface FilterResponse {
	filterItems: FilterItem[]
}

const fetchFilterData = async (): Promise<FilterResponse> => {
	return filterData as FilterResponse
}

export const useFilterData = () => {
	return useQuery({
		queryKey: ['filters'],
		queryFn: fetchFilterData
	})
}
