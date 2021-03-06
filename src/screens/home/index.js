import {Root} from 'native-base';
import React, {Component} from 'react';
import {ImageBackground, View, StatusBar} from 'react-native';
import {Container, Button, Text} from 'native-base';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import styles from './styles';
import Login from '../login';
import Dashboard from '../dashboard';
import ScanQRCode from '../scanQRCode';

const launchScreenBg = require('../../../assets/launchscreen-bg.png');
const launchScreenLogo = require('../../../assets/logo-kitchen-sink.png');

class Home extends Component {
  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={launchScreenBg} style={styles.imageContainer}>
          <View style={styles.logoContainer}>
            <ImageBackground source={launchScreenLogo} style={styles.logo} />
          </View>
          <View style={{marginBottom: 80}}>
            <Button
              style={{backgroundColor: '#6FAF98', alignSelf: 'center'}}
              onPress={() => this.props.navigation.navigate('SignIn')}>
              <Text>Login</Text>
            </Button>
          </View>
        </ImageBackground>
      </Container>
    );
  }
}

export default Home;
