import { toast } from 'react-toastify';

export const showToast = {
  success: (message) => toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  }),
  
  error: (message) => toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  }),
  
  warning: (message) => toast.warning(message, {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  }),
  
  info: (message) => toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
};

export const handleError = (error, customMessage = null) => {
  console.error('Error:', error);
  
  let message = customMessage;
  
  if (!message) {
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    } else {
      message = 'An unexpected error occurred. Please try again.';
    }
  }
  
  showToast.error(message);
  return ;
};

export const handleSuccess = (message) => {
  showToast.success(message);
};

export default showToast; 