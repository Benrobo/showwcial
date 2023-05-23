import React, { useContext, useEffect, useState } from "react";
import { Spinner } from "../../components/Loader";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import ImageTag from "../../components/Image";
import openOAuthWindow from "../../util/openNewWindow";
import { CLIENT_URL } from "../api/config";
import withoutAuth from "../../util/withoutAuth";
import isAuthenticated from "../../util/isAuthenticated";
import DataContext from "../../context/DataContext";

function Login() {
  const [loading, setIsLoading] = useState(false);
  const { setIsOauthWindowOpened } = useContext(DataContext);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const isLoggedIn = isAuthenticated(token);
    if (isLoggedIn) location.href = "/dashboard";
  }, []);

  function handleOAuthMessage(e: any) {
    const userData = e.data;
    if (
      Object.entries(userData).length > 0 &&
      typeof userData["email"] !== "undefined"
    ) {
      setIsLoading(false);
      router.push("/dashboard");
    }
  }

  useEffect(() => {
    // Add event listener to window object
    window.addEventListener("message", handleOAuthMessage);

    // Remove event listener on cleanup
    return () => window.removeEventListener("message", handleOAuthMessage);
  }, []);

  const handleUserLogin = () => {
    openOAuthWindow(
      `${CLIENT_URL}/auth/OAuth`,
      "Login with Showwcase",
      400,
      700
    );
    setIsLoading(true);
    setIsOauthWindowOpened(true);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full h-full opacity-[.50] flex flex-col items-center justify-center"></div>
      <div
        id="card"
        className="w-[380px] fixed top-0 z[1000] h-auto md:w-[400px] mt-8"
      >
        <div className="w-full flex items-start justify-start px-2 py-3">
          <Link href="/auth/register">
            <MdOutlineKeyboardBackspace className="text-3xl cursor-pointer text-white-300 p-1 rounded-md " />
          </Link>
        </div>
        <div className="w-full px-3 py-3 mt-1 flex flex-start justify-start flex-col">
          <h2 className="text-white-100 text-3xl veryBold pp-RG">
            Welcome Back
          </h2>
          <p className="text-white-200 text-1xl pp-RG mt-2 ">
            Let get you logged in.
          </p>
        </div>
        <div className="w-full mt-7 px-3 py-2 flex flex-col items-center justify-end gap-5">
          <button
            className="w-full rounded-lg  game-btn "
            disabled={loading}
            onClick={handleUserLogin}
          >
            <span className="w-full px-4 py-4 text-center flex items-center justify-center text-[14px]  bg-blue-300 shadow-md -translate-y-1.5 hover:-translate-y-2.5 duration-300 text-white-100 rounded-lg ">
              {loading ? (
                <Spinner color="#fff" />
              ) : (
                <div className="w-full text-center pp-SB flex flex-row items-center justify-center gap-5">
                  <ImageTag
                    src="/images/logos/showwcase.png"
                    className="w-[30px] h-[30px] bg-white-100 rounded-[50%] "
                  />
                  <p className="">Continue with Showwcase</p>
                </div>
              )}
            </span>
          </button>
          <div className="w-full h-[100px] flex flex-col items-center justify-center">
            <small className="text-white-100">
              Dont have an account?
              <Link
                className="ml-2 text-white-300 text-[13px] underline "
                href="https://www.showwcase.com/login?type=signin"
                target="_blank"
              >
                Create one
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withoutAuth(Login);

interface TogglePwd {
  state?: boolean;
  action: () => void;
}
