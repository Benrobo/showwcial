import React from "react";
import { AiOutlineMail, AiOutlineTwitter } from "react-icons/ai";

function Footer() {
  return (
    <div className="w-full mt-[4rem] bottom-[0px] py-3 bg-dark-500">
      <div className="w-full flex flex-wrap-reverse-none items-center justify-center">
        <div className="w-full px-[2rem] py-3 flex items-start justify-start ">
          <small className="text-1xl text-white-300">
            &copy; {new Date().getFullYear()} showccial.{" "}
          </small>
        </div>
        <div className="w-full px-[2rem] flex items-end justify-end gap-5">
          {/* <a href={socialLinks.socials["twitter"]} target="__blank">
            <AiOutlineTwitter className=" text-[1.2rem] text-white-200 " />
          </a>
          <a href={socialLinks.socials["email"]} target="__blank">
            <AiOutlineMail className=" text-[1.2rem] text-white-200 " />
          </a> */}
        </div>
      </div>
    </div>
  );
}

export default Footer;
