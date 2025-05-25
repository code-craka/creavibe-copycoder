/// <reference types="jest" />

// Type definitions for @testing-library/jest-dom
// Project: https://github.com/testing-library/jest-dom
// Definitions by: Ernesto García <https://github.com/gnapse>
//                 John Gozde <https://github.com/jgoz>
//                 Seth Macpherson <https://github.com/smacpherson64>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeVisible(): R;
      toBeEmpty(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeInvalid(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveFocus(): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
      toHaveStyle(css: string | Record<string, any>): R;
      toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): R;
      toHaveValue(value?: string | string[] | number): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveDescription(text?: string | RegExp): R;
    }
  }
}

// This exports an empty object to make this file a module
export {};
