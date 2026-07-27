import { permanentRedirect } from 'next/navigation'

// Strona „O salonie” została przemianowana na „O mnie”. Stary adres mógł już
// trafić do zakładek albo do wizytówki Google, więc zostaje jako przekierowanie.
export default function ONasRedirect() {
  permanentRedirect('/o-mnie')
}
