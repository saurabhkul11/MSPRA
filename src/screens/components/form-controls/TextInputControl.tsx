import React from "react";
import { TextInput, StyleSheet } from "react-native";

type Props = {
  value: string;
  placeholder?: string;
  keyboardType?: "default" | "numeric";
  maxLength?: number;
  onChangeText: (text: string) => void;
};

const TextInputControl: React.FC<Props> = ({
  value,
  placeholder,
  keyboardType = "default",
  maxLength,
  onChangeText,
}) => {
  return (
    <TextInput
      style={styles.input}
      value={value}
      placeholder={placeholder}
      keyboardType={keyboardType}
      maxLength={maxLength}
      onChangeText={onChangeText}
    />
  );
};

export default TextInputControl;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
});
