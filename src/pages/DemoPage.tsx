import CardNav from '../components/CardNav';
import Particles from '../components/Particles';
import logo from '../assets/logo.svg';

const DemoPage = () => {
  const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", ariaLabel: "About Company" },
        { label: "Careers", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Projects", 
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        { label: "Featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#271E37", 
      textColor: "#fff",
      links: [
        { label: "Email", ariaLabel: "Email us" },
        { label: "Twitter", ariaLabel: "Twitter" },
        { label: "LinkedIn", ariaLabel: "LinkedIn" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <Particles
          particleColors={['#ffffff', '#7c6af7', '#4f9ef5']}
          particleCount={220}
          particleSpread={10}
          speed={0.12}
          particleBaseSize={90}
          moveParticlesOnHover
          alphaParticles
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <div className="relative z-10">
        <CardNav
          logo={logo}
          logoAlt="Company Logo"
          items={items}
          baseColor="#f9fafb"
          menuColor="#020617"
          buttonBgColor="#020617"
          buttonTextColor="#f9fafb"
          ease="back.out(1.7)"
          theme="dark"
          className="border-b border-white/10 bg-black/70 backdrop-blur-xl"
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-3xl">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-100 drop-shadow-[0_0_30px_rgba(15,23,42,0.9)]"
          >
            Welcome to <span className="bg-gradient-to-r from-[#7c6af7] to-[#4f9ef5] bg-clip-text text-transparent">MemoryOS</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-slate-300/80 max-w-2xl mx-auto">
            Your personal second brain. Capture memories, track patterns, and build insights that last a lifetime.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              className="px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105 bg-gradient-to-r from-[#7c6af7] to-[#4f9ef5] text-white shadow-[0_18px_60px_rgba(79,158,245,0.55)]"
            >
              Start Your Journey
            </button>
            <button
              className="px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105 border border-white/10 text-slate-200 bg-black/40 backdrop-blur-md"
            >
              Learn More
            </button>
          </div>
        </div>
        
        {/* Feature Cards Preview */}
        <div className="relative z-10 mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {[
            { title: 'Smart Capture', desc: 'Log memories with AI-powered suggestions', color: '#7c6af7' },
            { title: 'Pattern Detection', desc: 'Discover insights from your daily life', color: '#4f9ef5' },
            { title: 'Personal Growth', desc: 'Track your emotional journey over time', color: '#f59e0b' },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/5 bg-slate-950/70 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-white/15 hover:-translate-y-1 cursor-pointer shadow-[0_18px_60px_rgba(15,23,42,0.8)]"
            >
              <div
                className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: feature.color }} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-slate-100">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-300/80">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
