export async function trackClient(name: string, properties?: Record<string, unknown>) {
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, properties }),
    })
  } catch {
    // never block UI on analytics failure
  }
}
