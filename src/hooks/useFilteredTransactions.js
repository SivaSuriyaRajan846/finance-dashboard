import { useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import { filterAndSort } from '../utils/derive'

export function useFilteredTransactions() {
  const { state } = useFinance()
  return useMemo(
    () =>
      filterAndSort(
        state.transactions,
        state.search,
        state.categoryFilter,
        state.typeFilter,
        state.sortBy,
        state.sortDir,
      ),
    [
      state.transactions,
      state.search,
      state.categoryFilter,
      state.typeFilter,
      state.sortBy,
      state.sortDir,
    ],
  )
}
