import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RxCaretDown } from "react-icons/rx";
import ImageTag from "../Image";
import { BiCog } from "react-icons/bi";

function TopBar() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const [userInfo, setUserInfo] = useState<any>({});

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userData"));
    setUserInfo(userInfo);
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (scrollY > 30) {
      setIsScrolledPast(true);
    } else {
      setIsScrolledPast(false);
    }
  }, [scrollY]);

  return (
    <div
      className={`w-full h-auto px-7 py-3 border-b-[1px] border-b-white-600 fixed top-0 left-0 z-[200] bg-dark-100 backdrop-blur bg-opacity-75 `}
    >
      <div className="w-full px-[2rem] flex items-center justify-between">
        <div className="w-auto left flex items-center justify-center">
          <div className="w-auto flex items-center justify-center">
            <ImageTag
              src="/images/logos/logo2.png"
              alt="logo"
              className="scale-[1] w-[35px] rounded-[20px] "
            />
            {/* <span className="text-white-200 ml-2 pp-EB text-[13px] ">showccial</span> */}
          </div>
        </div>
        <div className="w-auto left flex items-center justify-center">
          <ul className="ml-[3rem] flex items-center justify-center gap-5">
            <li className="text-white-200 text-[13.5px] pp-RG ">
              <Link href="/">
                <BiCog className=" text-white-100 text-2xl " />
              </Link>
            </li>
            <li className="text-white-200 text-[13.5px] pp-RG flex items-center justify-center ">
              <ImageTag
                src={
                  userInfo?.image ??
                  "https://api.dicebear.com/5.x/micah/svg?seed=Baby"
                }
                className="bg-dark-200 border-solid border-[1px] border-blue-300 rounded-[100%] w-[30px] mr-2 "
              />
              {/* <img
                src="https://api.dicebear.com/5.x/micah/svg?seed=Baby"
                className="bg-dark-200 border-solid border-[1px] border-blue-300 rounded-[100%] w-[30px] mr-2 "
              /> */}
              <div className="right w-auto flex flex-col items-start justify-start">
                <p className="text-white-100 pp-EB">
                  {userInfo?.username ?? "N/A"}
                </p>
                <small className="text-white-200">Developer</small>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TopBar;
