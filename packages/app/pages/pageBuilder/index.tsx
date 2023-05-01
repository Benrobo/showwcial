import React, { useState } from "react";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import Gap from "../../components/Gap";
import Modal from "../../components/Modal";
import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
} from "@chakra-ui/react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";
import { SiteInfo } from "./siteInfo";
import Themes from "./theme";

function PortfolioBuilder() {
  return (
    <MainDashboardLayout activeTab="pageBuilder">
      <div className="w-full h-full flex items-start justify-center">
        <div className="w-full h-auto flex flex-col items-start justify-start py-5 px-4 border-r-solid border-r-[1px] border-r-white-600 overflow-y-scroll hideScrollBar border-b-[.5px] border-b-white-600 border-b-solid">
          <div className="flex items-center justify-start gap-5">
            {/* <BsDiscord className="text-blue-300" size={25} /> */}
            <p className="text-white-100 font-pp-eb text-[20px]">
              Page Builder
            </p>
          </div>
          <p className="text-white-300 font-pp-rg text-[13px] mt-2 ">
            Create impressive
            <kbd className="bg-dark-200 font-pp-sb ml-2 mr-2 p-1 text-white-200 rounded-md">
              portfolio
            </kbd>
            site that impress potential clients & customers
          </p>
          <button
            className="px-6 py-3 mt-2 flex items-center justify-center text-white-100 bg-blue-300 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg"
            onClick={() => {}}
          >
            Create Site
          </button>
        </div>
        <CreateSite />
      </div>
    </MainDashboardLayout>
  );
}

export default PortfolioBuilder;

interface CreateSiteProps {
  closeModal?: () => void;
}

function CreateSite({ closeModal }: CreateSiteProps) {
  const [step, setStep] = useState<number>(0);
  let component = null;
  let controlButton = null;

  const next = () => {
    setStep((prev: number) => (prev += 1));
  };

  const prev = () => {
    if (step > 0) {
      setStep((prev: number) => (prev -= 1));
    }
  };

  const renderComponent = (step: number) => {
    switch (step) {
      case 0:
        component = <SiteInfo />;
        break;
      case 1:
        component = <Themes />;
        break;
      case 2:
        // component = <AddNotionPage />;
        break;
      default:
        component = null;
        break;
    }
    return component;
  };

  const renderControlButton = (step: number, nextFunc, prevFunc) => {
    const contBtn = (
      <Button
        bgColor={"#4898f0"}
        textColor="#fff"
        _hover={{
          bg: "#258dfd",
        }}
        rightIcon={<BsArrowRightShort />}
        onClick={nextFunc}
      >
        Continue
      </Button>
    );
    const nextBtn = (
      <Button
        bgColor={"#4898f0"}
        textColor="#fff"
        _hover={{
          bg: "#258dfd",
        }}
        rightIcon={<BsArrowRightShort />}
        onClick={nextFunc}
      >
        {step === 2 ? "Finish" : "Next"}
      </Button>
    );
    const prevBtn = (
      <Button
        bgColor={"#4898f0"}
        textColor="#fff"
        _hover={{
          bg: "#258dfd",
        }}
        leftIcon={<BsArrowLeftShort />}
        onClick={prevFunc}
      >
        Prev
      </Button>
    );

    const flexBtnCombo = (controlButton = (
      <div className="w-auto flex items-center justify-around gap-2">
        {prevBtn}
        {nextBtn}
      </div>
    ));

    switch (step) {
      case 0:
        controlButton = contBtn;
        break;
      case 1:
        controlButton = flexBtnCombo;
        break;
      case 2:
        controlButton = flexBtnCombo;
        break;
      default:
        controlButton = null;
        break;
    }
    return controlButton;
  };

  return (
    <Modal isOpen isBlurBg onClose={closeModal} showCloseIcon>
      <div className="w-full h-full mt-14 flex flex-col items-center justify-center">
        <div className="w-[600px] h-auto  max-h-[450px] rounded-md bg-dark-300 overflow-y-scroll hideScrollBar">
          <div className="w-full flex items-center justify-center p-3  border-b-[.5px] border-b-white-600 border-b-solid">
            <p className="text-white-200 font-pp-sb">Portfolio Builder</p>
          </div>
          <div className="w-full flex flex-col items-start justify-center p-3">
            <div className="w-full px-4 py-5">{renderComponent(step)}</div>
            <div className="w-full h-[70px] flex items-end justify-end px-7 ">
              {renderControlButton(step, next, prev)}
            </div>
            <br />
          </div>
        </div>
      </div>
    </Modal>
  );
}
