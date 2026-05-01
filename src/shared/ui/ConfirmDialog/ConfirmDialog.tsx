import { X } from 'lucide-react'

interface ConfirmDialogProps {
	isOpen: boolean
	title: string
	description?: string
	confirmLabel: string
	cancelLabel: string
	onConfirm: () => void
	onCancel: () => void
}

export const ConfirmDialog = ({
	isOpen,
	title,
	description,
	confirmLabel,
	cancelLabel,
	onConfirm,
	onCancel
}: ConfirmDialogProps) => {
	if (!isOpen) {
		return null
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
			<div
				role="dialog"
				aria-modal="true"
				className="relative w-full max-w-md sm:max-w-2xl rounded-xl bg-white p-4 sm:p-6 shadow-xl"
			>
				<header className="grid grid-cols-[1fr_auto_1fr] items-center">
					<span aria-hidden="true" />

					<h3 className="text-lg sm:text-2xl font-medium text-slate-800 text-center">
						{title}
					</h3>

					<button
						onClick={onCancel}
						className="justify-self-end text-gray-600"
						aria-label="Close"
						type="button"
					>
						<X
							size={20}
							className="sm:w-6 sm:h-6"
						/>
					</button>
				</header>

				{description && (
					<p className="mt-3 sm:mt-4 text-center text-sm sm:text-base text-gray-500">
						{description}
					</p>
				)}

				<div className="mt-8 sm:mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-6">
					<button
						className="w-full sm:w-auto min-w-[140px] rounded-xl border border-gray-300 bg-white px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-slate-700 transition hover:bg-gray-50"
						onClick={onCancel}
						type="button"
					>
						{cancelLabel}
					</button>

					<button
						className="w-full sm:w-auto min-w-[140px] rounded-xl bg-[#ff5a00] px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-white transition hover:bg-[#e65100]"
						onClick={onConfirm}
						type="button"
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	)
}
