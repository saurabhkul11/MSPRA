import React from "react";
import { View, Text } from "react-native";

type Props = {
  formNo: number;
};

const FormLayout: React.FC<Props> = ({ formNo }) => {
  switch (formNo) {
    case 1:
      return <Text>Form 1 Content</Text>;
    case 2:
      return <Text>Form 2 Content</Text>;
    case 3:
      return <Text>Form 3 Content</Text>;
    case 4:
      return <Text>Form 4 Content</Text>;
    case 5:
      return <Text>Form 5 Content</Text>;
    case 6:
      return <Text>Form 6 Content</Text>;
    case 7:
      return <Text>Form 7 Content</Text>;
    case 8:
      return <Text>Form 8 Content</Text>;
    default:
      return <Text>Invalid Form</Text>;
  }
};

// export default FormLayout;


// import React, { useRef } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import TextInputControl from "./components/form-controls/TextInputControl";
// import CheckboxControl from "./components/form-controls/CheckboxControl";
// import FileUploadControl from "./components/form-controls/FileUploadControl";
// import TableControl from "./components/form-controls/TableControl";
// import DropdownControl from "./components/form-controls/DropdownControl";

// type Props = {
//   questions: any[];
//   questionDetails: any[];
//   activeStepIndex: number;
//   submittedSteps: number[];
//   answers: Record<string, any>;
//   setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
//   onNext: () => void;
//   onPrev: () => void;
//   onSubmit: () => void;
// };

// const FormLayout: React.FC<Props> = ({
//   questions,
//   questionDetails,
//   activeStepIndex,
//   submittedSteps,
//   answers,
//   setAnswers,
//   onNext,
//   onPrev,
//   onSubmit,
// }) => {
//   const renderedTableSet = useRef<Set<string>>(new Set());

//   /** 🔹 MOVE renderControl HERE */
//   const renderControl = (item: any) => {
//     switch (item.rdformelementid) {
//       case 1:
//         return <TextInputControl item={item} answers={answers} setAnswers={setAnswers} />;

//       case 2:
//         return <DropdownControl item={item} answers={answers} setAnswers={setAnswers} />;

//       case 3:
//         return <CheckboxControl item={item} answers={answers} setAnswers={setAnswers} />;

//       case 4:
//         return <FileUploadControl item={item} answers={answers} setAnswers={setAnswers} />;

//       case 5:
//         return (
//           <TableControl
//             item={item}
//             questionDetails={questionDetails}
//             answers={answers}
//             setAnswers={setAnswers}
//             renderedTableSet={renderedTableSet}
//           />
//         );

//       default:
//         return null;
//     }
//   };

//   let questionNumber = 1;

//   return (
//     <View style={{ flex: 1 }}>
//       <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
//         {questionDetails.map(item => {
//           const currentNumber = questionNumber++;
//           return (
//             <View key={item.rdformelementno} style={{ marginBottom: 12 }}>
//               <Text>{`${currentNumber}. ${item.rdformlablename}`}</Text>
//               {renderControl(item)}
//             </View>
//           );
//         })}
//       </ScrollView>

//       {/* 🔹 FOOTER BUTTONS */}
//       <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
//         {activeStepIndex > 0 && (
//           <TouchableOpacity onPress={onPrev}>
//             <Text>मागील</Text>
//           </TouchableOpacity>
//         )}

//         <TouchableOpacity onPress={onSubmit}>
//           <Text>Submit</Text>
//         </TouchableOpacity>

//         {activeStepIndex < questions.length - 1 && (
//           <TouchableOpacity onPress={onNext}>
//             <Text>पुढे</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// export default FormLayout;
