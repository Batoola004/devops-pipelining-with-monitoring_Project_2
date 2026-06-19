import { createInertiaApp } from '@inertiajs/react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './app.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import AppLayout from './components/layout/app-layout'
import ErrorBoundary from './components/shared/error-boundary'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createInertiaApp({
  resolve: async (name) => {
    const pages = import.meta.glob('./pages/**/*.tsx')
    const page = await pages[`./pages/${name}.tsx`]()
    page.default.layout = page.default.layout || ((page) => <AppLayout children={page} />)
    return page
  },
  setup({ el, App, props }) {
    const root = (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <App {...props} />
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </ErrorBoundary>
    )

    if (import.meta.env.DEV) {
      createRoot(el).render(root)
      return
    }
    hydrateRoot(el, root)
  },
})
