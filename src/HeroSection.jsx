import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Code2, Rocket, Users, Zap } from 'lucide-react';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/90 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">
            <span className="text-white">X</span>
            <span className="text-gray-400">method</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('services')} className="hover:text-gray-300 transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="hover:text-gray-300 transition-colors">
              Portfolio
            </button>
            <button onClick={() => scrollToSection('process')} className="hover:text-gray-300 transition-colors">
              Process
            </button>
            <button onClick={() => scrollToSection('stats')} className="hover:text-gray-300 transition-colors">
              Stats
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              Contact
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden bg-black border-t border-white/10">
            <div className="px-6 py-4 flex flex-col gap-4">
              <button onClick={() => scrollToSection('services')} className="text-left hover:text-gray-300">
                Services
              </button>
              <button onClick={() => scrollToSection('portfolio')} className="text-left hover:text-gray-300">
                Portfolio
              </button>
              <button onClick={() => scrollToSection('process')} className="text-left hover:text-gray-300">
                Process
              </button>
              <button onClick={() => scrollToSection('stats')} className="text-left hover:text-gray-300">
                Stats
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition-colors text-center"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioSection />
        <ProcessSection />
        <StatsSection />
        <CTASection />
      </main>

      <footer className="bg-black border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-white">X</span>
                <span className="text-gray-400">method</span>
              </div>
              <p className="text-gray-400 text-sm">
                Building the future of Web3, one project at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>MVP Development</li>
                <li>Web3 Integration</li>
                <li>UI/UX Design</li>
                <li>Consulting</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About Us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>GitHub</li>
                <li>Discord</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
            &copy; 2025 Xmethod. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
            Web3 Design & Development Agency
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          We Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">MVPs</span> for{' '}
          <br className="hidden md:block" />
          Web3 Startups
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
          From concept to launch in 2-3 months. We help startups validate their ideas
          and ship production-ready products.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            Start Your Project <ArrowRight size={20} />
          </button>
          <button
            onClick={() => {
              const element = document.getElementById('portfolio');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors"
          >
            View Portfolio
          </button>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  const services = [
    {
      icon: <Rocket size={32} />,
      title: 'MVP Development',
      description: 'Launch your product in 2-3 months with our proven development process.',
    },
    {
      icon: <Code2 size={32} />,
      title: 'Web3 Integration',
      description: 'Seamlessly integrate blockchain technology into your application.',
    },
    {
      icon: <Zap size={32} />,
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive interfaces that users love to interact with.',
    },
    {
      icon: <Users size={32} />,
      title: 'Team Extension',
      description: 'Scale your team with our experienced developers and designers.',
    },
  ];

  return (
    <section id="services" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">What We Do</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            End-to-end solutions for Web3 startups
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className="mb-4 text-white">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioSection() {
  const projects = [
    { title: 'DeFi Platform', category: 'Web3', color: 'from-blue-500 to-cyan-500' },
    { title: 'NFT Marketplace', category: 'Blockchain', color: 'from-purple-500 to-pink-500' },
    { title: 'DAO Governance', category: 'Web3', color: 'from-green-500 to-emerald-500' },
    { title: 'Wallet App', category: 'Mobile', color: 'from-orange-500 to-red-500' },
    { title: 'Exchange Platform', category: 'Trading', color: 'from-indigo-500 to-blue-500' },
    { title: 'Staking Protocol', category: 'DeFi', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <section id="portfolio" className="py-32 px-6 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Our Work</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            60+ MVPs launched across various Web3 verticals
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity`}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />
              <div className="relative h-full flex flex-col justify-end p-8">
                <span className="text-sm text-gray-300 mb-2">{project.category}</span>
                <h3 className="text-2xl font-bold">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const steps = [
    { number: '01', title: 'Discovery', description: 'Understanding your vision and requirements' },
    { number: '02', title: 'Design', description: 'Creating beautiful and functional interfaces' },
    { number: '03', title: 'Development', description: 'Building your product with cutting-edge tech' },
    { number: '04', title: 'Launch', description: 'Deploying and supporting your MVP' },
  ];

  return (
    <section id="process" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Our Process</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A proven methodology to bring your ideas to life
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="text-6xl font-bold text-white/10 mb-4">{step.number}</div>
              <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: '60+', label: 'MVPs Launched' },
    { value: '2-3', label: 'Months to Launch' },
    { value: '30+', label: 'Team Members' },
    { value: '€15k', label: 'Starting From' },
  ];

  return (
    <section id="stats" className="py-32 px-6 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-400 text-lg">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section id="contact" className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Ready to Build Your MVP?
        </h2>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Let's discuss your project and see how we can help bring your vision to life.
        </p>
        <button className="bg-white text-black px-12 py-4 rounded-full font-semibold text-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2">
          Get in Touch <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}

export default App;