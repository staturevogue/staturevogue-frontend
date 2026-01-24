import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTORS (Manage Token Automatically) ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const resp = error?.response;
    if (resp && resp.status === 401) {
      localStorage.removeItem('userToken');
      // Optional: Redirect to login if not already there
      if (window.location.pathname !== '/login') {
         window.location.href = '/login';
      }
    }
    return Promise.reject(resp ? resp.data : error);
  }
);


export const authService = {
  // 1. Standard Login
  login: async (credentials: any) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
  },

  // 2. Signup
  signup: async (userData: any) => {
    // We send empty phone for now as your backend requires it but UI might not have it yet
    const payload = { ...userData, phone: "" }; 
    const response = await api.post('/auth/signup/', payload);
    return response.data;
  },

  // 3. Google Login
  googleLogin: async (googleData: { code: string }) => {
    const payload = {
      code: googleData.code,
      callback_url: "postmessage" // Crucial for React-OAuth + Django-Allauth
    };
    const response = await api.post('/auth/google/', payload);
    return response.data;
  },

  // 4. Get User Profile
  getProfile: async () => {
    const response = await api.get('/auth/user/');
    return response.data;
  },

  // 5. Addresses
  getSavedAddresses: async () => {
    const response = await api.get('/auth/addresses/');
    return response.data;
  },

  saveAddress: async (address: any) => {
    const response = await api.post('/auth/addresses/', address);
    return response.data;
  },

  deleteAddress: async (id: number) => {
    const response = await api.delete(`/auth/addresses/${id}/`);
    return response.data;
  },

  setDefaultAddress: async (id: number) => {
    const response = await api.post(`/auth/addresses/${id}/set-default/`);
    return response.data;
  }
};

export const storeService = {
  // Update the params type to 'any' to allow badge, collection, search, etc.
  getProducts: async (params?: any) => { 
    const response = await api.get('/store/products/', { params });
    return response.data;
  },
  getProductBySlug: async (slug: string) => {
    const response = await api.get(`/store/products/${slug}/`);
    return response.data;
  },
  getCategories: async (params?: { featured?: boolean, gender?: string }) => {
    const response = await api.get('/store/categories/', { params });
    return response.data;
  },

  // 4. Get Collections (For "Most Popular", "Gym Fit" sections)
  getCollections: async () => {
    const response = await api.get('/store/collections/');
    return response.data;
  },
  getReviews: async (slug: string) => {
    const response = await api.get(`/store/products/${slug}/reviews/`);
    return response.data;
  },

  addReview: async (slug: string, data: { user_name: string, rating: number, comment: string }) => {
    const response = await api.post(`/store/products/${slug}/reviews/`, data);
    return response.data;
  },
  validateCoupon: async (code: string, orderTotal: number) => {
  const response = await api.post("/store/validate-coupon/", { 
    code, 
    order_total: orderTotal 
  });
  return response.data;
},

getSiteConfig: async () => {
  const response = await api.get("/store/config/");
  return response.data;
},
};

export const orderService = {
  createOrder: async (data: any) => {
    const response = await api.post('/orders/checkout/', data);
    return response.data;
  },
  verifyPayment: async (data: any) => {
    const response = await api.post('/payments/verify/', data);
    return response.data;
  },
  getUserOrders: async () => {
    const response = await api.get('/orders/');
    return response.data;
  },
  getOrderDetails: async (orderId: string | number) => {
    const response = await api.get(`/orders/${orderId}/`);
    return response.data;
  },

  updateOrderStatus: async (orderId: number, newStatus: string) => {
    const response = await api.patch(`/orders/${orderId}/update-status/`, { 
      order_status: newStatus 
    });
    return response.data;
  }
};

export default api;