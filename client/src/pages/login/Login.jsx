import { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import {login,reset} from "../../actions/AuthActions";
import { useDispatch, useSelector } from "react-redux";
import FormInput from "../../components/formInput/FormInput";
import { useEffect } from "react";

export default function Login() {
  document.title = "ورود"

  const dispatch = useDispatch();

  const {authData, isLoading, error, message} = useSelector((state) => state.auth);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (authData) {
      dispatch(reset());
    }
  }, [authData, dispatch]);

  const inputs = [
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
        "پسورد باید بین 8-20 کاراکتر باشد و باید شامل حداقل 1 حرف و 1 رقم  باشد ",
      label: "پسورد",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,20}$`,
    },

  ];

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(login(values));
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
        <form onSubmit={handleClick} className="loginForm">
            <h1 className="formTitle">ورود</h1>
            {inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.name]}
              onChange={onChange}
              />
              ))}
            <button type="submit" className="loginButton" disabled={isLoading}>ورود</button>
            {error && <div className="errorMessage"><span>{message}</span></div>}
            <button className="loginRegisterButton" disabled={isLoading}>
              <Link to="/register" style={{textDecoration: "none", color: "white"}}>
                  ساخت حساب کاربری جدید
              </Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
