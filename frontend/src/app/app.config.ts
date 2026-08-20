import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

const configureAnchorScrollOffset = () => {
  const viewportScroller = inject(ViewportScroller);

  // Helper to compute the current header/navbar height (in px).
  const computeHeaderHeight = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return 80;

    // Try to find the visible navbar element. Adjust selector if your navbar uses a
    // different class or tag. This looks for the most common `.navbar` class.
    const navbar = document.querySelector('.navbar') as HTMLElement | null;

    // Fallback to any sticky container at top if `.navbar` not found.
    const sticky = document.querySelector(
      '[style*="position: sticky"], .container',
    ) as HTMLElement | null;

    const height = (navbar && navbar.offsetHeight) || (sticky && sticky.offsetHeight) || 80;

    return Math.round(height);
  };

  const applyOffset = () => {
    const headerH = computeHeaderHeight();

    // Set Angular's ViewportScroller offset so router fragment navigation accounts for header.
    viewportScroller.setOffset(() => [0, headerH + 8]); // small buffer

    // Export CSS variable so CSS `scroll-padding-top` / `scroll-margin-top` can use it.
    try {
      document.documentElement.style.setProperty('--scroll-offset', `${headerH + 8}px`);
    } catch (e) {
      // ignore on non-browser environments
    }
  };

  // Apply initially
  applyOffset();

  // Update on resize / orientation change — keeps mobile address-bar changes in sync
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', applyOffset, { passive: true });
    window.addEventListener('orientationchange', applyOffset, { passive: true });
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(configureAnchorScrollOffset),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
  ],
};
