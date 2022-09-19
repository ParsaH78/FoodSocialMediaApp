import "./register.css";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {register,reset} from "../../actions/AuthActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import FormInput from "../../components/formInput/FormInput";
 
export default function Register() {
  document.title = "ثبت نام";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {authData, isLoading, error, message} = useSelector((state) => state.auth);

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (authData) {
      dispatch(reset());
    }
  }, [authData, dispatch]);

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "نام کاربری",
      errorMessage:
        "نام کاربری باید بین 4-20 کاراکتر باشد و شامل هیچگونه کاراکتر ویژه(!@#$%^&*) نباشد",
      label: "نام کاربری",
      pattern: "^[A-Za-z0-9]{3,16}$",
    },
    {
      id: 2,
      name: "email",
      type: "email",
      placeholder: "ایمیل",
      errorMessage: "ایمیل باید معتبر باشد",
      label: "ایمیل",
    },
    {
      id: 4,
      name: "password",
      type: "password",
      placeholder: "پسورد",
      errorMessage:
        "پسورد باید بین 8-20 کاراکتر باشد و باید شامل حداقل 1 حرف و 1 رقم باشد ",
      label: "پسورد",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,20}$`,
    },
    {
      id: 5,
      name: "confirmPassword",
      type: "password",
      placeholder: "تکرار پسورد",
      errorMessage: "پسورد ها تطابق ندارند",
      label: "تکرار پسورد",
      pattern: values.password,
    },
  ];

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    dispatch(register(values, navigate));
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">FoodMedia</h3>
          <span className="loginDesc">
            شبکه اجتماعی مبتنی بر به اشتراک گذاری دستورپخت غذا
          </span>
        </div>
        <div className="loginRight">
          <form onSubmit={handleClick} className="registerForm">
            <h1 className="formTitle">ثبت نام</h1>
            {inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
              />
              ))}
            <button className="registerButton" type="submit" disabled={isLoading}>ثبت نام</button>
            {error && <div className="errorMessage"><span>{message}</span></div>}
            <button className="loginRegisterButton"><Link to="/login" style={{textDecoration: "none", color: "white"}} disabled={isLoading}>حساب کاربری دارید ؟ وارد شوید</Link></button>
          </form>
        </div>
      </div>
    </div>
  );
}
