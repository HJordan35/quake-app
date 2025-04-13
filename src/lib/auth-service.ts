// Mock credentials
const VALID_CREDENTIALS = {
  email: 'test-user@gmail.com',
  password: 'password1235',
}

// Interface for login credentials
export interface LoginCredentials {
  email: string
  password: string
}

// Interface for the API response
export interface AuthResponse {
  success: boolean
  message: string
  user?: {
    email: string
  }
}

/**
 * Mock authentication service that simulates API calls
 */
export const authService = {
  /**
   * Mock login function that validates against hardcoded credentials
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 800))

    if (credentials.email === VALID_CREDENTIALS.email && credentials.password === VALID_CREDENTIALS.password) {
      return {
        success: true,
        message: 'Login successful',
        user: {
          email: credentials.email,
        },
      }
    }

    throw {
      success: false,
      message: 'Invalid email or password',
    }
  },

  /**
   * Mock logout function
   */
  logout: async (): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    return {
      success: true,
      message: 'Logout successful',
    }
  },
}
