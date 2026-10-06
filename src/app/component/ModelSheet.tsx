'use client'

import { CloseOutlined } from '@ant-design/icons'

type Stat = { label: string; value: string; tone?: 'profit' | 'loss' }

type ModelResult = {
  symbol: string
  kind: string
  image: string
  forward: { period: string; stats: Stat[] }
  backtest: { period: string; stats: Stat[] }
}

export const MODEL_RESULTS: ModelResult[] = [
  {
    symbol: 'XAUUSD',
    kind: 'Gold',
    image: '/XAUUSDcurveback.png',
    forward: {
      period: '16/02/26 – 27/02/26',
      stats: [
        { label: 'Win rate', value: '94.28%' },
        { label: 'Total trades', value: '35' },
        { label: 'Win', value: '33', tone: 'profit' },
        { label: 'Loss', value: '2', tone: 'loss' },
      ],
    },
    backtest: {
      period: '17/01/25 – 30/01/26',
      stats: [
        { label: 'Deposit', value: '$100' },
        { label: 'Net profit', value: '+$502.34', tone: 'profit' },
        { label: 'Win rate', value: '94.48%' },
        { label: 'Profit factor', value: '2.95' },
        { label: 'Max drawdown', value: '47.97%', tone: 'loss' },
        { label: 'Total trades', value: '471' },
      ],
    },
  },
  {
    symbol: 'EURUSD',
    kind: 'Forex',
    image: '/EURUSDcurveback.png',
    forward: {
      period: '02/02/26 – 13/02/26',
      stats: [
        { label: 'Win rate', value: '92.85%' },
        { label: 'Total trades', value: '14' },
        { label: 'Win', value: '13', tone: 'profit' },
        { label: 'Loss', value: '1', tone: 'loss' },
      ],
    },
    backtest: {
      period: '15/01/25 – 16/02/26',
      stats: [
        { label: 'Deposit', value: '$100' },
        { label: 'Net profit', value: '+$200.53', tone: 'profit' },
        { label: 'Win rate', value: '86.59%' },
        { label: 'Profit factor', value: '2.71' },
        { label: 'Max drawdown', value: '27.41%', tone: 'loss' },
        { label: 'Total trades', value: '246' },
      ],
    },
  },
]

const toneClass = (tone?: Stat['tone']) =>
  tone === 'profit' ? 'text-emerald-600' : tone === 'loss' ? 'text-rose-600' : 'text-slate-900'

function StatBlock({ title, period, stats }: { title: string; period: string; stats: Stat[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 pb-2 border-b border-slate-200">
        <h4 className="text-[13px] font-medium text-slate-900">{title}</h4>
        <span className="num text-xs text-slate-500">{period}</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-6">
        {stats.map(s => (
          <div key={s.label} className="flex items-baseline justify-between py-2 border-b border-slate-100">
            <dt className="text-[13px] text-slate-500">{s.label}</dt>
            <dd className={`num text-sm font-medium ${toneClass(s.tone)}`}>{s.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function ModelSheet({ model, onPreview }: { model: ModelResult; onPreview: (src: string) => void }) {
  return (
    <article className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col">
      <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-4">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900">{model.symbol}</h3>
          <p className="text-[13px] text-slate-500 mt-0.5">{model.kind} · H1 (1 ชั่วโมง)</p>
        </div>
        <span className="text-xs font-medium text-slate-600 border border-slate-200 rounded px-2 py-0.5">MT5</span>
      </header>

      <button
        type="button"
        onClick={() => onPreview(model.image)}
        className="group mx-5 overflow-hidden rounded-md border border-slate-200 bg-slate-50 relative block cursor-zoom-in"
        aria-label={`ดูกราฟ equity ของ ${model.symbol} แบบขยาย`}
      >
        <img src={model.image} alt={`${model.symbol} equity curve (backtest)`} className="w-full h-52 object-cover" />
        <span className="absolute right-2 bottom-2 text-xs text-slate-700 bg-white/95 border border-slate-200 rounded px-2 py-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
          ดูภาพขยาย
        </span>
      </button>

      <div className="px-5 pt-5 pb-5 space-y-5">
        <StatBlock title="Forward test" period={model.forward.period} stats={model.forward.stats} />
        <StatBlock title="Backtest (1 ปี)" period={model.backtest.period} stats={model.backtest.stats} />
      </div>
    </article>
  )
}

export function ImagePreview({ src, onClose }: { src: string | null; onClose: () => void }) {
  if (!src) return null
  return (
    <div
      className="fixed inset-0 bg-slate-950/85 flex items-center justify-center z-[100] p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <img src={src} alt="Preview" className="max-w-full max-h-[85vh] rounded-md bg-white" />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 h-9 px-3 flex items-center gap-2 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      >
        <CloseOutlined /> ปิด
      </button>
    </div>
  )
}
