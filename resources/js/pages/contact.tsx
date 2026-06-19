import { useState } from 'react'
import { Head } from '@inertiajs/react'
import { toast } from 'sonner'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Message sent! We will get back to you soon.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Head title="Contact Us — FiberRoad" />
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-semibold text-foreground">Contact Us</h1>
          <p className="text-lg text-muted-foreground">Have a question? We'd love to hear from you.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Subject</label>
            <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <Button type="submit" className="w-full">Send Message</Button>
        </form>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="font-semibold text-foreground">Email</p>
            <p className="text-sm text-muted-foreground">support@fiberroad.com</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Phone</p>
            <p className="text-sm text-muted-foreground">1-800-FIBER</p>
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">Hours</p>
            <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
          </div>
        </div>
      </div>
    </div>
  )
}
