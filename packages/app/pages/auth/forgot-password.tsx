import { MdOutlineKeyboardBackspace } from "react-icons/md";
import ImageTag from "../../components/Image";
import { Spinner } from "../../components/Loader";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoCheckmark, IoCheckmarkCircle } from "react-icons/io5";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useMutation } from "react-query";
import {
  resetPassword,
  sendResetPwdLink,
  verifyResetPwdLink,
} from "../../http";
import { HandlePasswordResetResponse } from "../../util/response";
import { toast } from "react-hot-toast";
import { isEmpty } from "../../util";

export default function ForgotPassword() {
  const router = useRouter();
  const query = router.query;
  const resetToken = query["token"] ?? "";
  const [isSent, setIsSent] = useState(false);
  const [showpwd, setShowPwd] = useState(false);
  const togglePwdVisib = () => setShowPwd(!showpwd);
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });
  const [resetState, setResetState] = useState<null | string>(null);
  const [tokenVerified, setTokenVerified] = useState(false);
  const [response, setResponse] = useState({
    error: false,
    message: "",
  });
  const verifyResetTokenMutation = useMutation(
    async (data: any) => await verifyResetPwdLink(data)
  );
  const resetPasswordMutation = useMutation(
    async (data: any) => await resetPassword(data)
  );
  const sendResetPwdMutation = useMutation(
    async (data: any) => await sendResetPwdLink(data)
  );

  const codeMessage = {
    USER_NOT_FOUND: "User doesn't exists in our record.",
    INVALID_LINK: "Link is invalid or has expired.",
  };

  const handleInput = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (
      typeof verifyResetTokenMutation.data !== "undefined" ||
      verifyResetTokenMutation.error !== null
    ) {
      const { data } = verifyResetTokenMutation;
      const response = data;
      HandlePasswordResetResponse(
        response,
        () => verifyResetTokenMutation.reset(),
        (data: any) => {
          const code = data?.code;
          if (["INVALID_LINK", "USER_NOT_FOUND"].includes(code)) {
            setResponse({
              error: true,
              message: codeMessage[code] as string,
            });
            return;
          }
          if (code === "VERIFIED") {
            setResponse({ error: false, message: "" });
            setResetState("reset");
            return;
          }
        }
      );
    }
  }, [verifyResetTokenMutation.data]);

  useEffect(() => {
    if (
      typeof resetPasswordMutation.data !== "undefined" ||
      resetPasswordMutation.error !== null
    ) {
      const { data } = resetPasswordMutation;
      const response = data;
      HandlePasswordResetResponse(
        response,
        () => resetPasswordMutation.reset(),
        () => {}
      );
    }
  }, [resetPasswordMutation.data]);

  useEffect(() => {
    if (
      typeof sendResetPwdMutation.data !== "undefined" ||
      sendResetPwdMutation.error !== null
    ) {
      const { data } = sendResetPwdMutation;
      const response = data;
      HandlePasswordResetResponse(
        response,
        () => sendResetPwdMutation.reset(),
        (data: any) => {
          const code = data?.code;
          if (code === "RESET_LINK_SENT") {
            setIsSent(true);
            localStorage.setItem("reset_password_email", inputData?.email);
          }
        }
      );
    }
  }, [sendResetPwdMutation.data]);

  useEffect(() => {
    if (!isEmpty(resetToken)) {
      // setIsSent(true);
      const email = localStorage.getItem("reset_password_email") ?? "";
      const payload = { email, token: resetToken };
      verifyResetTokenMutation.mutate(payload);
    }
  }, [resetToken]);

  const sendPasswordResetLink = () => {
    if (inputData?.email === "") {
      toast.error("email is required.");
      return;
    }
    sendResetPwdMutation.mutate({ email: inputData?.email });
  };

  const resetUserPassword = () => {
    if (isEmpty(inputData.password)) {
      toast.error("password cannot be empty");
      return;
    }
    const payload = {
      email: localStorage.getItem("reset_password_email") ?? "",
      token: resetToken,
      newPassword: inputData?.password,
    };
    resetPasswordMutation.mutate(payload);
  };

  if (verifyResetTokenMutation.isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
        </div>
        {!isSent && isEmpty(resetState) && !response?.error && (
          <div className="w-full mt-7 px-3 py-2 flex flex-col items-center justify-end gap-5">
            <div className="w-full relative flex items-center justify-center mb-3">
              <input
                type="email"
                name="email"
                id="authInput"
                className={`w-full py-4 px-3 text-[12px] bg-dark-100 border-[3px] border-solid border-blue-300 outline-none text-white-100 rounded-md  `}
                placeholder="Showwcial Email"
                onChange={handleInput}
              />
            </div>
            <button
              className="w-full rounded-lg  game-btn "
              disabled={sendResetPwdMutation.isLoading}
              onClick={sendPasswordResetLink}
            >
              <span className="w-full px-4 py-4 text-center flex items-center justify-center text-[14px]  bg-blue-300 shadow-md -translate-y-1.5 hover:-translate-y-2.5 duration-300 text-white-100 rounded-lg ">
                {sendResetPwdMutation?.isLoading ? (
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
        {isSent && isEmpty(resetState) && !response?.error && (
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
        {!isEmpty(resetState) && (
          <div className="w-full mt-7 px-3 py-2 flex flex-col items-center justify-end gap-5">
            <div className="relative w-full flex items-center justify-center">
              <input
                type={showpwd ? "text" : "password"}
                name="password"
                id="authInput"
                className={`w-full py-4 px-3 text-[12px] bg-dark-100 border-blue-300 border-[3px] border-solid outline-none text-white-100 rounded-md  `}
                placeholder="New Password"
                onChange={handleInput}
              />
              <PasswordToggle state={showpwd} action={togglePwdVisib} />
            </div>
            <button
              className="w-full rounded-lg  game-btn "
              disabled={resetPasswordMutation.isLoading}
              onClick={resetUserPassword}
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
                    <p className="">Reset Password</p>
                  </div>
                )}
              </span>
            </button>
          </div>
        )}
        {response?.error && (
          <p className="text-white-100 text-1xl pp-RG px-3 mt-4 ">
            {"❌ " + response?.message}
          </p>
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
