import * as Yup from "yup";
export const signupSchema = Yup.object().shape({
  firstName: Yup.string().required("Please Enter First Name"),
  lastName: Yup.string().required("Please Enter Last Name"),
  phoneNumber: Yup.string().required("Please Enter Phone Number"),
  countryCode: Yup.string().required("Please Enter Country Code"),
  email: Yup.string()
    .required("Please Enter Email")
    .email("Please Enter Valid Email"),
  dob: Yup.string().required("Please Enter Date of Birth"),
  password: Yup.string().required("Please Enter Password"),
});
