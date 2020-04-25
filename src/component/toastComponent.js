import {Toast} from 'native-base';

class ToastComponent {
  static TOAST_TYPE_SUCCESS = 'success';
  static TOAST_TYPE_WARNING = 'warning';
  static TOAST_TYPE_DANGER = 'danger';

  static showToast = (message, type) => {
    Toast.show({
      text: message,
      type: type,
      buttonText: 'OK',
    });
  };
}

export default ToastComponent;
