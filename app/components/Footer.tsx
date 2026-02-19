import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {Instagram, Facebook, Twitter, Youtube, Mail} from 'lucide-react';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="jfw-footer bg-jfw-black border-t border-jfw-gray">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Main Footer Content */}
              <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand Column */}
                <div className="jfw-footer-brand lg:col-span-1">
                  <img
                    src="/logos/JOURNEY800V1WHITE.png"
                    alt="Journey Fitness Wear"
                    className="h-10 w-auto mb-6"
                  />
                  <p className="font-body text-sm text-gray-400 leading-relaxed mb-6">
                    Performance wear built for every rep, every mile, every
                    goal. Elevate your fitness journey with gear that matches
                    your ambition.
                  </p>
                  {/* Social Links */}
                  <div className="flex items-center gap-4">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jfw-social-link text-gray-500 hover:text-jfw-blue transition-all duration-200 hover:shadow-jfw-glow rounded-full p-2"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jfw-social-link text-gray-500 hover:text-jfw-blue transition-all duration-200 hover:shadow-jfw-glow rounded-full p-2"
                      aria-label="Facebook"
                    >
                      <Facebook size={20} />
                    </a>
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jfw-social-link text-gray-500 hover:text-jfw-blue transition-all duration-200 hover:shadow-jfw-glow rounded-full p-2"
                      aria-label="Twitter"
                    >
                      <Twitter size={20} />
                    </a>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="jfw-social-link text-gray-500 hover:text-jfw-blue transition-all duration-200 hover:shadow-jfw-glow rounded-full p-2"
                      aria-label="YouTube"
                    >
                      <Youtube size={20} />
                    </a>
                  </div>
                </div>

                {/* Shop Column */}
                <div className="jfw-footer-shop">
                  <h4 className="font-heading text-xs uppercase tracking-[0.2em] text-jfw-blue mb-6">
                    Shop
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <NavLink
                        to="/collections"
                        prefetch="intent"
                        className="jfw-footer-link font-body text-sm text-gray-400 hover:text-jfw-white transition-colors duration-200"
                      >
                        All Collections
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/collections/all"
                        prefetch="intent"
                        className="jfw-footer-link font-body text-sm text-gray-400 hover:text-jfw-white transition-colors duration-200"
                      >
                        All Products
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/pages/size-guide"
                        prefetch="intent"
                        className="jfw-footer-link font-body text-sm text-gray-400 hover:text-jfw-white transition-colors duration-200"
                      >
                        Size Guide
                      </NavLink>
                    </li>
                  </ul>
                </div>

                {/* Company Column */}
                <div className="jfw-footer-company">
                  <h4 className="font-heading text-xs uppercase tracking-[0.2em] text-jfw-blue mb-6">
                    Company
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <NavLink
                        to="/pages/about"
                        prefetch="intent"
                        className="jfw-footer-link font-body text-sm text-gray-400 hover:text-jfw-white transition-colors duration-200"
                      >
                        About Us
                      </NavLink>
                    </li>
                    {footer?.menu &&
                      header.shop.primaryDomain?.url &&
                      footer.menu.items.map((item) => {
                        if (!item.url) return null;
                        const url =
                          item.url.includes('myshopify.com') ||
                          item.url.includes(publicStoreDomain) ||
                          item.url.includes(header.shop.primaryDomain.url)
                            ? new URL(item.url).pathname
                            : item.url;
                        const isExternal = !url.startsWith('/');
                        return isExternal ? (
                          <li key={item.id}>
                            <a
                              href={url}
                              rel="noopener noreferrer"
                              target="_blank"
                              className="jfw-footer-link font-body text-sm text-gray-400 hover:text-jfw-white transition-colors duration-200"
                            >
                              {item.title}
                            </a>
                          </li>
                        ) : (
                          <li key={item.id}>
                            <NavLink
                              end
                              prefetch="intent"
                              to={url}
                              className="jfw-footer-link font-body text-sm text-gray-400 hover:text-jfw-white transition-colors duration-200"
                            >
                              {item.title}
                            </NavLink>
                          </li>
                        );
                      })}
                  </ul>
                </div>

                {/* Newsletter Column */}
                <div className="jfw-footer-newsletter">
                  <h4 className="font-heading text-xs uppercase tracking-[0.2em] text-jfw-blue mb-6">
                    Join the Journey
                  </h4>
                  <p className="font-body text-sm text-gray-400 mb-4">
                    Get 15% off your first order and stay updated on new drops.
                  </p>
                  <form
                    className="jfw-newsletter-form flex gap-2"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="jfw-newsletter-input flex-1 bg-jfw-gray border border-jfw-gray text-jfw-white text-sm font-body px-4 py-3 rounded-lg focus:outline-none focus:border-jfw-blue focus:shadow-jfw-glow transition-all duration-200 placeholder:text-gray-500"
                      aria-label="Email for newsletter"
                    />
                    <button
                      type="submit"
                      className="jfw-newsletter-btn bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-xs uppercase tracking-wider px-4 py-3 rounded-lg transition-all duration-200 hover:shadow-jfw-glow"
                      aria-label="Subscribe to newsletter"
                    >
                      <Mail size={18} />
                    </button>
                  </form>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="jfw-footer-bottom border-t border-jfw-gray py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="font-body text-xs text-gray-500">
                  &copy; {new Date().getFullYear()} Journey Fitness Wear. All
                  rights reserved.
                </p>
                <div className="flex items-center gap-6">
                  <NavLink
                    to="/policies/privacy-policy"
                    className="jfw-footer-policy-link font-body text-xs text-gray-500 hover:text-jfw-blue transition-colors duration-200"
                  >
                    Privacy
                  </NavLink>
                  <NavLink
                    to="/policies/terms-of-service"
                    className="jfw-footer-policy-link font-body text-xs text-gray-500 hover:text-jfw-blue transition-colors duration-200"
                  >
                    Terms
                  </NavLink>
                  <NavLink
                    to="/policies/shipping-policy"
                    className="jfw-footer-policy-link font-body text-xs text-gray-500 hover:text-jfw-blue transition-colors duration-200"
                  >
                    Shipping
                  </NavLink>
                </div>
              </div>
            </div>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}
