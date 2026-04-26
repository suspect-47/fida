import { HeroSection } from './components/HeroSection'
import { HowItWorks } from './sections/HowItWorks'
import { FDADataSection } from './sections/FDADataSection'
import { AIResearch } from './sections/AIResearch'
import { ReportsSection } from './sections/ReportsSection'
import { ContactSection } from './sections/ContactSection'
import { ScanSection } from './components/ScanSection'

function App() {
  return (
    <main style={{ fontFamily: "'Inter', sans-serif" }}>
      <HeroSection />
      <HowItWorks />
      <FDADataSection />
      <AIResearch />
      <ReportsSection />
      <ScanSection />
      <ContactSection />
    </main>
  )
}

export default App
