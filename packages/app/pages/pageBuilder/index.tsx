import React, { useEffect, useState } from "react";
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
import SiteInfo from "./siteInfo";
import Themes from "./theme";
import AddNotionPage from "./notionPage";
import { toast } from "react-hot-toast";
import { isEmpty } from "../../util";
import { useMutation } from "react-query";
import { createSite } from "../../http";
import { HandlePageBuilderResponse } from "../../util/response";
import { Spinner } from "../../components/Loader";
import AllSites from "./allSites";

function PortfolioBuilder() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <MainDashboardLayout activeTab="pageBuilder">
      <div className="w-full h-auto flex flex-col items-start justify-center">
        <div className="w-full h-auto flex flex-col items-start justify-start py-3 px-4 border-b-solid border-b-[1px] border-b-white-600 overflow-y-scroll hideScrollBar border-b-solid">
          <div className="flex items-center justify-start gap-5">
            {/* <BsDiscord className="text-blue-300" size={25} /> */}
            <p className="text-white-100 pp-EB text-[20px]">Page Builder</p>
          </div>
          <p className="text-white-300 pp-RG text-[13px] mt-2 ">
            Create impressive
            <kbd className="bg-dark-200 pp-SB ml-2 mr-2 p-1 text-white-200 rounded-md">
              portfolio
            </kbd>
            site that impress potential clients & customers.
          </p>
          <p className="text-white-300 pp-RG text-[13px] mt-2 ">
            Follow this
            <a
              href="https://gist.github.com/Benrobo/e2cba898bdeb786ab73812aa84b8481a"
              target="_blank"
              className="underline ml-1 mr-1 pp-SB text-white-100"
            >
              Guide
            </a>
            on how to setup a site on showwcial from scratch.
          </p>
          <button
            className="px-6 py-3 mt-2 flex items-center justify-center text-white-100 bg-blue-300 scale-[.95] hover:scale-[1] transition-all pp-EB text-[13px] rounded-lg"
            onClick={() => setOpenModal(true)}
          >
            Create Site
          </button>
        </div>
        <Gap height={20} />
        <AllSites />
        {openModal && <CreateSite closeModal={() => setOpenModal(false)} />}
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
  const [pageInfo, setPageInfo] = useState({
    name: "",
    slug: "",
    type: "",
    themeName: "",
    notionPageId: "",
  });
  const createSiteMutation = useMutation(
    async (data) => await createSite(data)
  );

  let component = null;
  let controlButton = null;

  type ValidPagePropInfo =
    | "name"
    | "slug"
    | "type"
    | "themeName"
    | "notionPageId"
    | "";

  const savePageInfo = (name: ValidPagePropInfo, value: string) => {
    setPageInfo((prev) => ({ ...prev, [name]: value }));
  };
  const [isNotionVerified, setIsNotionVerified] = useState(false);

  const handlePageVerification = (step: number) => {
    if (step === 0) {
      if (isEmpty(pageInfo?.name)) {
        toast.error("Site name cant be empty.");
        return false;
      }
      if (isEmpty(pageInfo?.type)) {
        toast.error("Page Type cant be empty.");
        return false;
      }
      if (isEmpty(pageInfo?.slug)) {
        toast.error("Slug cant be empty.");
        return false;
      }
      return true;
    }
    if (step === 1) {
      if (isEmpty(pageInfo?.themeName)) {
        toast.error("Select atleast one theme.");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (isEmpty(pageInfo?.notionPageId)) {
        toast.error("Notion page can't be empty.");
        return false;
      }
      return true;
    }
  };

  const next = () => {
    if (createSiteMutation.isLoading) return;
    const successfulVerification = handlePageVerification(step);
    if (!successfulVerification) return;
    if (step <= 1) setStep((prev: number) => (prev += 1));
    if (step === 2 && !isNotionVerified) {
      toast.error("Please verify notion page first.");
      return;
    }
    if (step === 2 && isNotionVerified) createShowwcialPage();
  };

  const prev = () => {
    if (createSiteMutation.isLoading) return;
    if (step > 0) {
      setStep((prev: number) => (prev -= 1));
    }
  };

  const renderComponent = (step: number) => {
    switch (step) {
      case 0:
        component = (
          <SiteInfo savePageInfo={savePageInfo} pageInfo={pageInfo} />
        );
        break;
      case 1:
        component = <Themes savePageInfo={savePageInfo} pageInfo={pageInfo} />;
        break;
      case 2:
        component = (
          <AddNotionPage
            savePageInfo={savePageInfo}
            pageInfo={pageInfo}
            setIsNotionVerified={setIsNotionVerified}
          />
        );
        break;
      default:
        component = null;
        break;
    }
    return component;
  };

  function createShowwcialPage() {
    createSiteMutation.mutate(pageInfo as any);
  }

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
        rightIcon={!createSiteMutation.isLoading && <BsArrowRightShort />}
        onClick={nextFunc}
        disabled={createSiteMutation.isLoading}
        cursor={createSiteMutation.isLoading && "not-allowed"}
      >
        {step === 2 ? (
          <div className="flex items-center justify-center">
            {createSiteMutation.isLoading ? <Spinner color="#fff" /> : "Finish"}
          </div>
        ) : (
          "Next"
        )}
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
        disabled={createSiteMutation.isLoading}
        cursor={createSiteMutation.isLoading && "not-allowed"}
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

  useEffect(() => {
    const { data, error } = createSiteMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandlePageBuilderResponse(
        response,
        () => {},
        () => {},
        () => {
          closeModal();
          location && location.reload();
        }
      );
    }
  }, [createSiteMutation.data]);

  return (
    <Modal isOpen isBlurBg onClose={closeModal} showCloseIcon>
      <div className="w-full h-full mt-10 flex flex-col items-center justify-center">
        <div className="w-[700px] h-auto rounded-md bg-dark-300 overflow-y-scroll hideScrollBar">
          <div className="w-full flex items-center justify-center p-3  border-b-[.5px] border-b-white-600 border-b-solid">
            <p className="text-white-200 pp-SB">Portfolio Builder</p>
          </div>
          <div className="w-full flex flex-col items-start justify-center p-3">
            <div className="w-full h-auto px-2 py-5">
              {renderComponent(step)}
            </div>
            <div className="w-full h-[10px] mt-2 flex items-center justify-end px-7 ">
              {renderControlButton(step, next, prev)}
            </div>
            <br />
          </div>
        </div>
      </div>
    </Modal>
  );
}
