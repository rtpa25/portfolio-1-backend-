/** @format */

import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://ronitecomm.herokuapp.com/api/v1',
  withCredentials: true,
});

export const axiosAuthInstance = axios.create({
  baseURL: 'https://ronitecomm.herokuapp.com/api/v1',
});
