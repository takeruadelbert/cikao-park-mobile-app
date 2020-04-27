import React, {Component} from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Body,
  Text,
  Thumbnail,
  Button,
  Icon,
  Footer,
  FooterTab,
} from 'native-base';
import styles from './styles';
import Session from '../../component/session';
import Constant from '../../constant';
import Endpoint from '../../rest-api/endpoint';
import ToastComponent from '../../component/toastComponent';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.session = new Session();
    this.state = {
      tokenPP: '',
      userFullName: '',
      tab1: true,
      tab2: false,
      tab3: false,
    };
  }

  componentDidMount(): void {
    this.fetchDataUser();
  }

  fetchDataUser = () => {
    let keys = ['tokenProfilePicture', 'fullName'];
    this.session.fetchMultiData(keys).then((data) => {
      if (data !== null) {
        this.setState({tokenPP: data[0][1], userFullName: data[1][1]});
      }
    });
  };

  toggleTab1() {
    this.setState({
      tab1: true,
      tab2: false,
      tab3: false,
    });
  }
  toggleTab2() {
    this.setState({
      tab1: false,
      tab2: true,
      tab3: false,
    });
  }

  logout = () => {
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

  render() {
    return (
      <Container style={styles.container}>
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
                Constant.SERVER_HOST +
                Endpoint.API_GET_FILE +
                '/' +
                this.state.tokenPP,
            }}
          />
          <Text>Hi, {this.state.userFullName}!</Text>
        </Content>

        <Footer>
          <FooterTab>
            <Button active={this.state.tab1} onPress={() => this.toggleTab1()}>
              <Icon active={this.state.tab1} name="grid" />
              <Text>Dashboard</Text>
            </Button>
            <Button active={this.state.tab2} onPress={() => this.toggleTab2()}>
              <Icon active={this.state.tab2} name="barcode" />
              <Text>Redeem Item</Text>
            </Button>
            <Button active={this.state.tab3} onPress={() => this.logout()}>
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
