import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock the global fetch API for all tests
global.fetch = vi.fn() as unknown as typeof fetch

// Run cleanup after each test case
afterEach(() => {
  cleanup()
  // Reset all mocks after each test
  vi.resetAllMocks()
})
