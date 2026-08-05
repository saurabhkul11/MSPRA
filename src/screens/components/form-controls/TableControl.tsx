/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { View, Text } from "react-native";

type Props = {
  tableData: any[];
};

const TableControl: React.FC<Props> = ({ tableData }) => {
  return (
    <View>
      <Text>Table will render here</Text>
    </View>
  );
};

export default TableControl;
