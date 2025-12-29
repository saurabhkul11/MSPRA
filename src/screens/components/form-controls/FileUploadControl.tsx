import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  fileName?: string;
  onPick: () => void;
};

const FileUploadControl: React.FC<Props> = ({ fileName, onPick }) => {
  return (
    <View>
      <TouchableOpacity onPress={onPick}>
        <Text>Choose File</Text>
      </TouchableOpacity>
      <Text>{fileName || "No file chosen"}</Text>
    </View>
  );
};

export default FileUploadControl;
