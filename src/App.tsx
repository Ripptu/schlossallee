import React, { useState, useEffect } from 'react';
import { Calendar, Map, ArrowRight, Instagram, Twitter, Youtube, Globe, ArrowUpRight, MapPin, Phone, Mail, Facebook, Sun, CloudRain, ChevronDown, Check, X, Clock } from 'lucide-react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, getDocFromServer } from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: null,
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

export default function App() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeTab, setActiveTab] = useState('uebersicht');
  
  // New State Variables
  const [scrollY, setScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Secret Status Toggle
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  
  // Weather State
  const [weatherTemp, setWeatherTemp] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number>(0);
  
  // Auto-Close State
  const [isWithinOpeningHours, setIsWithinOpeningHours] = useState(false);

  useEffect(() => {
    const checkIsOpenHours = () => {
      const now = new Date();
      const berlinTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
      
      const month = berlinTime.getMonth() + 1;
      const date = berlinTime.getDate();
      const day = berlinTime.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      const hour = berlinTime.getHours();
      
      // Season: 01.05 to 03.10
      const isSeason = (month > 5 && month < 10) || 
                       (month === 5 && date >= 1) || 
                       (month === 10 && date <= 3);
                       
      if (!isSeason) return false;
      
      // Monday: Ruhetag
      if (day === 1) return false;
      
      // Tue - Fri: 15:00 - 23:00
      if (day >= 2 && day <= 5) {
        return hour >= 15 && hour < 23;
      }
      
      // Sat - Sun: 11:00 - 23:00
      if (day === 0 || day === 6) {
        return hour >= 11 && hour < 23;
      }
      
      return false;
    };

    setIsWithinOpeningHours(checkIsOpenHours());
    
    const interval = setInterval(() => {
      setIsWithinOpeningHours(checkIsOpenHours());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Test connection
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'settings', 'status'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();

    // Listen to global status
    const unsub = onSnapshot(doc(db, 'settings', 'status'), (docSnap) => {
      if (docSnap.exists()) {
        setIsOpen(docSnap.data().isOpen);
      } else {
        // Initialize if it doesn't exist
        setDoc(doc(db, 'settings', 'status'), { isOpen: true }).catch(err => handleFirestoreError(err, OperationType.WRITE, 'settings/status'));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings/status');
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    // Fetch real weather for Haag an der Amper
    fetch('https://api.open-meteo.com/v1/forecast?latitude=48.458&longitude=11.828&current_weather=true')
      .then(res => res.json())
      .then(data => {
        if (data && data.current_weather) {
          setWeatherTemp(Math.round(data.current_weather.temperature));
          setWeatherCode(data.current_weather.weathercode);
        }
      })
      .catch(err => console.error("Weather fetch error:", err));
  }, []);

  useEffect(() => {
    // Check local storage for cookie consent
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setShowCookieBanner(false);
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Sticky Nav Logic: Show when scrolling up or at the very top
      if (currentScrollY < 50) {
        setIsNavVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsNavVisible(false); // Scrolling down
      } else {
        setIsNavVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogoClick = () => {
    setLogoClickCount(prev => prev + 1);
  };

  useEffect(() => {
    if (logoClickCount >= 5) {
      setShowPasswordModal(true);
      setLogoClickCount(0);
    }
    
    // Reset click count after 3 seconds of inactivity
    if (logoClickCount > 0 && logoClickCount < 5) {
      const timer = setTimeout(() => setLogoClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [logoClickCount]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'vamela') {
      try {
        await setDoc(doc(db, 'settings', 'status'), { isOpen: !isOpen });
        setShowPasswordModal(false);
        setPasswordInput('');
        setPasswordError(false);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'settings/status');
        alert('Fehler beim Ändern des Status.');
      }
    } else {
      setPasswordError(true);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordInput('');
    setPasswordError(false);
  };

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowCookieBanner(false);
  };

  const faqs = [
    {
      question: "Darf ich meine eigene Brotzeit mitbringen?",
      answer: "Ja, absolut! Wie es sich für einen echten bayrischen Traditions-Biergarten gehört, dürft ihr eure eigene Brotzeit gerne mitbringen. Die Getränke kauft ihr einfach bei uns an der Schänke."
    },
    {
      question: "Gibt es ausreichend Parkplätze?",
      answer: "Wir haben einen großen, kostenlosen Parkplatz direkt am Biergarten. Auch für Fahrräder gibt es jede Menge Stellplätze im Schatten."
    },
    {
      question: "Ist Kartenzahlung möglich?",
      answer: "Ja, ihr könnt bei uns an allen Kassen bequem mit EC-Karte, Kreditkarte oder Apple/Google Pay bezahlen. Bargeld nehmen wir natürlich auch gerne."
    },
    {
      question: "Sind Hunde im Biergarten erlaubt?",
      answer: "Hunde sind bei uns herzlich willkommen! Bitte führt eure Vierbeiner an der Leine und nehmt Rücksicht auf andere Gäste. Wassernäpfe stehen an der Schänke bereit."
    }
  ];

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

  const effectivelyOpen = isOpen && isWithinOpeningHours;

  return (
    <div className="font-sans text-forest antialiased bg-offwhite selection:bg-gold selection:text-forest">
      {/* Sticky Navigation */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <header className={`flex justify-between items-center px-6 md:px-16 py-4 w-full transition-all duration-300 ${scrollY > 50 ? 'bg-[#15241A]/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
          <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
            <img src="https://s1.directupload.eu/images/260402/om4bp4q3.webp" alt="Schlossallee Biergarten Haag an der Amper Logo" className="h-8 md:h-10 object-contain object-left" width="200" height="48" fetchPriority="high" decoding="async" />
          </div>
          <nav className="hidden lg:flex items-center gap-10 text-white/90 text-sm font-medium tracking-wide" aria-label="Hauptnavigation">
            <a href="#home" className="hover:text-gold transition-colors">Startseite</a>
            <a href="#events" className="hover:text-gold transition-colors">Events</a>
            <a href="#about" className="hover:text-gold transition-colors">Über uns</a>
            <a href="#faq" className="hover:text-gold transition-colors">FAQ</a>
          </nav>
          <div>
            <a href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCTQwMzZqMGoxNagCCLACAQ&um=1&ie=UTF-8&fb=1&gl=de&sa=X&geocode=KYGRAhuxP55HMemnYLXbt-yr&daddr=Freisinger+Str.+1,+85410+Haag+an+der+Amper" target="_blank" rel="noopener noreferrer" className="bg-gold/90 hover:bg-gold text-forest px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-md" aria-label="Route zum Biergarten auf Google Maps öffnen">
              Anfahrt
            </a>
          </div>
        </header>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[100svh] w-full flex flex-col overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('https://s1.directupload.eu/images/260402/rwfl2ewv.webp')"
          }}
        >
          {/* Gradient Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80"></div>
        </div>

        {/* Main Hero Content */}
        <main className="relative z-10 flex-grow flex flex-col justify-center px-6 md:px-16 pt-24 pb-8 md:pt-32 md:pb-32">
          <div className="max-w-7xl mx-auto w-full">
            {/* Weather / Status Badge */}
            <div className={`inline-flex items-center gap-2 backdrop-blur-md border px-4 py-2 rounded-full text-sm mb-6 md:mb-8 shadow-lg transition-colors ${effectivelyOpen ? 'bg-green-900/40 border-green-400/30 text-green-50' : 'bg-red-900/40 border-red-400/30 text-red-50'}`}>
              {effectivelyOpen ? (
                <>
                  {weatherCode <= 3 ? <Sun size={18} className="text-yellow-400" /> : <CloudRain size={18} className="text-blue-300" />}
                  <span className="font-medium tracking-wide">
                    {weatherTemp !== null ? `${weatherTemp}°C` : '...'} – Heute bei schönem Wetter geöffnet!
                  </span>
                </>
              ) : (
                <>
                  {weatherCode > 3 ? <CloudRain size={18} className="text-blue-300" /> : <Clock size={18} className="text-red-300" />}
                  <span className="font-medium tracking-wide">
                    {!isWithinOpeningHours ? 'Aktuell außerhalb der Öffnungszeiten geschlossen.' : 'Heute leider witterungsbedingt geschlossen.'}
                  </span>
                </>
              )}
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
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Besuche uns auf Instagram"><Instagram size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Besuche uns auf Twitter"><Twitter size={20} /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors" aria-label="Besuche uns auf YouTube"><Youtube size={20} /></a>
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
                <div className="group border-b border-gray-100 pb-8 last:border-0 last:pb-0 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-2 uppercase tracking-wider">15. August 2026</p>
                      <h3 className="text-2xl md:text-3xl font-medium text-forest group-hover:text-gold transition-colors flex items-center gap-3">
                        Unser Lampion-Fest
                        <ArrowRight size={24} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gold" />
                      </h3>
                    </div>
                    <a href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-forest hover:text-gold transition-colors whitespace-nowrap">
                      Zum Kalender <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="group border-b border-gray-100 pb-8 last:border-0 last:pb-0 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-2 uppercase tracking-wider">22. Mai 2026</p>
                      <h3 className="text-2xl md:text-3xl font-medium text-forest group-hover:text-gold transition-colors flex items-center gap-3">
                        Live-Musik: Austro-Pop
                        <ArrowRight size={24} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gold" />
                      </h3>
                    </div>
                    <a href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-forest hover:text-gold transition-colors whitespace-nowrap">
                      Zum Kalender <ArrowUpRight size={16} />
                    </a>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="group border-b border-gray-100 pb-8 last:border-0 last:pb-0 cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-2 uppercase tracking-wider">05. Juni 2026</p>
                      <h3 className="text-2xl md:text-3xl font-medium text-forest group-hover:text-gold transition-colors flex items-center gap-3">
                        Oldtimer-Motorradtreffen
                        <ArrowRight size={24} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-gold" />
                      </h3>
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

      {/* Transition Image with Parallax */}
      <div className="w-full h-64 md:h-[400px] relative overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-[130%] -top-[15%]"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        >
          <img 
            src="https://s1.directupload.eu/images/260402/rwfl2ewv.webp" 
            alt="Atmosphärisches Bild des Biergartens Schlossallee in Haag an der Amper" 
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest/50 to-forest"></div>
      </div>

      {/* Dark Mode Section */}
      <section id="about" className="bg-forest text-white py-24 px-6 md:px-16 relative overflow-hidden">
        <h2 className="sr-only">Unsere Philosophie und Angebote</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          
          {/* Left: Vertical Menu */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <nav className="flex flex-col w-full" aria-label="Kategorien">
              {categories.map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => {
                    setActiveCategory(idx);
                    setActiveTab('uebersicht');
                  }}
                  className={`group cursor-pointer py-4 md:py-6 border-b border-white/10 last:border-0 flex items-baseline gap-4 md:gap-6 transition-all text-left w-full ${activeCategory === idx ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                  aria-expanded={activeCategory === idx}
                >
                  <span className={`text-sm font-medium transition-colors ${activeCategory === idx ? 'text-gold' : 'text-white/50 group-hover:text-gold'}`}>{item.num}.</span>
                  <span className={`text-3xl sm:text-4xl md:text-5xl font-bold transition-colors tracking-tight ${activeCategory === idx ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>{item.title}</span>
                </button>
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
                        <img src={img} alt={`Impressionen aus dem Biergarten Schlossallee - Bild ${i+1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" />
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
                      alt="Schlossallee Biergarten Haag an der Amper Logo" 
                      className="w-full h-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 md:px-16 max-w-4xl mx-auto bg-offwhite">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-forest font-bold mb-4">Gut zu wissen</h2>
          <p className="text-forest/70">Die wichtigsten Fragen rund um euren Besuch bei uns.</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button 
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                aria-expanded={openFaqIndex === index}
              >
                <span className="text-lg font-medium text-forest pr-4">{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-gold shrink-0 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} 
                />
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-forest/70 leading-relaxed border-t border-gray-50">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#15241A] text-white/70 py-16 px-6 md:px-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <img src="https://s1.directupload.eu/images/260402/om4bp4q3.webp" alt="Schlossallee Biergarten Haag an der Amper Logo" className="h-12 object-contain mb-6" loading="lazy" decoding="async" />
            <p className="text-sm leading-relaxed mb-6">
              Der schönste Biergarten in Haag an der Amper. Tradition, Natur und echte bayrische Gemütlichkeit.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-forest transition-colors" aria-label="Besuche uns auf Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gold hover:text-forest transition-colors" aria-label="Besuche uns auf Facebook">
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

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#15241A] border border-gold/30 rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-md relative">
            <button 
              onClick={closePasswordModal}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-medium text-white mb-2">Status ändern</h3>
            <p className="text-white/70 text-sm mb-6">Bitte gib das Passwort ein, um den Öffnungs-Status zu ändern.</p>
            
            <form onSubmit={handlePasswordSubmit}>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="Passwort"
                className={`w-full bg-white/5 border ${passwordError ? 'border-red-500' : 'border-white/20'} rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors mb-4`}
                autoFocus
              />
              {passwordError && <p className="text-red-400 text-sm mb-4">Falsches Passwort.</p>}
              <button 
                type="submit"
                className="w-full bg-gold hover:bg-gold/90 text-forest font-medium py-3 rounded-lg transition-colors"
              >
                Bestätigen
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-fade-in">
          <div className="max-w-4xl mx-auto bg-[#15241A] border border-gold/30 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white/80 text-sm leading-relaxed">
              <p className="font-medium text-white mb-1">Wir verwenden Cookies 🍪</p>
              <p>
                Um unsere Webseite für dich optimal zu gestalten und fortlaufend verbessern zu können, verwenden wir Cookies. 
                Weitere Informationen erhältst du in unserer <a href="#" className="text-gold hover:underline">Datenschutzerklärung</a>.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button 
                onClick={acceptCookies}
                className="flex-1 md:flex-none bg-gold hover:bg-gold/90 text-forest px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Check size={16} />
                Akzeptieren
              </button>
              <button 
                onClick={() => setShowCookieBanner(false)}
                className="p-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Cookie Banner schließen"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
