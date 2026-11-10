import React from 'react';
import { useCaravan } from '../context/CaravanContext';
import { Sliders, LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const {
    setIsEmulatorOpen,
    currentUser,
    signInWithGoogle,
    signOutUser,
  } = useCaravan();

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="text-lg font-bold tracking-tight text-white font-display hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 text-left"
        >
          Gecko Offroad IoT
        </button>

        {/* Zone 2: Concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-300">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'dashboard'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('maps')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'maps'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            GPS &amp; Maps
          </button>
          <button
            onClick={() => onSelectTab('power')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'power'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            Power &amp; Solar
          </button>
          <button
            onClick={() => onSelectTab('security')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'security'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => onSelectTab('automations')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'automations'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            Automations
          </button>
          <button
            onClick={() => onSelectTab('rental')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'rental'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            Rental Fleet
          </button>
          <button
            onClick={() => onSelectTab('hardware')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'hardware'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            Hardware Lab
          </button>
          <button
            onClick={() => onSelectTab('business')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'business'
                ? 'text-amber-400 border-b-2 border-amber-400'
                : 'hover:text-white'
            }`}
          >
            Business Case
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-neutral-300 font-medium">
                {currentUser.displayName || currentUser.email}
              </span>
              <button
                onClick={signOutUser}
                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsEmulatorOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Emulator</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Sign In</span>
              </button>
              <button
                onClick={() => setIsEmulatorOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Emulator</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
