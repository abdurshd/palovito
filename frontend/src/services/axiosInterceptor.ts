import axios from 'axios';
import { toast } from '../hooks/use-toast';

let loadingCount = 0;
let globalDispatch: any = null;

export const setupAxiosInterceptors = (dispatch: any) => {
  globalDispatch = dispatch;
  
  axios.interceptors.request.use(
    (config) => {
      loadingCount++;
      globalDispatch({ type: 'SET_LOADING', payload: true });
      return config;
    },
    (error) => {
      loadingCount--;
      if (loadingCount === 0) {
        globalDispatch({ type: 'SET_LOADING', payload: false });
      }
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      loadingCount--;
      if (loadingCount === 0) {
        globalDispatch({ type: 'SET_LOADING', payload: false });
      }
      return response;
    },
    (error) => {
      loadingCount--;
      if (loadingCount === 0) {
        globalDispatch({ type: 'SET_LOADING', payload: false });
      }

      const errorMessage = error.response?.data?.message || 'An error occurred';
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'error',
      });

      globalDispatch({ type: 'SET_ERROR', payload: errorMessage });
      return Promise.reject(error);
    }
  );
}; 