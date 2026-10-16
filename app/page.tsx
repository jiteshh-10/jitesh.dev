import { Navbar } from '@/components/layout/Navbar'
import { TechnicalHero } from '@/components/hero/TechnicalHero'
import { EditorialSections } from '@/components/sections/EditorialSections'

export default function Page() {
  return <main id="top"><Navbar /><TechnicalHero /><EditorialSections /></main>
}
