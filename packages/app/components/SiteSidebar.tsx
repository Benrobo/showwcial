import { IconButton, Input } from "@chakra-ui/react";
import Modal from "./Modal";
import { IoClose } from "react-icons/io5";
import Gap from "./Gap";
import { useState } from "react";
import { isEmpty } from "../util";

interface SiteSidebarProps {
  closeSidebar: () => void;
  visible: boolean;
  siteId: string;
  selectedSite: any;
}

export default function SiteSideBar({
  closeSidebar,
  visible,
  siteId,
  selectedSite,
}: SiteSidebarProps) {
  const createdSiteId = siteId;
  const siteData = selectedSite?.portfolioData;
  const tagline = siteData?.tagline;
  const headline = siteData?.headline;
  const MAX_CHAR = 150;
  const [inpData, setInpData] = useState({
    tagline: tagline,
    headline: headline,
  });

  const handleInput = (e: any) => {
    const dataset = e?.target?.dataset;
    const value = e.target?.value;
    const name = dataset?.name;
    if (isEmpty(name)) return;
    setInpData((prev: any) => ({ ...prev, [name]: value }));
  };

  function saveChanges() {
    console.log(inpData);
  }

  return (
    <div
      className={`${
        visible ? "w-full" : "w-[0px]"
      } w-full overflow-x-hidden h-full opacity-85 backdrop-blur-[10px] bg-dark-600 transition-all absolute top-0 right-0 flex items-end justify-end`}
    >
      <div className="w-auto min-w-[450px] max-w-[750px] h-full bg-dark-300 px-8 py-3 flex items-start justify-start flex-col ">
        {/* Close Button */}
        <div className="w-full mt-2 flex items-end justify-end ">
          <IconButton
            aria-label="close"
            className="mt-5 bg-dark-405 border-solid border-[.6px] border-white-600 "
            bgColor={"rgb(18, 21, 26,.5)"}
            textColor="#fff"
            _hover={{ bg: "#20222C" }}
            icon={<IoClose />}
            onClick={closeSidebar}
          />
        </div>
        <Gap height={20} />
        {/* Tagline and Headline */}
        <div className="w-full flex flex-col items-start justify-start">
          <div className="w-full flex items-start justify-start mb-1">
            <span className="text-white-400 font-pp-rg text-[13px]">
              Tagline (Max: {MAX_CHAR})
            </span>
          </div>
          <input
            className="w-full py-[14px] rounded-[10px] outline-none border-[1px] border-solid border-white-500 px-4 text-slate-100 font-pp-rg bg-dark-100 text-[13px] "
            placeholder="Tagline"
            onChange={handleInput}
            value={inpData?.tagline}
            // value={tagline}
            data-name="tagline"
          />
          <br />
          <div className="w-full flex items-start justify-start mb-1">
            <span className="text-white-400 font-pp-rg text-[13px]">
              Headline (Max: {MAX_CHAR})
            </span>
          </div>
          <input
            className="w-full py-[14px] rounded-[10px] outline-none border-[1px] border-solid border-white-500 px-4 text-slate-100 font-pp-rg bg-dark-100 text-[13px] "
            placeholder="Headline"
            onChange={handleInput}
            value={inpData?.headline}
            // value={pageInfo?.notionPageId}
            // value={headline}
            data-name="headline"
          />
          <br />
          <Gap height={60} />
          <div className="w-full flex items-center justify-between">
            <button
              onClick={saveChanges}
              // disabled={verifyNotionMutation?.isLoading}
              className="w-[150px] flex flex-col items-center justify-center px-5 py-[12px] border-solid border-[.9px] border-blue-300 rounded-[10px] bg-blue-300"
            >
              {/* {verifyNotionMutation?.isLoading ? (
              <Spinner color="#fff" />
            ) : (
              <span className="text-[12px] p-[3px] font-pp-sb text-white-100">
                Verify Page
              </span>
            )} */}
              <span className="text-[12px] p-[3px] font-pp-sb text-white-100">
                Save Changes
              </span>
            </button>

            <button
              // onClick={verifyNotionUrl}
              // disabled={verifyNotionMutation?.isLoading}
              className="w-[150px] flex flex-col items-center justify-center px-5 py-[12px] border-solid border-[.9px] border-red-200 rounded-[10px] bg-red-100"
            >
              {/* {verifyNotionMutation?.isLoading ? (
              <Spinner color="#fff" />
            ) : (
              <span className="text-[12px] p-[3px] font-pp-sb text-white-100">
                Verify Page
              </span>
            )} */}
              <span className="text-[12px] p-[3px] font-pp-sb text-white-100">
                Delete Site
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
