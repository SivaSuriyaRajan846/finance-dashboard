import { useMemo, useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { CATEGORIES } from '../data/mockData'
import { formatDate, formatMoney } from '../utils/format'
import { TransactionModal } from './TransactionModal'

function exportCsv(rows) {
  const header = ['date', 'amount', 'category', 'type', 'note']
  const lines = [
    header.join(','),
    ...rows.map((r) =>
      header
        .map((k) => {
          const v = r[k] ?? ''
          const s = String(v).replace(/"/g, '""')
          return /[",\n]/.test(s) ? `"${s}"` : s
        })
        .join(','),
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function TransactionsSection({ filteredRows }) {
  const { state, dispatch } = useFinance()
  const isAdmin = state.role === 'admin'
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [editing, setEditing] = useState(null)

  const sortHint = useMemo(() => {
    const { sortBy, sortDir } = state
    return `${sortBy} · ${sortDir === 'asc' ? 'ascending' : 'descending'}`
  }, [state.sortBy, state.sortDir])

  function openAdd() {
    setModalMode('add')
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(row) {
    setModalMode('edit')
    setEditing(row)
    setModalOpen(true)
  }

  function handleSave(payload) {
    if (modalMode === 'edit') {
      dispatch({ type: 'UPDATE_TRANSACTION', payload })
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload })
    }
  }

  function handleDelete(id) {
    if (window.confirm('Remove this transaction?')) {
      dispatch({ type: 'DELETE_TRANSACTION', payload: id })
    }
  }

  function toggleSort(field) {
    if (state.sortBy === field) {
      dispatch({
        type: 'SET_SORT',
        payload: { sortDir: state.sortDir === 'asc' ? 'desc' : 'asc' },
      })
    } else {
      dispatch({
        type: 'SET_SORT',
        payload: { sortBy: field, sortDir: field === 'date' ? 'desc' : 'asc' },
      })
    }
  }

  return (
    <section className="section" aria-labelledby="tx-heading">
      <h2 id="tx-heading" className="section-title">
        Line items
      </h2>

      <div className="toolbar">
        <div className="field">
          <label className="field-label" htmlFor="search-tx">
            Search
          </label>
          <input
            id="search-tx"
            type="search"
            placeholder="Note, category, amount…"
            value={state.search}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
          />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="filter-cat">
            Category
          </label>
          <select
            id="filter-cat"
            value={state.categoryFilter}
            onChange={(e) =>
              dispatch({ type: 'SET_CATEGORY_FILTER', payload: e.target.value })
            }
          >
            <option value="all">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field-label" htmlFor="filter-type">
            Type
          </label>
          <select
            id="filter-type"
            value={state.typeFilter}
            onChange={(e) =>
              dispatch({ type: 'SET_TYPE_FILTER', payload: e.target.value })
            }
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        {isAdmin && (
          <div className="field" style={{ flex: '0 0 auto' }}>
            <span className="field-label" style={{ visibility: 'hidden' }}>
              Add
            </span>
            <button type="button" className="btn btn-primary" onClick={openAdd}>
              Add transaction
            </button>
          </div>
        )}
      </div>

      <p className="sr-only">Sorting: {sortHint}</p>

      {filteredRows.length === 0 ? (
        <div className="panel">
          <div className="empty-state">
            <strong>Nothing matches that filter.</strong>
            <p>Widen the search, pick &quot;All&quot; for category/type, or switch to admin and add a row.</p>
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col" onClick={() => toggleSort('date')}>
                  Date {state.sortBy === 'date' ? (state.sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col" onClick={() => toggleSort('category')}>
                  Category {state.sortBy === 'category' ? (state.sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col">Type</th>
                <th scope="col" onClick={() => toggleSort('amount')}>
                  Amount {state.sortBy === 'amount' ? (state.sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th scope="col">Note</th>
                {isAdmin && <th scope="col">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((t) => (
                <tr key={t.id}>
                  <td>{formatDate(t.date)}</td>
                  <td>{t.category}</td>
                  <td>
                    <span
                      className={
                        t.type === 'income' ? 'badge badge-income' : 'badge badge-expense'
                      }
                    >
                      {t.type}
                    </span>
                  </td>
                  <td style={{ fontVariantNumeric: 'tabular-nums' }}>{formatMoney(t.amount)}</td>
                  <td>{t.note || '—'}</td>
                  {isAdmin && (
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => openEdit(t)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => handleDelete(t.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '0.75rem' }}>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => exportCsv(filteredRows)}
        >
          Export visible rows (CSV)
        </button>
      </div>

      <TransactionModal
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </section>
  )
}
