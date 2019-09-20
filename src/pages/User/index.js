import React from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Title,
  Author,
  Info,
  LoadIndicator,
} from './styles';

class User extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('userData').name,
  });

  constructor(props) {
    super(props);
    this.state = {
      stars: [],
      loading: false,
      page: 1,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('userData');
    this.setState({ loading: true });

    try {
      const response = await api.get(`/users/${user.login}/starred`);
      this.setState({ stars: response.data, loading: false });
    } catch (err) {
      console.tron.log(err);
    }
  }

  loadMore = async () => {
    const { page, stars } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('userData');

    const currentPage = page + 1;
    this.setState({ loading: true, page: page + 1 });
    try {
      const response = await api.get(`/users/${user.login}/starred`, {
        params: { page: currentPage },
      });

      this.setState({ stars: [...stars, ...response.data], loading: false });
    } catch (err) {
      console.tron.log(err);
    }
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading } = this.state;
    const user = navigation.getParam('userData');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <LoadIndicator>
            <ActivityIndicator color="#7159c1" size={50} />
          </LoadIndicator>
        ) : (
          <Stars
            data={stars}
            onEndReachedThreshold={0.3}
            onEndReached={this.loadMore}
            keyExtractor={star => star.id.toString()}
            renderItem={({ item }) => (
              <Starred>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

export default User;
