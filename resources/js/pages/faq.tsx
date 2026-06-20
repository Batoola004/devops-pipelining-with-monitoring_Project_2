import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQs = [
  { q: 'How do I track my order?', a: 'Once your order ships, you will receive a confirmation email with a tracking number. You can also track your order from the Orders page in your account.' },
  { q: 'What is your return policy?', a: 'We offer a 30-day return policy on most items. Products must be in original condition with all accessories and packaging. Visit our Returns page for full details.' },
  { q: 'How long does shipping take?', a: 'Standard shipping takes 3–7 business days within the continental US. Expedited options are available at checkout. International shipping takes 7–14 business days.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship to over 40 countries worldwide. Shipping costs and delivery times vary by destination. Duties and taxes may apply.' },
  { q: 'Can I cancel my order?', a: 'Orders can be canceled within 1 hour of placement. After that, the order enters processing and cannot be modified. Contact support immediately for assistance.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, PayPal, Apple Pay, and Shop Pay. All transactions are encrypted and secure.' },
  { q: 'How do I contact customer support?', a: 'You can reach us via email at support@fiberroad.com or by phone at 1-800-FIBER. Our support team is available Monday–Friday, 9 AM – 6 PM EST.' },
  { q: 'Do you offer warranty on products?', a: 'All products come with a manufacturer warranty, typically 1–2 years. Extended warranty options are available at checkout for select items.' },
]

function AccordionItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left text-sm font-medium text-foreground transition-colors hover:text-primary"
      >
        {q}
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-5 text-sm leading-relaxed text-muted-foreground">{a}</div>
      )}
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Head title="FAQ — FiberRoad" />
      <h1 className="mb-2 text-center text-4xl font-semibold text-foreground">Frequently Asked Questions</h1>
      <p className="mb-12 text-center text-muted-foreground">Everything you need to know about shopping at FiberRoad.</p>
      <div className="divide-y divide-border rounded-xl border border-border bg-card px-6">
        {FAQs.map((faq, i) => (
          <AccordionItem
            key={i}
            q={faq.q}
            a={faq.a}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </div>
  )
}
