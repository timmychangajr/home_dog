import axios from "axios";
import { baseURL } from ".";
import { NavigateFunction } from "react-router-dom";
import { showToast } from "../store/toastSlice";
import { Dispatch } from "redux";
import { clearLogin } from "../store/userSlice";

export default async function login(name: string, email: string, navigate: NavigateFunction) {
  try {
    await axios.post(`${baseURL}/auth/login`, {
      name,
      email,
    }, {
      withCredentials: true
    }).then(() => navigate('/home')).catch();

  } catch (error) {
    console.error('Error Searching:  ', error);
  }
}

export async function logout(dispatch: Dispatch, navigate: NavigateFunction) {
  try {
    navigate('/')
    await axios.post(`${baseURL}/auth/logout`, null, {
      withCredentials: true
    }).then(() => {
      dispatch(clearLogin())
      dispatch(showToast({
        title: 'Please Come Back Soon!',
        type: 'success',
      }));
    }).catch();
  } catch (error) {
    handleError(error, dispatch);
  }
}

export async function handleError(error: any, dispatch: Dispatch, navigate?: NavigateFunction) {
  console.log('Handle Error: ', error?.response);
  const has401 = error?.message.includes('401') || error?.response?.status === 401;
  if (has401) {
    dispatch(clearLogin());
    dispatch(showToast({ 'title': 'Please Login Again', 'type': 'error' }));
    if (navigate) {
      navigate('/');
    }
  } else {
    dispatch(showToast({ 'title': 'Service Temporarily Unavailable', 'type': 'error' }))
  }
  return error;
}