import React, { useState } from "react";
import Modal from "./Modal";

const ACTIVE = true;

function ErrorBanner() {
  const [isOpen, setIsOpen] = useState(false);

  if (!ACTIVE) return null;

  return (
    <div className="w-full  h-auto px-4 py-1 flex items-center justify-center text-start bg-[#ff4741] mb-3 ">
      <span className="pp-SB text-white-100 text-[13px] cursor-pointer">
        Discord Bot is currently down! 😞
      </span>
      <button
        className="px-3 py-[1px] rounded-[5px] border-solid border-[2px] border-white-100 text-[10px] ml-5 text-white-100 "
        onClick={() => setIsOpen(!isOpen)}
      >
        Details
      </button>

      <Modal
        isBlurBg={true}
        isOpen={isOpen}
        showCloseIcon
        fixed
        onClose={() => setIsOpen(!isOpen)}
      >
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-[350px] h-auto rounded-md py-4 flex flex-col items-center justify-start bg-dark-300 ">
            <div className="w-full px-4 border-b-solid border-b-[1px] border-b-white-600 flex flex-col items-start justify-start">
              <p className="pp-SB mb-2 text-white-100 text-[14px]">
                Downtime Notice
              </p>
            </div>
            <br />
            <div className="w-full px-4">
              <p className="text-white-300 text-[13px] pp-RG">
                Showwcial discord bot server provider is currently down and
                under maintenance. Which means, every discord commands and
                interactions used within your personal discord server's would no
                longer work.
              </p>
              <br />
              <p className="text-white-300 text-[13px] pp-RG">
                This is a{" "}
                <span className="text-white-100 pp-SB">temporary</span>{" "}
                downtime. No need to panic. Once the server's are up, you would
                no longer see this message here. Till then,{" "}
                <kbd>Go touch some grass bro 😀.</kbd>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ErrorBanner;
