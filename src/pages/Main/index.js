import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';

import { Container, Form, Input, SubmitButton } from './styles';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: '',
      users: [],
    };
  }

  handleAddUser = async () => {
    const { newUser, users } = this.state;

    console.tron.log('chamada', newUser);
    const response = await api.get(`/users/${newUser}`);

    const userDate = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    this.setState({
      users: [...users, userDate],
      newUser: '',
    });
  };

  render() {
    const { newUser } = this.state;
    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Add user"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />
          <SubmitButton onPress={this.handleAddUser}>
            <Icon name="add" size={20} color="#fff" />
          </SubmitButton>
        </Form>
      </Container>
    );
  }
}

Main.navigationOptions = {
  title: 'Users',
};

export default Main;
