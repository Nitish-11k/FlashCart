import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'

/* ── Scroll-reveal hook ─────────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ── Animated counter (runs once when parent is-visible) ─────────────────── */
function useCounters() {
  useEffect(() => {
    const runCounters = () => {
      document.querySelectorAll('.count-up.is-counting').forEach((el) => {
        const target = parseFloat(el.getAttribute('data-target') || '0')
        const suffix = el.getAttribute('data-suffix') || ''
        const decimals = parseInt(el.getAttribute('data-decimals') || '0')
        const duration = 1600
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          const val = (eased * target).toFixed(decimals)
          el.textContent = (target >= 1000 ? Number(val).toLocaleString('en-IN') : val) + suffix
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
        el.classList.remove('is-counting')
      })
    }

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.count-up').forEach((el) => el.classList.add('is-counting'))
            runCounters()
            statsObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    const statsEl = document.querySelector('.stats')
    if (statsEl) statsObserver.observe(statsEl)
    return () => statsObserver.disconnect()
  }, [])
}

type Verdict = 'Inflated' | 'Verified low'

type Deal = {
  id: number
  category: string
  name: string
  seller: string
  price: string
  list: string
  claim: number
  real: number
  trust: number
  verdict: Verdict
  image: string
  position?: string
}

const deals: Deal[] = [
  {
    id: 1,
    category: 'Audio',
    name: 'QuietForm Pro headphones',
    seller: 'SonicCart',
    price: '₹12,499',
    list: '₹26,999',
    claim: 53,
    real: 2,
    trust: 42,
    verdict: 'Inflated',
    image:
      'https://images.unsplash.com/photo-1605170876472-db58e15c430e?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 2,
    category: 'Wearables',
    name: 'Apex S9 smartwatch',
    seller: 'Time & Tech',
    price: '₹8,990',
    list: '₹12,999',
    claim: 31,
    real: 19,
    trust: 91,
    verdict: 'Verified low',
    image:
      'https://images.unsplash.com/photo-1610991138614-0d4d78ac6de8?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 3,
    category: 'Audio',
    name: 'AeroPods Mini',
    seller: 'Gadget Grove',
    price: '₹3,499',
    list: '₹7,999',
    claim: 56,
    real: 4,
    trust: 48,
    verdict: 'Inflated',
    image:
      'https://images.unsplash.com/photo-1620812544987-449d7bd5adfd?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 4,
    category: 'Accessories',
    name: 'Arc Classic automatic',
    seller: 'Modern Hours',
    price: '₹6,790',
    list: '₹9,999',
    claim: 32,
    real: 17,
    trust: 86,
    verdict: 'Verified low',
    image:
      'https://images.unsplash.com/photo-1783792894893-8332ee93d1de?auto=format&fit=crop&w=1000&q=85',
    position: 'center 65%',
  },
  {
    id: 5,
    category: 'Audio',
    name: 'Studio Max wireless',
    seller: 'Everyday Audio',
    price: '₹9,299',
    list: '₹18,499',
    claim: 50,
    real: 3,
    trust: 51,
    verdict: 'Inflated',
    image:
      'https://images.unsplash.com/photo-1761005654142-819960af0658?auto=format&fit=crop&w=1000&q=85',
  },
  {
    id: 6,
    category: 'Audio',
    name: 'Cloud Buds 3',
    seller: 'Circuit House',
    price: '₹5,599',
    list: '₹7,999',
    claim: 30,
    real: 18,
    trust: 89,
    verdict: 'Verified low',
    image:
      'https://images.unsplash.com/photo-1611049970751-5d6acecdf29c?auto=format&fit=crop&w=1000&q=85',
  },
]

const navItems = [
  ['Home', 'home'],
  ['How it works', 'how'],
  ['Live deals', 'deals'],
  ['Trust score', 'trust'],
  ['Reviews', 'reviews'],
  ['FAQ', 'faq'],
]

function Icon({
  name,
  size = 20,
}: {
  name: 'arrow' | 'search' | 'menu' | 'close' | 'sync' | 'check' | 'x' | 'bell'
  size?: number
}) {
  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m14 7 5 5-5 5" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    menu: <><path d="M5 8h14M5 16h14" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    sync: <><path d="M20 7h-5V2" /><path d="M20 7a8 8 0 1 0 1 7" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    x: <><path d="m7 7 10 10M17 7 7 17" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Logo({ compact = false, animated = false }: { compact?: boolean; animated?: boolean }) {
  return (
    <div className="logo" aria-label="FlashCart Pulse">
      <span className={`logo-mark ${animated ? 'logo-animated' : ''}`}>
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path className="cart" d="M7 9h3l2.1 10h10.3l2-7.2H11" />
          <path className="cart" d="M13.2 23.5h.1M21.2 23.5h.1" />
          <path className={`bolt ${animated ? 'bolt-animated' : ''}`} d="m18.5 8-5 7h3l-1 6 5-8h-3z" />
        </svg>
      </span>
      {!compact && <span className="wordmark"><b>FlashCart</b><i>Pulse</i></span>}
    </div>
  )
}

function Button({
  children,
  kind = 'primary',
  onClick,
  type = 'button',
  className = '',
}: {
  children: React.ReactNode
  kind?: 'primary' | 'outline' | 'ghost'
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}) {
  return <button type={type} onClick={onClick} className={`button button-${kind} ${className}`}>{children}</button>
}

function VerdictChip({ verdict }: { verdict: Verdict }) {
  return <span className={`verdict ${verdict === 'Inflated' ? 'bad' : 'good'}`}><span />{verdict}</span>
}

function Gauge({ deal, compact = false }: { deal: Deal; compact?: boolean }) {
  return (
    <div className={`gauge-wrap ${compact ? 'gauge-compact' : ''}`}>
      <svg className="gauge" viewBox="0 0 300 174" aria-label={`Store claims ${deal.claim} percent off, real discount ${deal.real} percent`}>
        <path className="gauge-track" pathLength="100" d="M24 150a126 126 0 0 1 252 0" />
        <path className="gauge-claim" pathLength="100" strokeDasharray={`${deal.claim} 100`} d="M24 150a126 126 0 0 1 252 0" />
        <path className="gauge-track inner" pathLength="100" d="M53 150a97 97 0 0 1 194 0" />
        <path className={`gauge-real ${deal.verdict === 'Inflated' ? 'bad-stroke' : 'good-stroke'}`} pathLength="100" strokeDasharray={`${Math.max(deal.real, 3)} 100`} d="M53 150a97 97 0 0 1 194 0" />
      </svg>
      <div className="gauge-value">
        <span className={deal.verdict === 'Inflated' ? 'bad-text' : 'good-text'}>{deal.real}%</span>
        <small>real discount</small>
      </div>
      <div className="gauge-label left"><b>{deal.claim}%</b><small>store claims</small></div>
      <div className="gauge-label right"><b>30 days</b><small>price history</small></div>
    </div>
  )
}

function SampleCard() {
  const deal = deals[0]
  const [secs, setSecs] = useState(8)
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => s + 1), 3000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="sample-shell">
      <div className="sample-glow" />
      <div className="sample-card" data-reveal style={{ '--reveal-delay': '0.2s' } as React.CSSProperties}>
        <div className="card-topline"><div><span>Live price check</span><h3>{deal.name}</h3></div><VerdictChip verdict={deal.verdict} /></div>
        <Gauge deal={deal} />
        <div className="price-facts">
          <div><span>Listed at</span><b className="strike">₹26,999</b></div>
          <div><span>Sale price</span><b>₹12,499</b></div>
          <div><span>30-day avg</span><b>₹12,749</b></div>
        </div>
        <div className="sample-note"><span className="pulse-dot" />Checked {secs} seconds ago</div>
      </div>
      <div className="floating-tag tag-one" data-reveal style={{ '--reveal-delay': '0.55s' } as React.CSSProperties}>Store says <b>53% off</b></div>
      <div className="floating-tag tag-two" data-reveal style={{ '--reveal-delay': '0.75s' } as React.CSSProperties}>Reality says <b>2%</b></div>
    </div>
  )
}

function DealCard({ deal, onOpen, index = 0 }: { deal: Deal; onOpen: () => void; index?: number }) {
  return (
    <article
      className="deal-card"
      onClick={onOpen}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      data-reveal
      style={{ '--reveal-delay': `${index * 0.07}s` } as React.CSSProperties}
    >
      <div className="product-image">
        <img src={deal.image} alt="" style={{ objectPosition: deal.position }} />
        <span className="category">{deal.category}</span>
        <VerdictChip verdict={deal.verdict} />
        <span className="view-deal"><Icon name="arrow" /></span>
      </div>
      <div className="deal-copy">
        <span className="seller">{deal.seller}</span>
        <h3>{deal.name}</h3>
        <div className="deal-price">
          <div><strong>{deal.price}</strong><p><s>{deal.list}</s> · Store says {deal.claim}% off</p></div>
          <div className={deal.verdict === 'Inflated' ? 'bad-text' : 'good-text'}><strong>{deal.real}%</strong><p>real drop</p></div>
        </div>
        <div className="trust-row">
          <span>Seller trust</span>
          <div className="mini-bar"><i className="trust-fill" style={{ '--trust': `${deal.trust}%` } as React.CSSProperties} /></div>
          <b>{deal.trust}</b>
          <Icon name="arrow" size={16} />
        </div>
      </div>
    </article>
  )
}

function PriceChart({ good }: { good: boolean }) {
  return (
    <div className="chart">
      <div className="chart-head"><span>30-day price</span><span>₹12,749 average</span></div>
      <svg viewBox="0 0 380 120" preserveAspectRatio="none" aria-label="30-day price history chart">
        <path className="avg-line" d="M0 54H380" />
        <path className={`chart-line ${good ? 'good-stroke' : 'bad-stroke'}`} d="M2 35C26 30 36 47 66 45S102 31 130 42s39 26 68 14 43-11 70-4 39 3 56 18 30 14 54 17" />
        <circle className={good ? 'good-fill' : 'bad-fill'} cx="378" cy="87" r="4" />
      </svg>
      <div className="chart-axis"><span>30 days ago</span><span>Today</span></div>
    </div>
  )
}

function DetailSheet({ deal, onClose, onToast }: { deal: Deal; onClose: () => void; onToast: () => void }) {
  const [email, setEmail] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (email) onToast()
  }
  return (
    <div className="sheet-layer" role="dialog" aria-modal="true" aria-label={`${deal.name} deal details`}>
      <button className="sheet-backdrop" onClick={onClose} aria-label="Close detail" />
      <aside className="detail-sheet">
        <div className="drag-handle" />
        <button className="close-button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
        <VerdictChip verdict={deal.verdict} />
        <h2>{deal.name}</h2>
        <div className="seller-line"><span>{deal.seller}</span><span>Trust score <b>{deal.trust}/100</b></span></div>
        <Gauge deal={deal} compact />
        <div className="sheet-facts">
          <div><span>Now</span><b>{deal.price}</b></div>
          <div><span>30-day avg</span><b>{deal.verdict === 'Inflated' ? '₹12,749' : '₹10,899'}</b></div>
          <div><span>Listed at</span><b><s>{deal.list}</s></b></div>
        </div>
        <PriceChart good={deal.verdict === 'Verified low'} />
        <p className="plain-note">{deal.verdict === 'Inflated' ? 'This price is close to what it cost last month. The big discount comes from a higher list price.' : 'This is meaningfully below its usual price. The drop looks genuine based on the last 30 days.'}</p>
        <div className="flag-list">
          <div><span className="icon-good"><Icon name="check" size={15} /></span>30 days of price history available</div>
          <div><span className={deal.verdict === 'Inflated' ? 'icon-bad' : 'icon-good'}><Icon name={deal.verdict === 'Inflated' ? 'x' : 'check'} size={15} /></span>{deal.verdict === 'Inflated' ? 'List price changed before the sale' : 'List price has remained stable'}</div>
        </div>
        <form className="alert-form" onSubmit={submit}>
          <label htmlFor="alert-email"><Icon name="bell" />Get the next real drop</label>
          <div><input id="alert-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" type="email" required /><Button type="submit">Set price alert</Button></div>
        </form>
      </aside>
    </div>
  )
}

function SectionTitle({ children, muted }: { children: React.ReactNode; muted?: string }) {
  return <h2 className="section-title">{children}{muted && <span>{muted}</span>}</h2>
}

export default function App() {
  useScrollReveal()
  useCounters()
  const [filter, setFilter] = useState<'All deals' | Verdict>('All deals')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Deal | null>(null)
  const [toast, setToast] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [latencyMs, setLatencyMs] = useState('0.7')
  useEffect(() => {
    const t = setInterval(() => setLatencyMs((+(0.4 + Math.random() * 0.7)).toFixed(1)), 2800)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrollProgress((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = selected || menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected, menuOpen])

  const visibleDeals = useMemo(() => deals.filter((deal) =>
    (filter === 'All deals' || deal.verdict === filter) &&
    `${deal.name} ${deal.seller}`.toLowerCase().includes(query.toLowerCase()),
  ), [filter, query])

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const sync = () => {
    setSyncing(true)
    window.setTimeout(() => {
      setSyncing(false)
      showToast('Prices updated')
    }, 1200)
  }

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const faqs = [
    ['How do you know the real price?', 'We track each product every day and compare today’s sale price with its average price over the previous 30 days—not the crossed-out number.'],
    ['What counts as a fake discount?', 'If the real discount is under 5%, we mark the offer as Inflated. It usually means the sale price is close to its normal price.'],
    ['How do price alerts work?', 'Choose a product, enter your email, and we’ll let you know when its price crosses into a genuinely good range.'],
    ['How fast are the checks?', 'Most price checks complete in under a second. Our live cards show when each product was last verified.'],
  ]

  return (
    <div className="app">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <header className="nav">
        <div className="nav-inner">
          <button className="logo-button" onClick={() => scrollTo('home')}><Logo animated /></button>
          <nav>{navItems.map(([label, id], i) => <button className={i === 0 ? 'active' : ''} key={id} onClick={() => scrollTo(id)}>{label}</button>)}</nav>
          <div className="nav-actions">
            <span className="live-status"><i />Live · <span className="latency-val">{latencyMs}</span> ms</span>
            <Button onClick={sync} className={syncing ? 'syncing' : ''}><Icon name="sync" size={17} />{syncing ? 'Syncing' : 'Sync prices'}</Button>
            <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
          </div>
        </div>
      </header>

      {menuOpen && <div className="menu-overlay">
        <div className="menu-head"><Logo /><button className="menu-button" onClick={() => setMenuOpen(false)}><Icon name="close" /></button></div>
        <div className="menu-links">{navItems.map(([label, id], i) => <button key={id} style={{ animationDelay: `${i * 55}ms` }} onClick={() => scrollTo(id)}>{label}<Icon name="arrow" /></button>)}</div>
        <Button onClick={() => { setMenuOpen(false); sync() }}><Icon name="sync" />Sync prices</Button>
      </div>}

      <main>
        <section className="hero" id="home">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="status-pill"><span className="pulse-dot" />Tracking India’s biggest sales now</div>
              <h1><span>Know the real price</span><span>before you pay.</span></h1>
              <p>FlashCart Pulse tracks every product’s price for 30 days and tells you if a flash sale is a genuine drop or a marked-up fake.</p>
              <div className="hero-actions">
                <Button onClick={() => scrollTo('deals')}>See live deals <Icon name="arrow" /></Button>
                <Button kind="outline" onClick={() => scrollTo('how')}>How it works</Button>
              </div>
              <div className="stats">
                <div><b>48,200+</b><span>deals checked</span></div>
                <div><b>37%</b><span>inflated discounts</span></div>
                <div><b>14.2%</b><span>average real drop</span></div>
              </div>
            </div>
            <SampleCard />
          </div>
          <div className="scroll-cue"><span>Scroll to investigate</span><i /></div>
        </section>

        <section className="marquee" aria-hidden="true">
          <div><span>Fake discounts</span><b>Real prices</b><span>Marked-up sales</span><em>Real drops</em><span>Fake discounts</span></div>
        </section>

        <section className="how section" id="how">
          <div className="section-grid">
            <div className="sticky-copy"><span className="section-index">01 / How it works</span><SectionTitle muted="for you.">What FlashCart Pulse does</SectionTitle><p>A clear answer, built from 30 days of evidence—not marketing.</p></div>
            <div className="timeline">
              {[
                ['Watches prices every day', 'We build a daily price history across sellers, so every sale has context.'],
                ['Finds the real discount', 'Today’s price is measured against what the product actually cost last month.'],
                ['Scores the seller', 'Seller age, price stability and honest list prices all count.'],
                ['Alerts you at the right time', 'Set your target once. We’ll tell you when the drop is genuinely worth it.'],
              ].map(([title, copy], i) => (
                <div
                  className="timeline-step"
                  key={title}
                  data-reveal
                  style={{ '--reveal-delay': `${i * 0.12}s` } as React.CSSProperties}
                >
                  <span className="step-number">0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                    {i === 1 && <div className="formula">Real discount <b>= 1 − sale price ÷ 30-day average</b></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="deals section" id="deals">
          <div className="section-heading">
            <div><span className="section-index">02 / Live feed</span><SectionTitle muted="checked.">Live deals,</SectionTitle></div>
            <p>Not every big number is a good deal. Here’s what the last 30 days say.</p>
          </div>
          <div className="deal-tools">
            <div className="segments">
              {(['All deals', 'Verified low', 'Inflated'] as const).map((item) => <button className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)} key={item}>{item}<span>{item === 'All deals' ? deals.length : deals.filter(d => d.verdict === item).length}</span></button>)}
            </div>
            <label className="search"><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a product or seller" /></label>
          </div>
          {visibleDeals.length ? <div className="deals-grid">{visibleDeals.map((deal) => <DealCard deal={deal} onOpen={() => setSelected(deal)} key={deal.id} />)}</div> :
            <div className="empty-state"><Icon name="search" size={28} /><h3>Nothing matches “{query}”</h3><p>Try another product or seller.</p><Button kind="outline" onClick={() => setQuery('')}>Clear search</Button></div>}
          <div className="mobile-actions"><Button kind="outline">Filter</Button><Button><Icon name="search" />Search</Button></div>
        </section>

        <section className="trust section" id="trust">
          <div className="trust-grid">
            <div className="trust-copy">
              <span className="section-index">03 / Seller signal</span>
              <SectionTitle muted="every seller.">A trust score for</SectionTitle>
              <p>We score patterns, not promises. A high score means a seller’s prices have been stable, traceable and honest.</p>
              <div className="rules">
                <div><span>Real discount under 5%</span><VerdictChip verdict="Inflated" /></div>
                <div><span>Real discount over 15%</span><VerdictChip verdict="Verified low" /></div>
              </div>
            </div>
            <div className="score-card" data-reveal>
              <div className="score-top"><div><span>Seller trust</span><b>82</b><small>/ 100</small></div><span className="score-grade">Strong</span></div>
              {[
                ['Seller age', '30%', 'A longer, traceable selling history', 78],
                ['Price stability', '40%', 'Fewer suspicious jumps before sales', 91],
                ['Honest list price', '30%', 'List price matches its usual range', 72],
              ].map(([label, weight, copy, width], si) => (
                <div className="score-row" key={label as string} data-reveal style={{ '--reveal-delay': `${si * 0.14}s` } as React.CSSProperties}>
                  <div><b>{label}</b><span>{weight}</span></div>
                  <p>{copy}</p>
                  <div className="score-bar"><i className="score-fill" style={{ '--bar-width': `${width}%` } as React.CSSProperties} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="reviews section" id="reviews">
          <div className="section-heading">
            <div><span className="section-index">04 / Sample content</span><SectionTitle muted="say.">What shoppers</SectionTitle></div>
            <div className="rating"><b>4.8</b><span><i>★★★★★</i><small>from X sample reviews</small></span><Button kind="outline">Write a review</Button></div>
          </div>
          <p className="sample-disclaimer">Sample review content for layout preview. Replace with verified customer reviews before launch.</p>
          <div className="review-grid">
            <article className="review-card featured" data-reveal style={{ '--reveal-delay': '0s' } as React.CSSProperties}><span className="verified"><Icon name="check" size={12} />Verified user · sample</span><blockquote>“I saw 60% off. FlashCart Pulse showed the real drop was only 2%—so I waited.”</blockquote><div className="review-person"><span>A</span><div><b>Aarav</b><small>Pune · Smartwatch</small></div></div><p className="result">Saved ₹3,000 by skipping an inflated deal</p></article>
            <article className="review-card" data-reveal style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}><span className="verified"><Icon name="check" size={12} />Verified user · sample</span><blockquote>“The seller trust score made me skip a store that had only been online for two weeks.”</blockquote><div className="review-person"><span>M</span><div><b>Meera</b><small>Jaipur · Headphones</small></div></div><p className="result">Avoided a low-trust seller</p></article>
            <article className="review-card" data-reveal style={{ '--reveal-delay': '0.2s' } as React.CSSProperties}><span className="verified"><Icon name="check" size={12} />Verified user · sample</span><blockquote>“I set an alert and got the email when the price actually dropped.”</blockquote><div className="review-person"><span>R</span><div><b>Rohan</b><small>Bengaluru · Earbuds</small></div></div><p className="result">Bought at a verified low</p></article>
          </div>
        </section>

        <section className="faq section" id="faq">
          <div className="faq-grid">
            <div><span className="section-index">05 / FAQ</span><SectionTitle muted="straight answers.">Fair questions,</SectionTitle><p>No tricks here either. Everything you need to know about our checks.</p></div>
            <div className="accordion">{faqs.map(([q, a], i) => <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={q}><button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}><span>{q}</span><i><Icon name={openFaq === i ? 'close' : 'x'} size={18} /></i></button><div className="faq-answer"><p>{a}</p></div></div>)}</div>
          </div>
        </section>

        <section className="closing">
          <div className="closing-inner"><span>Buy with proof, not pressure.</span><h2>Stop paying for discounts<br />that were never real.</h2><Button onClick={() => scrollTo('deals')}>Browse live deals <Icon name="arrow" /></Button></div>
        </section>
      </main>

      <footer>
        <div className="footer-top"><div><Logo /><p>Price history and seller signals for smarter sale shopping.</p></div><div className="footer-links">{navItems.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}</div></div>
        <div className="footer-bottom"><span>© 2026 FlashCart Pulse</span><span>Built for clear decisions.</span></div>
      </footer>

      {selected && <DetailSheet deal={selected} onClose={() => setSelected(null)} onToast={() => showToast('Price alert set')} />}
      {toast && <div className="toast"><Icon name="check" size={17} />{toast}</div>}
    </div>
  )
}
