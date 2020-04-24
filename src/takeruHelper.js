import {Toast} from 'native-base';

class TakeruHelper {
  static showToast = (message, type) => {
    if (type === 'warning') {
      Toast.show({
        text: message,
        buttonText: 'Okay',
        buttonTextStyle: {color: '#008000'},
        buttonStyle: {backgroundColor: '#5cb85c'},
      });
    } else {
      Toast.show({
        text: message,
        type: type,
      });
    }
  };
}

export default TakeruHelper;
