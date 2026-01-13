/**
 * API Service for AI Chatbot with Reusable Intelligence
 * Handles communication between frontend and backend services
 */

class ApiService {
  constructor(baseURL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '/api') : 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Process a chat message and get AI response
   */
  async sendMessage(message, conversationId = null, messageType = 'text', language = 'en', userPreferences = {}) {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('message', message);
      if (conversationId) params.append('conversation_id', conversationId);
      params.append('message_type', messageType);
      params.append('language', language);

      // Handle user preferences - stringify if it's an object
      if (userPreferences && Object.keys(userPreferences).length > 0) {
        params.append('user_preferences', JSON.stringify(userPreferences));
      }

      // Get auth token if available
      const token = localStorage.getItem('access_token');
      const headers = {
        ...this.defaultHeaders
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/chat?${params.toString()}`, {
        method: 'POST',
        headers: headers,
        // For GET/DELETE requests we wouldn't have a body, but for POST with query params
        // we still may need an empty body or just send the essential message in the body as backup
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Get user's conversation history
   */
  async getConversationHistory(conversationId) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        ...this.defaultHeaders
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/conversations/${conversationId}`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  }

  /**
   * List user's conversations
   */
  async listConversations() {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        ...this.defaultHeaders
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/conversations`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error listing conversations:', error);
      throw error;
    }
  }

  /**
   * Get user's tasks
   */
  async getUserTasks(conversationId = null, status = null, priority = null) {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (conversationId) queryParams.append('conversation_id', conversationId);
      if (status) queryParams.append('status', status);
      if (priority) queryParams.append('priority', priority);

      const queryString = queryParams.toString();
      const url = `${this.baseURL}/tasks${queryString ? '?' + queryString : ''}`;

      const token = localStorage.getItem('access_token');
      const headers = {
        ...this.defaultHeaders
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting user tasks:', error);
      throw error;
    }
  }

  /**
   * Create a new task
   */
  async createTask(taskData) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        ...this.defaultHeaders
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/tasks`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  /**
   * Update an existing task
   */
  async updateTask(taskId, updateData) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        ...this.defaultHeaders
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        ...this.defaultHeaders
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  /**
   * Complete a task
   */
  async completeTask(taskId) {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        ...this.defaultHeaders
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;