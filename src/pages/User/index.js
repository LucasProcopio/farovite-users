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
      loadMore: false,
      endReached: 0.2,
      refreshing: false,
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
    this.setState({ loadMore: true, page: page + 1 });
    try {
      const response = await api.get(`/users/${user.login}/starred`, {
        params: { page: currentPage },
      });

      if (response.data.length !== 0) {
        this.setState({ stars: [...stars, ...response.data], loadMore: false });
      } else {
        this.setState({ loadMore: false, endReached: 0 });
      }
    } catch (err) {
      console.tron.log(err);
    }
  };

  reefreshList = async () => {
    this.setState({ refreshing: true });

    const { navigation } = this.props;
    const user = navigation.getParam('userData');

    try {
      const response = await api.get(`/users/${user.login}/starred`);

      this.setState({ stars: response.data, refreshing: false, page: 1 });
    } catch (err) {
      console.tron.log(err);
    }
  };

  handleNavigate = repo => {
    const { navigation } = this.props;
    navigation.navigate('Repository', { repo });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, loadMore, endReached, refreshing } = this.state;
    const user = navigation.getParam('userData');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading || refreshing ? (
          <LoadIndicator>
            <ActivityIndicator color="#7159c1" size={50} />
          </LoadIndicator>
        ) : (
          <Stars
            data={stars}
            onEndReachedThreshold={endReached}
            onEndReached={this.loadMore}
            onRefresh={this.reefreshList}
            refreshing={refreshing}
            keyExtractor={star => star.id.toString()}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}

        {loadMore && (
          <LoadIndicator bottomIndicator="true">
            <ActivityIndicator color="#7159c1" size={30} />
          </LoadIndicator>
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
    navigate: PropTypes.func,
  }).isRequired,
};

export default User;
