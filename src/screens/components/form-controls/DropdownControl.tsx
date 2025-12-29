import React from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type Option = {
  label: string;
  value: string;
};

type Props = {
  value: string | null;
  options: Option[];
  onChange: (value: string) => void;
};

const DropdownControl: React.FC<Props> = ({ value, options, onChange }) => {
  return (
    <View style={styles.container}>
      <Dropdown
        style={styles.dropdown}
        data={options}
        labelField="label"
        valueField="value"
        value={value}
        placeholder="Select"
        onChange={(item: any) => onChange(item.value)}
      />
    </View>
  );
};

export default DropdownControl;

const styles = StyleSheet.create({
  container: { width: "100%" },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
  },
});
