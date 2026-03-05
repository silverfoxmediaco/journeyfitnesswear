import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {X} from 'lucide-react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside className="!bg-jfw-dark">
        <header className="!border-b !border-jfw-gray">
          <h3 className="font-heading text-sm uppercase tracking-[0.2em] text-jfw-blue">
            {heading}
          </h3>
          <button
            className="jfw-aside-close text-gray-400 hover:text-jfw-blue transition-colors duration-200"
            onClick={close}
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  // Close aside when returning from external page (e.g. Shopify checkout)
  // Shopify checkout sends Clear-Site-Data which can break bfcache,
  // so we listen to multiple events to cover all back-navigation scenarios
  useEffect(() => {
    const forceClose = () => setType('closed');

    // bfcache restore (persisted=true) or fresh reload after cache clear
    const handlePageShow = () => forceClose();

    // Tab regains focus after external navigation
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        forceClose();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
