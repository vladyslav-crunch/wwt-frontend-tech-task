import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { X } from 'lucide-react'

import type { SearchRequestFilter } from '@/shared/api/types/SearchRequest/SearchRequestFilter'
import { useFilterStore } from '@/shared/store/filterStore'
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog/ConfirmDialog'

import { useFilterData } from '../../hooks/useFilterData'
import {
	SelectionState,
	toSearchRequestFilters,
	toSelectionState,
	toggleSelection
} from '../../utils/filterSelection'
import { FilterOptionList } from './FilterOptionList'

interface FilterModalProps {
	isOpen: boolean
	onClose: () => void
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
		setSelection(prev => toggleSelection(prev, filterId, optionId))
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
		<div className="fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-10">
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

				<div className="flex flex-col">
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
					<FilterOptionList
						filters={data?.filterItems ?? []}
						selection={selection}
						onToggle={handleToggleOption}
					/>
				</div>

				<footer className="relative flex w-full flex-col items-center gap-4 py-6 sm:flex-row sm:justify-center">
					<button
						className="text-sm font-semibold text-[#078691] transition hover:text-slate-800 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2"
						disabled={isLoading}
						onClick={handleClearAll}
						type="button"
					>
						<u>{t('clearAllFilters')}</u>
					</button>

					<button
						className="w-full max-w-[220px] rounded-2xl bg-[#ff5a00] py-5 text-sm font-bold text-white transition hover:bg-[#e65100] disabled:opacity-50"
						disabled={isLoading}
						onClick={handleApply}
						type="button"
					>
						{t('applyFilters')}
					</button>
				</footer>
			</div>
			<ConfirmDialog
				cancelLabel={t('confirmFiltersDecline')}
				confirmLabel={t('confirmFiltersAccept')}
				isOpen={isConfirmOpen}
				onCancel={handleCancelConfirm}
				onConfirm={handleConfirm}
				title={t('confirmFiltersTitle')}
			/>
		</div>
	)
}
