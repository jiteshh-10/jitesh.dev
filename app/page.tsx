import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/hero/Hero'
import { EcoDropScene } from '@/components/projects/EcoDropScene'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { FutureSections } from '@/components/sections/FutureSections'

export default function Page() { return <main id="top"><Navbar /><Hero /><EcoDropScene /><ProjectGallery /><FutureSections /></main> }
