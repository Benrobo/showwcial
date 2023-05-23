import { MdOutlineKeyboardBackspace } from "react-icons/md";
import ImageTag from "../../components/Image";
import { Spinner } from "../../components/Loader";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { IoCheckmark, IoCheckmarkCircle } from "react-icons/io5";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function ForgotPassword() {
  const router = useRouter();
  const [isSent, setIsSent] = useState(true);
  const [showpwd, setShowPwd] = useState(false);
  const togglePwdVisib = () => setShowPwd(!showpwd);
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });
  const [state, setState] = useState("reset");

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full opacity-[.50] flex flex-col items-center justify-center"></div>
      <div
        id="card"
        className="w-[380px] fixed top-0 z[1000] h-auto md:w-[400px] mt-8"
      >
        <div className="w-full flex items-start justify-start px-2 py-3">
          <Link href="/">
            <MdOutlineKeyboardBackspace className="text-3xl cursor-pointer text-white-300 p-1 rounded-md " />
          </Link>
        </div>
        <div className="w-full px-3 py-3 mt-1 flex flex-start justify-start flex-col">
          <h2 className="text-white-100 text-3xl veryBold pp-RG">
            Password Reset
          </h2>
          <p className="text-white-200 text-1xl pp-RG mt-2 ">
            Reset your showwcial default password.
          </p>
        </div>
        {false && (
          <div className="w-full mt-7 px-3 py-2 flex flex-col items-center justify-end gap-5">
            <div className="w-full relative flex items-center justify-center mb-3">
              <input
                type="email"
                name="email"
                id="authInput"
                className={`w-full py-4 px-3 text-[12px] bg-dark-100 border-[3px] border-solid border-blue-300 outline-none text-white-100 rounded-md  `}
                placeholder="Showwcase Email"
                //   onKeyUp={handleInput}
              />
            </div>
            <button
              className="w-full rounded-lg  game-btn "
              // disabled={loading}
              // onClick={handleUserLogin}
            >
              <span className="w-full px-4 py-4 text-center flex items-center justify-center text-[14px]  bg-blue-300 shadow-md -translate-y-1.5 hover:-translate-y-2.5 duration-300 text-white-100 rounded-lg ">
                {false ? (
                  <Spinner color="#fff" />
                ) : (
                  <div className="w-full text-center pp-SB flex flex-row items-center justify-center gap-5">
                    <ImageTag
                      src="/images/logos/logo2.png"
                      className="w-[30px] h-[30px] bg-white-100 rounded-[50%] "
                    />
                    <p className="">Continue Password Reset</p>
                  </div>
                )}
              </span>
            </button>
          </div>
        )}
        {false && (
          <div className="w-full mt-7 px-3 py-2 flex flex-col items-center justify-center">
            <IoCheckmarkCircle className="text-green-100" size={35} />
            <p className="text-green-100 pp-SB">Password reset link sent.</p>
            <span
              className="text-white-200 text-[13px] underline mt-5 cursor-pointer pp-RG"
              onClick={() => setIsSent(false)}
            >
              Didn't get the link?
            </span>
          </div>
        )}
        {true && (
          <div className="w-full mt-7 px-3 py-2 flex flex-col items-center justify-end gap-5">
            <div className="relative w-full flex items-center justify-center">
              <input
                type={showpwd ? "text" : "password"}
                name="password"
                id="authInput"
                className={`w-full py-4 px-3 text-[12px] bg-dark-100 border-blue-300 border-[3px] border-solid outline-none text-white-100 rounded-md  `}
                placeholder="New Password"
                //   onKeyUp={handleInput}
              />
              <PasswordToggle state={showpwd} action={togglePwdVisib} />
            </div>
            <button
              className="w-full rounded-lg  game-btn "
              // disabled={loading}
              // onClick={handleUserLogin}
            >
              <span className="w-full px-4 py-4 text-center flex items-center justify-center text-[14px]  bg-blue-300 shadow-md -translate-y-1.5 hover:-translate-y-2.5 duration-300 text-white-100 rounded-lg ">
                {false ? (
                  <Spinner color="#fff" />
                ) : (
                  <div className="w-full text-center pp-SB flex flex-row items-center justify-center gap-5">
                    <ImageTag
                      src="/images/logos/logo2.png"
                      className="w-[30px] h-[30px] rounded-[50%] "
                    />
                    <p className="">Continue Password Reset</p>
                  </div>
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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
