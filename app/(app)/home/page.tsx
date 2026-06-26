import { HomeContent } from './home-content'

// Mantra récupéré côté serveur → présent dans le HTML dès la 1ʳᵉ frame (zéro décalage).
// Cache court : tourne toutes les 30s sans ajouter de latence au SSR.
async function getMantra(): Promise<string> {
  try {
    const res = await fetch('https://admin.atline.ai/api/public/mantras/random', {
      next: { revalidate: 30 },
    })
    const data = await res.json()
    return data.text ?? ''
  } catch {
    return ''
  }
}

export default async function HomePage() {
  const mantra = await getMantra()
  return <HomeContent mantra={mantra} />
}
