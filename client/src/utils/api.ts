
import axios from 'axios';

const API_URL = 'http://localhost:3002/api'; // Update with your backend URL

export const fetchUserDataFromBackend = async (username: string) => {
  try {
    const response = await axios.get(`${API_URL}/users/${username}`);
    return response.data;
  } catch (error) {
    console.error(error)
  }
};

export const saveUserDataToBackend = async (username: string, userData: any, repos: any) => {
  try {
    await axios.post(`${API_URL}/users/repo`, { username, userData, repos });
  } catch (error) {
    console.error(error)
  }
};

export const fetchFollowersFromBackend = async (followersUrl: string) => {
  try {
    const response = await axios.get(`${API_URL}/followers`, { params: { url: followersUrl } });
    return response.data;
  } catch (error) {
    throw new Error('Error fetching followers from the backend');
  }
};

export const fetchFollowersFromApi = async (username: string): Promise<any[]> => {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}/followers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching followers from API:', error);
    throw new Error('Error fetching followers from API');
  }
};
