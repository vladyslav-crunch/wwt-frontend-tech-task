import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { X } from 'lucide-react'

import { FilterType } from '@/shared/api/types/Filter'
import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'
import { useFilterStore } from '@/shared/store/filterStore'

import { useFilterData } from '../../hooks/useFilterData'
import { ConfirmDialog } from './ConfirmDialog'

interface FilterModalProps {
	isOpen: boolean
	onClose: () => void
}

type SelectionState = Record<string, string[]>

const toSelectionState = (filters: SearchRequestFilter): SelectionState => {
	return filters.reduce<SelectionState>((acc, filter) => {
		acc[filter.id] = filter.optionsIds
		return acc
	}, {})
}

const toSearchRequestFilters = (
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

export const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
	const { t } = useTranslation('filter')
	const { data, isLoading, isError } = useFilterData()
	const appliedFilters = useFilterStore(state => state.appliedFilters)
	const setAppliedFilters = useFilterStore(state => state.setAppliedFilters)
	const [selection, setSelection] = useState<SelectionState>({})
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const [pendingSelection, setPendingSelection] = useState<SearchRequestFilter>(
		[]
	)

	useEffect(() => {
		if (isOpen) {
			setSelection(toSelectionState(appliedFilters))
		}
	}, [isOpen, appliedFilters])

	if (!isOpen) {
		return null
	}

	const handleToggleOption = (filterId: string, optionId: string) => {
		setSelection(prev => {
			const current = new Set(prev[filterId] ?? [])
			if (current.has(optionId)) {
				current.delete(optionId)
			} else {
				current.add(optionId)
			}

			return {
				...prev,
				[filterId]: Array.from(current)
			}
		})
	}

	const handleApply = () => {
		setPendingSelection(toSearchRequestFilters(selection))
		setIsConfirmOpen(true)
	}

	const handleClearAll = () => {
		setSelection({})
	}

	const handleConfirm = () => {
		setAppliedFilters(pendingSelection)
		setIsConfirmOpen(false)
		onClose()
	}

	const handleCancelConfirm = () => {
		setIsConfirmOpen(false)
	}

	return (
		<div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 py-10">
			<div
				aria-modal="true"
				className="relative w-full max-w-4xl rounded-2xl bg-white p-4 px-[32px] shadow-2xl"
				role="dialog"
			>
				<header className="relative flex items-center justify-center border-b-2 border-[#B4B4B4] py-5">
					<h2 className="text-3xl font-medium text-black-500">
						{t('filtersTitle')}
					</h2>
					<button
						aria-label={t('close')}
						className="absolute right-0 text-gray-600"
						onClick={onClose}
						type="button"
					>
						<X size={24} />
					</button>
				</header>

				<div className="mt-2 flex flex-col gap-3">
					{isLoading && (
						<p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
							{t('loading')}
						</p>
					)}
					{isError && (
						<p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
							{t('error')}
						</p>
					)}
					{data?.filterItems.map(filter => (
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
											className="group flex cursor-pointer gap-3  items-center"
											key={option.id}
											htmlFor={optionId}
										>
											<input
												checked={isChecked}
												className="h-4 w-4 accent-slate-900"
												id={optionId}
												onChange={() =>
													handleToggleOption(filter.id, option.id)
												}
												type="checkbox"
											/>
											<span>
												<span className="block text-sm  text-slate-900">
													{option.name}
												</span>
											</span>
										</label>
									)
								})}
							</div>
						</section>
					))}
				</div>

				<footer className="relative flex w-full items-center justify-center p-6">
					<button
						className="absolute right-0 text-sm font-semibold text-[#078691] transition hover:text-slate-800"
						disabled={isLoading}
						onClick={handleClearAll}
						type="button"
					>
						<u>{t('clear_all_parameters')}</u>
					</button>
					<button
						className="w-full max-w-[220px] rounded-2xl bg-[#ff5a00] py-5 text-sm font-bold text-white transition hover:bg-[#e65100] disabled:opacity-50"
						disabled={isLoading}
						onClick={handleApply}
						type="button"
					>
						{t('apply')}
					</button>
				</footer>
			</div>
			<ConfirmDialog
				cancelLabel={t('confirmDecline')}
				confirmLabel={t('confirmAccept')}
				isOpen={isConfirmOpen}
				onCancel={handleCancelConfirm}
				onConfirm={handleConfirm}
				title={t('confirmTitle')}
			/>
		</div>
	)
}
