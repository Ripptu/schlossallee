import React, { useState } from 'react';
import { Calendar, Map, ArrowRight, Instagram, Twitter, Youtube, Globe, ArrowUpRight, MapPin, Phone, Mail, Facebook } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeTab, setActiveTab] = useState('uebersicht');

  const categories = [
    {
      num: '01',
      title: 'DAS BIER',
      headline: 'Ein kühles Jägerbier im Schatten der Kastanien – gibt\'s was Schöneres?',
      text: 'Unser süffiges Jägerbier kommt direkt vom Hofbrauhaus Freising. Egal ob nach einer Radltour oder einfach zum Feierabend: Lass es dir schmecken. Prost!'
    },
    {
      num: '02',
      title: 'SCHMANKERL',
      headline: 'Echte bayrische Wirtshaustradition.',
      text: 'Ob eine deftige Brotzeit, eine resche Brezn oder ein ofenfrischer Schweinsbraten – bei uns kommt nur das Beste auf den Tisch. Wir kochen mit Herz und regionalen Zutaten.'
    },
    {
      num: '03',
      title: 'DIE AMPER',
      headline: 'Natur pur direkt am Wasser.',
      text: 'Unser Biergarten liegt direkt an den idyllischen Ufern der Amper. Lausche dem Rauschen des Wassers, atme tief durch und genieß die kleine Auszeit vom Alltag.'
    },
    {
      num: '04',
      title: 'SPIELPLATZ',
      headline: 'Ein Paradies für unsere kleinen Gäste.',
      text: 'Familien sind bei uns herzlich willkommen! Auf unserem sicheren Abenteuerspielplatz können sich die Kids richtig austoben, während die Eltern ganz entspannt ihr Bierchen genießen.'
    }
  ];

  const galleryImages = [
    "https://images.unsplash.com/photo-1538481199005-df14d020e806?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1615486171448-4af6f1d2a138?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1505075937387-0cb8222ad009?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1563514995963-7bf15664943f?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1575037614876-c3852d23f391?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=500",
    "https://images.unsplash.com/photo-1590005354167-6da97ce231ce?auto=format&fit=crop&q=80&w=500"
  ];

  return (
    <div className="font-sans text-forest antialiased bg-offwhite selection:bg-gold selection:text-forest">
      {/* Hero Section */}
      <section id="home" className="relative min-h-[100svh] w-full flex flex-col overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://s1.directupload.eu/images/260402/rwfl2ewv.webp')" }}
        >
          {/* Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center px-6 md:px-16 py-6 w-full">
          <div className="flex items-center">
            <img src="https://s1.directupload.eu/images/260402/om4bp4q3.webp" alt="Schlossallee Logo" className="h-10 md:h-12 object-contain" />
          </div>
          <nav className="hidden lg:flex items-center gap-10 text-white/90 text-sm font-medium tracking-wide">
            <a href="#home" className="hover:text-gold transition-colors">Startseite</a>
            <a href="#events" className="hover:text-gold transition-colors">Events</a>
            <a href="#about" className="hover:text-gold transition-colors">Über uns</a>
          </nav>
          <div>
            <a href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCTQwMzZqMGoxNagCCLACAQ&um=1&ie=UTF-8&fb=1&gl=de&sa=X&geocode=KYGRAhuxP55HMemnYLXbt-yr&daddr=Freisinger+Str.+1,+85410+Haag+an+der+Amper" target="_blank" rel="noopener noreferrer" className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border border-white/10">
              Anfahrt
            </a>
          </div>
        </header>

        {/* Main Hero Content */}
        <main className="relative z-10 flex-grow flex flex-col justify-center px-6 md:px-16 pt-4 pb-8 md:pt-10 md:pb-32">
          <div className="max-w-7xl mx-auto w-full">
            {/* Date Badge */}
            <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 text-white/90 px-4 py-2 rounded-md text-sm mb-6 md:mb-8">
              <Calendar size={16} className="text-gold" />
              <span className="font-medium tracking-wide">Endlich wieder da: 01. Mai - 03. Oktober</span>
            </div>

            {/* Headline Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
              <h1 className="text-white text-5xl sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem] leading-[1.05] tracking-tight whitespace-nowrap">
                <span className="font-bold block">Schlossallee</span>
                <span className="font-light block text-3xl sm:text-4xl md:text-[4rem] lg:text-[5rem] mt-2 whitespace-normal">Haag an der Amper</span>
              </h1>
            </div>
          </div>
        </main>

        {/* Bottom Footer Area of Hero */}
        <div className="relative z-10 px-6 md:px-16 pb-8 md:pb-12 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8 mt-auto">
          <div className="max-w-xs text-white/90 text-sm leading-relaxed border-l-2 border-gold pl-4">
            Schön, dass du da bist! Willkommen an unserem Lieblingsplatz. Freu dich auf ein kühles Bier, eine gscheite Brotzeit und ganz viel Natur.
          </div>
          
          <div className="max-w-sm text-white/80 text-sm leading-relaxed hidden md:block">
            Wir lieben, was wir tun: Regionale Schmankerl, echte bayrische Herzlichkeit und ein tiefer Respekt für unsere wunderschönen Amper-Auen.
          </div>

          <div className="flex md:flex-col gap-5 text-white/80">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors"><Instagram size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors"><Twitter size={20} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors"><Youtube size={20} /></a>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-24 px-6 md:px-16 max-w-7xl mx-auto bg-offwhite">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Title */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <h2 className="text-4xl sm:text-5xl md:text-7xl text-forest leading-tight mb-8">
              <span className="font-light block">Was bei uns</span>
              <span className="font-bold block">ansteht</span>
            </h2>
          </div>

          {/* Right: Event Card */}
          <div className="lg:col-span-7">
            <div className="bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] rounded-2xl p-8 md:p-12 border border-gray-100">
              <div className="space-y-8">
                {/* Event 1 */}
                <div className="group border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-2 uppercase tracking-wider">15. August 2026</p>
                      <h3 className="text-2xl md:text-3xl font-medium text-forest group-hover:text-gold transition-colors">Unser Lampion-Fest</h3>
                    </div>
                    <a href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-forest hover:text-gold transition-colors whitespace-nowrap">
                      Zum Kalender <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="group border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-2 uppercase tracking-wider">22. Mai 2026</p>
                      <h3 className="text-2xl md:text-3xl font-medium text-forest group-hover:text-gold transition-colors">Live-Musik: Austro-Pop</h3>
                    </div>
                    <a href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-forest hover:text-gold transition-colors whitespace-nowrap">
                      Zum Kalender <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="group border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-2 uppercase tracking-wider">05. Juni 2026</p>
                      <h3 className="text-2xl md:text-3xl font-medium text-forest group-hover:text-gold transition-colors">Oldtimer-Motorradtreffen</h3>
                    </div>
                    <a href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-forest hover:text-gold transition-colors whitespace-nowrap">
                      Zum Kalender <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>
                
                {/* Info Note */}
                <div className="pt-4 flex items-start gap-4">
                  <div className="bg-gray-50 p-3 rounded-full shrink-0">
                    <Globe size={20} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Wir gfrein uns riesig auf euch! Ein kleiner Tipp: Schaut bei größeren Festen kurz auf unsere Parkhinweise, damit ihr stressfrei ankommt.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transition Image */}
      <div className="w-full h-64 md:h-[400px] relative">
        <img 
          src="https://s1.directupload.eu/images/260402/rwfl2ewv.webp" 
          alt="Bavarian Mountains" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest/50 to-forest"></div>
      </div>

      {/* Dark Mode Section */}
      <section id="about" className="bg-forest text-white py-24 px-6 md:px-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          
          {/* Left: Vertical Menu */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <nav className="flex flex-col w-full">
              {categories.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setActiveCategory(idx);
                    setActiveTab('uebersicht');
                  }}
                  className={`group cursor-pointer py-4 md:py-6 border-b border-white/10 last:border-0 flex items-baseline gap-4 md:gap-6 transition-all ${activeCategory === idx ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                >
                  <span className={`text-sm font-medium transition-colors ${activeCategory === idx ? 'text-gold' : 'text-white/50 group-hover:text-gold'}`}>{item.num}.</span>
                  <span className={`text-3xl sm:text-4xl md:text-5xl font-bold transition-colors tracking-tight ${activeCategory === idx ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>{item.title}</span>
                </div>
              ))}
            </nav>
          </div>

          {/* Right: Glassmorphism Card */}
          <div className="lg:col-span-7 mt-8 lg:mt-0">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
              {/* Subtle gradient glow inside card */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
              
              {/* Tabs */}
              <div className="flex flex-wrap gap-6 sm:gap-8 text-sm font-medium text-white/50 mb-8 sm:mb-12 border-b border-white/10 pb-4">
                <button onClick={() => setActiveTab('uebersicht')} className={`transition-colors relative ${activeTab === 'uebersicht' ? 'text-white after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-0.5 after:bg-gold' : 'hover:text-white'}`}>Übersicht</button>
                <button onClick={() => setActiveTab('galerie')} className={`transition-colors relative ${activeTab === 'galerie' ? 'text-white after:absolute after:bottom-[-17px] after:left-0 after:w-full after:h-0.5 after:bg-gold' : 'hover:text-white'}`}>Galerie</button>
              </div>

              {/* Content */}
              <div className="min-h-[220px]">
                {activeTab === 'uebersicht' && (
                  <div className="animate-fade-in">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4 sm:mb-6 leading-snug text-white">
                      {categories[activeCategory].headline}
                    </h3>
                    <p className="text-white/80 leading-relaxed mb-8 sm:mb-12 max-w-xl text-base sm:text-lg font-light">
                      {categories[activeCategory].text}
                    </p>
                  </div>
                )}
                
                {activeTab === 'galerie' && (
                  <div className="animate-fade-in grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="aspect-square rounded-lg overflow-hidden bg-white/5">
                        <img src={img} alt={`Galerie Bild ${i+1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-4">
                <a href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCTQwMzZqMGoxNagCCLACAQ&um=1&ie=UTF-8&fb=1&gl=de&sa=X&geocode=KYGRAhuxP55HMemnYLXbt-yr&daddr=Freisinger+Str.+1,+85410+Haag+an+der+Amper" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center bg-gold hover:bg-gold/90 text-forest px-8 py-3.5 rounded-md font-medium transition-colors">
                  Zur Karte
                </a>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">Haag an der Amper</p>
                    <p className="text-xs text-white/50">Bayern</p>
                  </div>
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shrink-0 bg-forest/50 flex items-center justify-center p-2">
                    <img 
                      src="https://s1.directupload.eu/images/260402/om4bp4q3.webp" 
                      alt="Schlossallee Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#15241A] text-white/70 py-16 px-6 md:px-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <img src="https://s1.directupload.eu/images/260402/om4bp4q3.webp" alt="Schlossallee Logo" className="h-12 object-contain mb-6" />
            <p className="text-sm leading-relaxed mb-6">
              Der schönste Biergarten in Haag an der Amper. Tradition, Natur und echte bayrische Gemütlichkeit.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-forest transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-forest transition-colors">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Kontakt */}
          <div>
            <h4 className="text-white font-medium mb-6 text-lg">Kontakt</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold shrink-0 mt-0.5" />
                <span>Freisinger Str. 1<br />85410 Haag an der Amper</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-gold shrink-0" />
                <span>+49 (0) 8167 123456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold shrink-0" />
                <span>servus@schlossallee.de</span>
              </li>
            </ul>
          </div>

          {/* Öffnungszeiten */}
          <div>
            <h4 className="text-white font-medium mb-6 text-lg">Öffnungszeiten</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Montag</span>
                <span>Ruhetag</span>
              </li>
              <li className="flex justify-between">
                <span>Di - Fr</span>
                <span>15:00 - 23:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sa - So</span>
                <span>11:00 - 23:00</span>
              </li>
              <li className="pt-4 text-xs text-white/50 border-t border-white/10 mt-4">
                Saison: 01. Mai bis 03. Oktober<br />(Bei schönem Wetter)
              </li>
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="text-white font-medium mb-6 text-lg">Rechtliches</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-gold transition-colors">Impressum</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">Datenschutz</a></li>
              <li><a href="#" className="hover:text-gold transition-colors">AGB</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-xs text-white/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Schlossallee Biergarten. Alle Rechte vorbehalten.</p>
          <p>Gestaltet mit ❤️ in Bayern</p>
        </div>
      </footer>
    </div>
  );
}
