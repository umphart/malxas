// Enhanced authentication service
class AuthService {
  constructor() {
    this.ADMIN_KEY = 'adminUser';
    this.AUTH_KEY = 'authToken';
  }

  async login(username, password) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get admin user from localStorage
    const savedAdmin = localStorage.getItem(this.ADMIN_KEY);
    
    if (!savedAdmin) {
      return { success: false, error: 'No admin account found. Please create one first.' };
    }

    try {
      const adminUser = JSON.parse(savedAdmin);
      
      if (username === adminUser.username) {
        // Verify password
        const isValidPassword = await this.verifyPassword(password, adminUser.password);
        
        if (isValidPassword) {
          const token = this.generateToken();
          const userData = {
            username: adminUser.username,
            role: 'admin'
          };
          return { success: true, user: userData, token };
        }
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  async register(username, password) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate input
    if (!username || !password) {
      return { success: false, error: 'Username and password are required' };
    }

    if (username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }

    try {
      // Check if admin already exists
      const existingAdmin = localStorage.getItem(this.ADMIN_KEY);
      if (existingAdmin) {
        const existingUser = JSON.parse(existingAdmin);
        return { 
          success: false, 
          error: `Admin user '${existingUser.username}' already exists. Please login instead.` 
        };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);
      
      const adminUser = {
        username: username.trim(),
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem(this.ADMIN_KEY, JSON.stringify(adminUser));
      
      // Generate token and login immediately
      const token = this.generateToken();
      const userData = {
        username: adminUser.username,
        role: 'admin'
      };
      
      console.log('Admin account created successfully:', username);
      return { success: true, user: userData, token };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }

  async hashPassword(password) {
    // Simple hash simulation - in a real app, use proper bcrypt
    // This is just for demo purposes
    const simpleHash = btoa(password).repeat(2);
    return `demo_hash_${simpleHash}`;
  }

  async verifyPassword(password, hashedPassword) {
    // Simple verification - in a real app, use proper bcrypt comparison
    // This is just for demo purposes
    const testHash = await this.hashPassword(password);
    return testHash === hashedPassword;
  }

  generateToken() {
    // Generate simple token (in real app, use JWT with proper signing)
    return `auth_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  validateToken(token) {
    return !!token && token.startsWith('auth_token_');
  }

  // Check if admin user exists
  hasAdminUser() {
    return !!localStorage.getItem(this.ADMIN_KEY);
  }

  // Get admin user info (without password)
  getAdminInfo() {
    try {
      const adminData = localStorage.getItem(this.ADMIN_KEY);
      if (adminData) {
        const { password, ...adminInfo } = JSON.parse(adminData);
        return adminInfo;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

// Export a singleton instance
export const authService = new AuthService();