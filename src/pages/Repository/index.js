import React from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

function Repository(props) {
  const { navigation } = props;
  const repo = navigation.getParam('repo');

  return <WebView source={{ uri: repo.html_url }} />;
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Repository.navigationOptions = props => ({
  title: props.navigation.getParam('repo').name,
});

export default Repository;
