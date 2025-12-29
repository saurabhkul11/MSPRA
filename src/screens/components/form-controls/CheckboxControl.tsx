import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

const CheckboxControl: React.FC<Props> = ({ label, checked, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle} style={{ flexDirection: "row" }}>
      <Text>{checked ? "☑" : "☐"}</Text>
      <Text style={{ marginLeft: 8 }}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CheckboxControl;
