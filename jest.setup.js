// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

// Mock the next/router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    pathname: "/",
    query: {},
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: require("react").forwardRef(({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )),
    span: require("react").forwardRef(({ children, ...props }, ref) => (
      <span ref={ref} {...props}>
        {children}
      </span>
    )),
  },
  AnimatePresence: ({ children }) => children,
}))

// Mock PostHog
jest.mock("posthog-js", () => ({
  capture: jest.fn(),
  identify: jest.fn(),
  reset: jest.fn(),
  init: jest.fn(),
}))

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }

  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

window.IntersectionObserver = MockIntersectionObserver
