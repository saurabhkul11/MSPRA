import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  DrawerActions,
  useNavigation,
} from '@react-navigation/native';

interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({title}) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.header}>
      
      {/* LEFT MENU ICON */}
      <TouchableOpacity
        style={styles.menuButton}
        activeOpacity={0.7}
        onPress={() =>
          navigation.dispatch(DrawerActions.openDrawer())
        }>
        <Ionicons
          name="menu"
          size={28}
          color="#fff"
        />
      </TouchableOpacity>

      {/* CENTER TITLE */}
      <Text
        style={styles.title}
        numberOfLines={1}>
        {title}
      </Text>

    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#0B4FA3',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',

    elevation: 4,
  },

  menuButton: {
    position: 'absolute',
    left: 15,
    height: 60,
    width: 45,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 10,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 65,
  },
});