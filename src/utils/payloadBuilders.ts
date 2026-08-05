/* eslint-disable @typescript-eslint/no-unused-vars */
export const buildPayload = ({
  questionId,
  answers,
  questionDetails,
  userID,
  username,
}: any) => {
  const jsontextboxpayload: any[] = [];
  const jsoncheckboxpayload: any[] = [];
  const jsondropdownPayload: any[] = [];
  const Jsondocumentpayload: any[] = [];

  Object.values(answers).forEach((a: any) => {
    if (!a || !a.ElementMasterId) return;

    if (a.type === "textbox") jsontextboxpayload.push(a);
    if (a.type === "checkbox") jsoncheckboxpayload.push(a);
    if (a.type === "dropdown") jsondropdownPayload.push(a);
    if (a.type === "file") Jsondocumentpayload.push(a);
  });

  return {
    roleid: "1",
    userid: userID,
    username,
    jsontextboxpayload,
    jsoncheckboxpayload,
    jsondropdownPayload,
    Jsondocumentpayload,
  };
};
