import ToastComponent from './toastComponent';
import {Component} from 'react';
import Session from './session';

class Logout extends Component {
  constructor(props) {
    super(props);
    this.session = new Session();
  }

  signOut = () => {
    let keys = ['password', 'tokenProfilePicture', 'fullName'];
    this.session.removeMultiData(keys).then((result) => {
      if (result) {
        console.log('Discard Data Session Success.');
        console.log('Logout ...');
        this.props.navigation.navigate('SignIn');
      } else {
        ToastComponent.showToast('an Error occurred when logout.', 'danger');
      }
    });
  };
}

export default Logout;
