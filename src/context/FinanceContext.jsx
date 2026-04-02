import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
} from 'react'
import { INITIAL_TRANSACTIONS } from '../data/mockData'

const STORAGE_TX = 'zorovyn_finance_transactions'
const STORAGE_ROLE = 'zorovyn_finance_role'
const STORAGE_THEME = 'zorovyn_finance_theme'

function loadTransactions() {
  try {
    const raw = localStorage.getItem(STORAGE_TX)
    if (!raw) return [...INITIAL_TRANSACTIONS]
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) return [...INITIAL_TRANSACTIONS]
    return parsed
  } catch {
    return [...INITIAL_TRANSACTIONS]
  }
}

function loadRole() {
  const r = localStorage.getItem(STORAGE_ROLE)
  return r === 'admin' || r === 'viewer' ? r : 'viewer'
}

function loadTheme() {
  const t = localStorage.getItem(STORAGE_THEME)
  return t === 'dark' ? 'dark' : 'light'
}

const initialState = {
  transactions: loadTransactions(),
  role: loadRole(),
  theme: loadTheme(),
  search: '',
  categoryFilter: 'all',
  typeFilter: 'all',
  sortBy: 'date',
  sortDir: 'desc',
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload }
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] }
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t,
        ),
      }
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      }
    case 'SET_ROLE':
      return { ...state, role: action.payload }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    case 'SET_SEARCH':
      return { ...state, search: action.payload }
    case 'SET_CATEGORY_FILTER':
      return { ...state, categoryFilter: action.payload }
    case 'SET_TYPE_FILTER':
      return { ...state, typeFilter: action.payload }
    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload.sortBy ?? state.sortBy,
        sortDir: action.payload.sortDir ?? state.sortDir,
      }
    case 'RESET_TO_SAMPLE':
      return { ...state, transactions: [...INITIAL_TRANSACTIONS] }
    default:
      return state
  }
}

const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TX, JSON.stringify(state.transactions))
    } catch {
      /* ignore */
    }
  }, [state.transactions])

  useEffect(() => {
    localStorage.setItem(STORAGE_ROLE, state.role)
  }, [state.role])

  useEffect(() => {
    localStorage.setItem(STORAGE_THEME, state.theme)
    document.documentElement.dataset.theme = state.theme
  }, [state.theme])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  )
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used inside FinanceProvider')
  return ctx
}
