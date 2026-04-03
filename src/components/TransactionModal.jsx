import { useEffect, useState } from 'react'
import { CATEGORIES } from '../data/mockData'

const emptyForm = {
  date: '',
  amount: '',
  category: 'Food',
  type: 'expense',
  note: '',
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `t-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function TransactionModal({ open, mode, initial, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && initial) {
      setForm({
        date: initial.date || '',
        amount: String(initial.amount ?? ''),
        category: initial.category || 'Food',
        type: initial.type || 'expense',
        note: initial.note || '',
      })
    } else {
      const today = new Date().toISOString().slice(0, 10)
      setForm({ ...emptyForm, date: today, type: 'expense' })
    }
  }, [open, mode, initial])

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    const amountNum = Number(form.amount)
    if (!form.date || Number.isNaN(amountNum) || amountNum < 0) {
      return
    }
    const payload =
      mode === 'edit' && initial
        ? {
            id: initial.id,
            date: form.date,
            amount: amountNum,
            category: form.category,
            type: form.type,
            note: form.note.trim(),
          }
        : {
            id: newId(),
            date: form.date,
            amount: amountNum,
            category: form.category,
            type: form.type,
            note: form.note.trim(),
          }
    onSave(payload)
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tx-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="tx-modal-title">{mode === 'edit' ? 'Edit transaction' : 'Add transaction'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="tx-date">Date</label>
            <input
              id="tx-date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <label htmlFor="tx-amount">Amount (INR)</label>
            <input
              id="tx-amount"
              type="number"
              min="0"
              step="1"
              required
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <label htmlFor="tx-type">Type</label>
            <select
              id="tx-type"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="tx-cat">Category</label>
            <select
              id="tx-cat"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label htmlFor="tx-note">Note</label>
            <textarea
              id="tx-note"
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              placeholder="e.g. Groceries, rent split, side gig"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
