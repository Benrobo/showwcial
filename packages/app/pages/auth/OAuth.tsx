import React, { useContext, useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardBackspace, MdCancel } from "react-icons/md";
import { CgSpinnerTwoAlt } from "react-icons/cg";
import { BsCheckCircleFill } from "react-icons/bs";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { useMutation, useQuery } from "react-query";
import { verifyUser, loginUser } from "../../http";
import { toast } from "react-hot-toast";
import { Spinner } from "../../components/Loader";
import { useRouter } from "next/router";
import ImageTag from "../../components/Image";
import { HandleAuthenticationResponse } from "../../util/response";
import withoutAuth from "../../util/withoutAuth";
import isAuthenticated from "../../util/isAuthenticated";
import DataContext from "../../context/DataContext";

function OAuth() {
  const { setIsOauthWindowOpened, isOauthWindowOpened } =
    useContext(DataContext);
  const [focus, setFocus] = useState<string>("");
  const [showpwd, setShowPwd] = useState(false);
  const [inputData, setInputData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const loginMutation = useMutation(async (data) => {
    return await loginUser(data);
  });
  const verifyMutation = useMutation(async (data: any) => {
    return await verifyUser(data);
  });
  const [showpwdInp, setShowPwdInp] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isLoggedIn = isAuthenticated(token);
    if (isLoggedIn) {
      location.href = "/dashboard";
      isOauthWindowOpened && window.close();
    }
  }, []);

  const togglePwdVisib = () => setShowPwd(!showpwd);
  const clearMutation = () => {
    loginMutation.reset();
    verifyMutation.reset();
  };

  const handleInput = (e: any) => {
    const name: string = e.target?.name;
    const value: string = e.target?.value;
    setInputData((prev: any) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const inp = document.querySelectorAll("#authInput");
    inp.forEach((input) => {
      input.addEventListener("focus", (e: any) => setFocus(e.target.name));
      input.addEventListener("focusout", (e: any) => setFocus(""));
    });
  }, []);

  useEffect(() => {
    const { data, error } = verifyMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      console.log({ response });
      HandleAuthenticationResponse(
        response,
        () => clearMutation(),
        () => setShowPwdInp(true)
      );
    }
  }, [verifyMutation.data]);

  useEffect(() => {
    const { data, error } = loginMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleAuthenticationResponse(
        response,
        () => clearMutation(),
        () => {
          const userData = data?.data;
          window.opener.postMessage(userData, "*");
          window.close();
          setIsOauthWindowOpened(false);
        }
      );
    }
  }, [loginMutation.data]);

  async function handleUserAuthentication() {
    const { username, email } = inputData;
    if (username === "" || email === "") {
      toast.error("some fields are empty");
      return;
    }
    if (showpwdInp) {
      console.log(inputData);
      loginMutation.mutate(inputData as any);
      return;
    }
    delete inputData["password"];
    verifyMutation.mutate(inputData as any);
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full opacity-[.50] flex flex-col items-center justify-center"></div>
      <div
        id="card"
        className="w-[350px] fixed top-0 z[1000] h-auto md:w-[400px] mt-8"
      >
        <div className="w-full px-3 py-3 mt-1 flex flex-start justify-start flex-col">
          <h2 className="text-white-100 text-3xl veryBold pp-RG">
            Welcome Back
          </h2>
          <p className="text-white-200 text-1xl pp-RG mt-2 ">
            Let get you authenticated.
          </p>
          <small className="text-white-400 font-pp-rg mt-2">
            Make sure you have an account on{" "}
            <a
              href="https://www.showwcase.com/login?type=signin"
              className="underline text-white-100"
            >
              showwcase
            </a>
            .
          </small>
        </div>
        <div className="w-full mt-7 px-3 py-2 flex flex-col items-center justify-end gap-5">
          <div className="w-full relative flex items-center justify-center">
            <input
              type="text"
              name="username"
              id="authInput"
              className={`w-full py-4 px-3 text-[12px] bg-dark-100 ${
                focus === "username" ? "border-blue-300" : "border-white-600"
              } border-[3px] border-solid outline-none text-white-100 rounded-md  `}
              placeholder="Showwcase Username"
              onKeyUp={handleInput}
            />
          </div>
          <div className="w-full relative flex items-center justify-center">
            <input
              type="email"
              name="email"
              id="authInput"
              className={`w-full py-4 px-3 text-[12px] bg-dark-100 ${
                focus === "email" ? "border-blue-300" : "border-white-600"
              } border-[3px] border-solid outline-none text-white-100 rounded-md  `}
              placeholder="Showwcase Email"
              onKeyUp={handleInput}
            />
          </div>
          {/* only show the password input field if user has an account on both showwcial and showwcase */}
          {showpwdInp && (
            <div className="w-full relative flex flex-col items-center justify-center">
              <div className="w-full flex items-center justify-center">
                <input
                  type={showpwd ? "text" : "password"}
                  name="password"
                  id="authInput"
                  className={`w-full py-4 px-3 text-[12px] bg-dark-100 ${
                    focus === "password"
                      ? "border-blue-300"
                      : "border-white-600"
                  } border-[3px] border-solid outline-none text-white-100 rounded-md  `}
                  placeholder="Password"
                  onKeyUp={handleInput}
                />
                <PasswordToggle state={showpwd} action={togglePwdVisib} />
              </div>
            </div>
          )}
          <div className="w-full flex items-end justify-end">
            <Link
              className="text-white-300 text-[13px] underline "
              href="/forgot-password"
            >
              Forgot password
            </Link>
          </div>
          <button
            className="w-full rounded-lg  game-btn "
            disabled={loginMutation.isLoading || verifyMutation.isLoading}
            onClick={handleUserAuthentication}
          >
            <span className="w-full px-4 py-4 text-center flex items-center justify-center text-[14px]  bg-blue-300 shadow-md -translate-y-1.5 hover:-translate-y-2.5 duration-300 text-white-100 rounded-lg ">
              {loginMutation.isLoading || verifyMutation.isLoading ? (
                <Spinner color="#fff" />
              ) : (
                <div className="w-full text-center font-pp-sb flex flex-row items-center justify-center gap-5">
                  <ImageTag
                    src="/images/logos/showwcase.png"
                    className="w-[30px] h-[30px] bg-white-100 rounded-[50%] "
                  />
                  <p className="">
                    {showpwdInp ? "Continue to login" : "Continue"}
                  </p>
                </div>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default withoutAuth(OAuth);

interface TogglePwd {
  state?: boolean;
  action: () => void;
}

function PasswordToggle({ state, action }: TogglePwd) {
  let component = null;

  if (state) {
    component = (
      <AiFillEyeInvisible
        className="absolute top-5 right-5 text-white-300 text-1xl cursor-pointer  "
        onClick={action}
      />
    );
  } else {
    component = (
      <AiFillEye
        className="absolute top-5 right-5 text-white-300 text-1xl cursor-pointer  "
        onClick={action}
      />
    );
  }

  return component;
}
