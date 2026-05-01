import type { FilterItem } from '@/shared/api/types/Filter'

import type { SelectionState } from '../../utils/filterSelection'

interface FilterOptionListProps {
	filters: FilterItem[]
	selection: SelectionState
	onToggle: (filterId: string, optionId: string) => void
}

export const FilterOptionList = ({
	filters,
	selection,
	onToggle
}: FilterOptionListProps) => {
	return (
		<>
			{filters.map(filter => (
				<section
					key={filter.id}
					className="border-b-2 border-[#B4B4B4] py-4"
				>
					<div className="mb-4">
						<h3 className="text-lg font-medium text-black-500">
							{filter.name}
						</h3>
					</div>
					<div className="grid gap-3 sm:grid-cols-2">
						{filter.options.map(option => {
							const optionId = `${filter.id}-${option.id}`
							const isChecked =
								selection[filter.id]?.includes(option.id) ?? false

							return (
								<label
									className="group flex cursor-pointer items-center gap-3"
									key={option.id}
									htmlFor={optionId}
								>
									<input
										checked={isChecked}
										className="h-4 w-4 accent-slate-900"
										id={optionId}
										onChange={() => onToggle(filter.id, option.id)}
										type="checkbox"
									/>
									<span className="block text-sm text-slate-900">
										{option.name}
									</span>
								</label>
							)
						})}
					</div>
				</section>
			))}
		</>
	)
}
