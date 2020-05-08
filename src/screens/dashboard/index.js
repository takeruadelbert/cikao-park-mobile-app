import React, {Component} from 'react';
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Footer,
  FooterTab,
  Header,
  Icon,
  Text,
  Thumbnail,
  Title,
} from 'native-base';
import Modal from 'react-native-modal';
import {BackHandler} from 'react-native';

import styles from './styles';
import Session from '../../component/session';
import Constant from '../../constant';
import Endpoint from '../../rest-api/endpoint';
import Logout from '../../component/logout';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.session = new Session();
    this.state = {
      tokenPP: '',
      userFullName: '',
      modalLogout: false,
      tab1: true,
      tab2: false,
      tab3: false,
    };
    this.logout = new Logout(this.props);
    this.setDataServerHost().then((result) => {
      this.serverHost = result !== null ? result : '';
    });
  }

  setDataServerHost = () => {
    return this.session.fetchSingleData('host').then((result) => {
      return result !== null ? result : '';
    });
  };

  fetchDataUser = () => {
    let keys = ['tokenProfilePicture', 'fullName'];
    this.session.fetchMultiData(keys).then((data) => {
      if (data !== null) {
        this.setState({tokenPP: data[0][1], userFullName: data[1][1]});
      }
    });
  };

  toggleModalLogout = (visible) => {
    this.setState({modalLogout: visible});
  };

  componentDidMount(): void {
    this.fetchDataUser();
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick = () => {
    return true;
  };

  render() {
    return (
      <Container style={styles.container}>
        <Modal isVisible={this.state.modalLogout}>
          <Card style={styles.mb}>
            <CardItem header bordered first>
              <Text>Logout Confirmation</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>Are you sure you want to logout?</Text>
              </Body>
            </CardItem>
            <CardItem footer bordered last style={styles.modalCard}>
              <Text onPress={() => this.logout.signOut()}>Yes</Text>
              <Text
                style={styles.no}
                onPress={() => this.toggleModalLogout(false)}>
                No
              </Text>
            </CardItem>
          </Card>
        </Modal>
        <Header noLeft>
          <Body>
            <Title>Dashboard</Title>
          </Body>
        </Header>

        <Content contentContainerStyle={styles.profilePicture}>
          <Thumbnail
            large
            source={{
              uri:
                this.serverHost +
                Endpoint.API_GET_FILE +
                '/' +
                this.state.tokenPP,
            }}
          />
          <Text>Hi, {this.state.userFullName}!</Text>
        </Content>

        <Footer>
          <FooterTab>
            <Button active={this.state.tab1}>
              <Icon active={this.state.tab1} name="grid" />
              <Text>Dashboard</Text>
            </Button>
            <Button
              active={this.state.tab2}
              onPress={() => this.props.navigation.navigate('ScanQRCode')}>
              <Icon active={this.state.tab2} name="barcode" />
              <Text>Redeem Item</Text>
            </Button>
            <Button
              active={this.state.tab3}
              onPress={() => this.toggleModalLogout(true)}>
              <Icon active={this.state.tab3} name="shuffle" />
              <Text>Logout</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default Dashboard;
