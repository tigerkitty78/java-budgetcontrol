export const fetchNearbyStoreAPI = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `http://localhost	:8080/api/nearby-store?latitude=${latitude}&longitude=${longitude}`,
        { method: 'GET', credentials: 'include' } // Ensuring cookies are sent
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch store');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message || 'Error fetching nearby store');
    }
  };
  