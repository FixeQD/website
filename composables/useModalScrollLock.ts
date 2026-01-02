// SPDX-License-Identifier: MIT
// Centralized scroll lock for modals

import { ref, watch, onUnmounted, type Ref, type ComputedRef } from 'vue'

const openModals = ref(0)

export const useModalScrollLock = () => {
	const lock = () => {
		openModals.value++
		if (openModals.value === 1) {
			document.body.style.overflow = 'hidden'
		}
	}

	const unlock = () => {
		openModals.value = Math.max(0, openModals.value - 1)
		if (openModals.value === 0) {
			document.body.style.overflow = ''
		}
	}

	return { lock, unlock, openModals }
}

export const useModalOpen = (isOpen: Ref<boolean> | ComputedRef<boolean>) => {
	const { lock, unlock } = useModalScrollLock()

	watch(isOpen, (open: boolean) => {
		if (open) {
			lock()
		} else {
			unlock()
		}
	})

	onUnmounted(() => {
		if (isOpen.value) {
			unlock()
		}
	})
}
