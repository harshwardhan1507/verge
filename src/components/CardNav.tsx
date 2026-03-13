import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface CardNavLink {
  label: string;
  ariaLabel: string;
  href?: string;
  onClick?: () => void;
}

export interface CardNavItem {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
}

export interface CardNavProps {
  logo?: string;
  logoAlt?: string;
  items: CardNavItem[];
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  ease?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export function CardNav({
  logo,
  logoAlt = 'Logo',
  items,
  baseColor = '#fff',
  buttonBgColor = '#111',
  buttonTextColor = '#fff',
  ease = 'power3.out',
  theme = 'dark',
  className,
}: CardNavProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (activeIndex !== null && menuRef.current) {
      // Animate menu in
      gsap.fromTo(
        menuRef.current,
        { 
          opacity: 0, 
          y: -10,
          scale: 0.95 
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          duration: 0.4,
          ease
        }
      );
    }
  }, [activeIndex, ease]);

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <nav
      className={cn(
        'relative z-50 flex items-center justify-between px-6 py-4',
        theme === 'dark' ? 'bg-surface/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md',
        'border-b border-white/5',
        className
      )}
      style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.1)' }}
    >
      {/* Logo */}
      {logo && (
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt={logoAlt} className="h-8 w-auto" />
        </a>
      )}

      {/* Navigation Items */}
      <div className="flex items-center gap-1">
        {items.map((item, index) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Nav Button */}
            <button
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                'hover:scale-105'
              )}
              style={{
                backgroundColor: activeIndex === index ? buttonBgColor : 'transparent',
                color: activeIndex === index ? buttonTextColor : baseColor,
              }}
              aria-label={`Open ${item.label} menu`}
              aria-expanded={activeIndex === index}
            >
              {item.label}
              <ChevronDown
                className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  activeIndex === index && 'rotate-180'
                )}
                style={{ color: activeIndex === index ? buttonTextColor : baseColor }}
              />
            </button>

            {/* Card Dropdown */}
            {activeIndex === index && (
              <div
                ref={(el) => { cardRefs.current[index] = el; }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3"
                style={{ perspective: '1000px' }}
              >
                <div
                  ref={menuRef}
                  className="w-72 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    backgroundColor: item.bgColor,
                    boxShadow: `0 25px 50px -12px ${item.bgColor}80`,
                  }}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-white/10">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: item.textColor }}
                    >
                      {item.label}
                    </h3>
                    <p
                      className="text-xs mt-0.5 opacity-60"
                      style={{ color: item.textColor }}
                    >
                      Explore {item.label.toLowerCase()} section
                    </p>
                  </div>

                  {/* Links */}
                  <div className="p-2">
                    {item.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.href || '#'}
                        onClick={(e) => {
                          if (link.onClick) {
                            e.preventDefault();
                            link.onClick();
                          }
                        }}
                        className={cn(
                          'block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                          'hover:scale-[1.02] hover:brightness-110'
                        )}
                        style={{ color: item.textColor }}
                        aria-label={link.ariaLabel}
                      >
                        <span className="flex items-center justify-between">
                          {link.label}
                          <span
                            className="w-1.5 h-1.5 rounded-full opacity-40"
                            style={{ backgroundColor: item.textColor }}
                          />
                        </span>
                      </a>
                    ))}
                  </div>

                  {/* Card Footer */}
                  <div
                    className="p-3 border-t border-white/10"
                    style={{ backgroundColor: `${item.bgColor}40` }}
                  >
                    <a
                      href="#"
                      className={cn(
                        'block text-center text-xs font-medium py-2 rounded-lg transition-all duration-200',
                        'hover:brightness-110'
                      )}
                      style={{
                        backgroundColor: buttonBgColor,
                        color: buttonTextColor,
                      }}
                    >
                      View All {item.label} →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="flex items-center gap-3">
        <button
          className={cn(
            'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
            'hover:scale-105 hover:shadow-lg'
          )}
          style={{
            backgroundColor: buttonBgColor,
            color: buttonTextColor,
            boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          }}
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}

export default CardNav;
