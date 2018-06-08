/**
 * @flow
 */

import React from 'react';
import {FlatList, Text, StyleSheet, View} from 'react-native';
import {fetchUser} from 'italki-api';

type Props = {};

type State = {
  userKeyValues: [string, any][],
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderColor: '#000000',
    borderWidth: 1,
    padding: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 20,
    borderColor: '#000000',
    borderWidth: 1,
    padding: 5,
  },
  titleCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 26,
    borderColor: '#000000',
    borderWidth: 1,
    padding: 5,
  },
});

// Recursively transforms an object into an array of tuples
function arrayizeObject(object: Object) {
  return Object.keys(object).reduce((array, key) => {
    let value = object[key];

    if (value === null) {
      value = 'null';
    } else if (typeof value === 'boolean') {
      value = value.toString();
    } else if (typeof value.map === 'function') {
      value = value.map(other => {
        if (typeof other === 'object') {
          return arrayizeObject(other);
        }

        return other;
      });
    } else if (typeof value === 'object') {
      value = arrayizeObject(value);
    }

    return [...array, [key, value]];
  }, []);
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      userKeyValues: [],
    };
  }

  async componentDidMount() {
    const user = await fetchUser(1280555);
    const userKeyValues = arrayizeObject(user);
    this.setState({userKeyValues});
  }

  render() {
    return (
      <View>
        <View style={styles.row}>
          <Text style={styles.titleCell}>fetchUser() result</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.headerCell}>Key</Text>
          <Text style={styles.headerCell}>Value</Text>
        </View>
        <FlatList
          data={this.state.userKeyValues}
          renderItem={({item}) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item[0]}</Text>
              <Text style={styles.cell}>{item[1]}</Text>
            </View>
          )}
          keyExtractor={item => item[0]}
        />
      </View>
    );
  }
}

export default App;
