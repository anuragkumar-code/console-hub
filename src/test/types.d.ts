/// <reference types="vitest/globals" />
import '@testing-library/jest-dom';

declare global {
  // Extend Vi with jest-dom matchers
  namespace Vi {
    interface JestAssertion<T = unknown> {
      toBeInTheDocument(): T;
      toHaveTextContent(text: string | RegExp): T;
      toHaveAttribute(attr: string, value?: string): T;
      toHaveClass(...classNames: string[]): T;
      toBeVisible(): T;
      toBeDisabled(): T;
      toBeEnabled(): T;
      toBeEmpty(): T;
      toHaveValue(value: string | string[] | number): T;
      toHaveStyle(css: Record<string, unknown>): T;
      toContainElement(element: HTMLElement | null): T;
      toBeChecked(): T;
      toHaveFocus(): T;
    }
  }
}
