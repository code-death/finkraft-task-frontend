import axios from "axios";

export const API_URL = "https://finkraft-task-backend.onrender.com";

export default function callApi(endpoint, method = 'get', body) {
    let token = typeof window === 'undefined' ? '' : window.localStorage.getItem('token');
    let headers = {
        'content-type': 'application/json',
    };
    if (token && token !== '') {
        headers.Authorization = `Bearer ${token}`;
    }
    return axios({
        method: method,
        url: `${API_URL}/${endpoint}`,
        headers: headers,
        data: body ? JSON.stringify(body) : undefined,
    })
        .then((response) => {
            if (!response.ok) {
                return Promise.reject(response.data);
            }
            return response.data;
        })
        .catch((error) => error);
}

export function callUploadApi(endpoint, method = 'get', body) {
    const token = window.localStorage.getItem('token') ? window.localStorage.getItem('token') : '';
    const headers = {
        'content-type': 'application/json',
    };
    if (token && token !== '') {
        headers.Authorization = `Bearer ${token}`;
    }
    return axios({
        method: method,
        url: `${API_URL}/${endpoint}`,
        headers: headers,
        data: body,
    })
        .then((response) => {
            if (!response.ok) {
                return Promise.reject(response.data);
            }
            return response.data;
        })
        .catch((error) => error);
}
