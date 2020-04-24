import React, {Component} from 'react';
import {Linking} from 'react-native';
import {
  Button,
  Container,
  Form,
  Input,
  Item,
  Label,
  Text,
  View,
  Toast,
  Footer,
  FooterTab,
  Content,
} from 'native-base';
import styles from './styles';
import Constant from '../../constant';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      username: '',
      password: '',
    };
  }

  handleUsername = (text) => {
    this.setState({username: text});
  };

  handlePassword = (text) => {
    this.setState({password: text});
  };

  showToast = (message, type) => {
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

  signIn = (username, password) => {
    if (username === '') {
      this.showToast('Username must be filled.', 'warning');
      return;
    }

    if (password === '') {
      this.showToast('Password must be filled.', 'warning');
      return;
    }

    this.showToast(
      'username : ' + username + ' password : ' + password,
      'success',
    );
  };

  render() {
    return (
      <Container style={styles.container}>
        <View>
          <Text style={styles.title}>Cikao Park</Text>
          <Form style={styles.form}>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input onChangeText={this.handleUsername} />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input secureTextEntry onChangeText={this.handlePassword} />
            </Item>
          </Form>
          <Button
            block
            style={{margin: 15, marginTop: 50}}
            onPress={() =>
              this.signIn(this.state.username, this.state.password)
            }>
            <Text>Sign In</Text>
          </Button>
        </View>

        <Content padder />

        <Footer>
          <FooterTab>
            <Button>
              <Text
                style={styles.footerText}
                onPress={() => Linking.openURL(Constant.developerURL)}>
                Copyright © {Constant.getCurrentYear()} Surya Teknologi Nasional{' '}
                {'\n'} Developed & Maintenance by {Constant.developer}
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default Login;
