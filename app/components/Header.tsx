import {Suspense, useState, useEffect} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {ShoppingBag, Search, Menu, User} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`jfw-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-jfw-white ${
        scrolled
          ? 'shadow-lg border-b border-gray-200'
          : ''
      }`}
      style={{height: 'var(--header-height)'}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <NavLink
          prefetch="intent"
          to="/"
          className="jfw-header-logo flex-shrink-0"
          end
        >
          <img
            src="/logos/JOURNEY800V1BLACKBLUE.png"
            alt={shop.name || 'Journey Fitness Wear'}
            className="h-10 md:h-12 w-auto"
          />
        </NavLink>

        {/* Desktop Nav */}
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />

        {/* CTAs */}
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  if (viewport === 'mobile') {
    return (
      <nav className="jfw-mobile-nav flex flex-col gap-2 py-4" role="navigation">
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          to="/"
          className={({isActive}) =>
            `jfw-mobile-nav-link block px-4 py-3 font-heading text-sm uppercase tracking-widest transition-all duration-200 border-l-2 ${
              isActive
                ? 'text-jfw-blue border-jfw-blue bg-jfw-blue/5'
                : 'text-jfw-white border-transparent hover:text-jfw-blue hover:border-jfw-blue/50'
            }`
          }
        >
          Home
        </NavLink>
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              end
              key={item.id}
              onClick={close}
              prefetch="intent"
              to={url}
              className={({isActive}) =>
                `jfw-mobile-nav-link block px-4 py-3 font-heading text-sm uppercase tracking-widest transition-all duration-200 border-l-2 ${
                  isActive
                    ? 'text-jfw-blue border-jfw-blue bg-jfw-blue/5'
                    : 'text-jfw-white border-transparent hover:text-jfw-blue hover:border-jfw-blue/50'
                }`
              }
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    );
  }

  return (
    <nav
      className="jfw-desktop-nav hidden md:flex items-center gap-8"
      role="navigation"
    >
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            end
            key={item.id}
            prefetch="intent"
            to={url}
            className={({isActive}) =>
              `jfw-nav-link font-heading text-xs uppercase tracking-[0.2em] transition-all duration-200 relative py-1 ${
                isActive
                  ? 'text-jfw-blue'
                  : 'text-jfw-black hover:text-jfw-blue'
              }`
            }
          >
            {({isActive}) => (
              <>
                {item.title}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] bg-jfw-blue transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0'
                  }`}
                />
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav
      className="jfw-header-ctas flex items-center gap-3 sm:gap-5"
      role="navigation"
    >
      <SearchToggle />
      <NavLink
        prefetch="intent"
        to="/account"
        className="jfw-account-link text-jfw-black hover:text-jfw-blue transition-colors duration-200 hidden sm:block"
        aria-label="Account"
      >
        <User size={22} strokeWidth={1.5} />
      </NavLink>
      <CartToggle cart={cart} />
      <HeaderMenuMobileToggle />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="jfw-mobile-toggle md:hidden text-jfw-black hover:text-jfw-blue transition-colors duration-200"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <Menu size={26} strokeWidth={1.5} />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className="jfw-search-toggle text-jfw-black hover:text-jfw-blue transition-colors duration-200"
      onClick={() => open('search')}
      aria-label="Search"
    >
      <Search size={22} strokeWidth={1.5} />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <a
      href="/cart"
      className="jfw-cart-badge relative text-jfw-black hover:text-jfw-blue transition-colors duration-200"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label={`Cart${count ? ` (${count} items)` : ''}`}
    >
      <ShoppingBag size={22} strokeWidth={1.5} />
      {count !== null && count > 0 && (
        <span className="jfw-cart-count absolute -top-2 -right-2 bg-jfw-blue text-jfw-black text-[10px] font-body font-bold w-5 h-5 rounded-full flex items-center justify-center">
          {count}
        </span>
      )}
    </a>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/jfw-shop',
      resourceId: null,
      tags: [],
      title: 'Shop',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/jfw-collections',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections/all',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/jfw-about',
      resourceId: null,
      tags: [],
      title: 'About',
      type: 'HTTP',
      url: '/pages/about',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/jfw-size-guide',
      resourceId: null,
      tags: [],
      title: 'Size Guide',
      type: 'HTTP',
      url: '/pages/size-guide',
      items: [],
    },
  ],
};
