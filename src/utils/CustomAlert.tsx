import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type AlertType = 'info' | 'success' | 'error';

interface CustomAlertProps {
  visible: boolean;
  type?: AlertType;
  title?: string;
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  type = 'info',
  title,
  message,
  onClose,
}) => {
  const alertConfig = {
    info: {
      icon: 'information',
      color: '#0B63B6',
      backgroundColor: '#EAF3FF',
      defaultTitle: 'Information',
    },

    success: {
      icon: 'check',
      color: '#2E9B4B',
      backgroundColor: '#EAF8EE',
      defaultTitle: 'Success',
    },

    error: {
      icon: 'close',
      color: '#fc4444',
      backgroundColor: '#FDECEC',
      defaultTitle: 'Error',
    },
  };

  const config = alertConfig[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>

          {/* ICON */}
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: config.backgroundColor,
              },
            ]}
          >
            <Icon
              name={config.icon}
              size={34}
              color={config.color}
            />
          </View>

          {/* TITLE */}
          <Text style={styles.title}>
            {title || config.defaultTitle}
          </Text>

          {/* MESSAGE */}
          <Text style={styles.message}>
            {message}
          </Text>

          {/* OK BUTTON */}
          <TouchableOpacity
            style={[
              styles.okButton,
              {
                backgroundColor: config.color,
              },
            ]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.okButtonText}>
              OK
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  alertBox: {
    width: '78%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 18,
    alignItems: 'center',

    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 6,
    textAlign: 'center',
  },

  message: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555555',
    //lineHeight: 19,
    textAlign: 'center',
    marginBottom: 16,
  },

  okButton: {
    minWidth: 90,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  okButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
