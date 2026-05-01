import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useFilterStore } from '@/shared/store/filterStore'

import { FilterModal } from './components/FilterModal/FilterModal'

export const App = () => {
	const { t } = useTranslation('filter')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const appliedFilters = useFilterStore(state => state.appliedFilters)

	return (
		<section className="w-full h-dvh flex items-center justify-center flex-col gap-6">
			<h1 className="text-6xl text-gray-600 ">{t('pageTitle')}</h1>

			<button
				className="px-3 py-3 bg-slate-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
				onClick={() => setIsModalOpen(true)}
			>
				{t('openFilterModal')}
			</button>
			<FilterModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
			<section className="rounded-3xl bg-white p-3 shadow-sm">
				<h2 className="text-lg font-semibold text-slate-900">
					{t('currentFilters')}
				</h2>
				<pre className="mt-4 max-h-72 overflow-auto rounded-2xl bg-slate-950/95 p-4 text-xs text-slate-100">
					{JSON.stringify(appliedFilters, null, 2)}
				</pre>
			</section>
		</section>
	)
}
