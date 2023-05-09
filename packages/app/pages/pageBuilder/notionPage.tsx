import { Button, Input } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Gap from "../../components/Gap";
import { Spinner } from "../../components/Loader";
import { verifyNotionPage } from "../../http";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";
import { HandlePageBuilderResponse } from "../../util/response";
import { ImCheckboxChecked } from "react-icons/im";
import { IoClose } from "react-icons/io5";

type ValidPagePropInfo =
  | "name"
  | "slug"
  | "type"
  | "themeName"
  | "notionPageId"
  | "";
interface PageProps {
  savePageInfo: (name: ValidPagePropInfo, value: string) => void;
  pageInfo: any;
  setIsNotionVerified: (val: boolean) => void;
}

function AddNotionPage({
  savePageInfo,
  pageInfo,
  setIsNotionVerified,
}: PageProps) {
  const [inpVal, setInpVal] = useState("");
  const verifyNotionMutation = useMutation(
    async (data) => await verifyNotionPage(data as any)
  );
  const [verified, setVerified] = useState<null | boolean>(null);

  const handleInput = (e: any) => {
    const value = e.target?.value;
    setInpVal(value);
  };
  const [validPortfolioData, setValidPortfolioData] = useState({
    name: false,
    description: false,
    tags: false,
    ghUrl: false,
    lvUrl: false,
    image: false,
  });

  let NotionTemplate = "";

  if (pageInfo?.type === "portfolio") {
    NotionTemplate =
      "https://benrobo.notion.site/9875e21da7864b67a24edd0f82b4ec9f?v=7409c57af5674b2e983ff2591dea170b";
  }

  function extractIdFromUrl(notionPage: string) {
    try {
      const url = new URL(notionPage);
      const pathname = url?.pathname.replaceAll("/", "").split("-");
      const notionId = pathname[pathname.length - 1];
      return notionId;
    } catch (e: any) {
      // toast.error("Url is invalid");
      return null;
    }
  }

  useEffect(() => {
    const { data, error } = verifyNotionMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandlePageBuilderResponse(
        response,
        () => {},
        (data) => {
          const validCols = [
            "Github Url",
            "Description",
            "Tags",
            "Live Url",
            "Image",
            "Name",
          ].map((d) => d.toLowerCase());
          let validCount = 0;
          let idx = 0;

          while (idx <= validCols.length) {
            const lowerD = data.map((d) => d?.toLowerCase());
            if (validCols.includes(lowerD[idx])) validCount++;
            idx++;
          }

          data.forEach((d) => {
            const lowerD = d.toLowerCase();
            if (lowerD === "github url") {
              setValidPortfolioData((prev) => ({ ...prev, ["ghUrl"]: true }));
            }
            if (lowerD === "description") {
              setValidPortfolioData((prev) => ({
                ...prev,
                ["description"]: true,
              }));
            }
            if (lowerD === "tags") {
              setValidPortfolioData((prev) => ({ ...prev, ["tags"]: true }));
            }
            if (lowerD === "live url") {
              setValidPortfolioData((prev) => ({ ...prev, ["lvUrl"]: true }));
            }
            if (lowerD === "image") {
              setValidPortfolioData((prev) => ({ ...prev, ["image"]: true }));
            }
            if (lowerD === "name") {
              setValidPortfolioData((prev) => ({ ...prev, ["name"]: true }));
            }
          });

          if (validCount === validCols.length) {
            setVerified(true);
            setIsNotionVerified(true);
          } else {
            setVerified(false);
            setIsNotionVerified(false);
          }
        },
        () => {}
      );
    }
  }, [verifyNotionMutation.data]);

  function verifyNotionUrl() {
    try {
      const url = new URL(inpVal);
      const pathname = url?.pathname
        .split("/")
        .map((d) => (d.includes("-") ? d.split("-") : d));
      let hasWeirdString = pathname.length > 2 ? pathname[2] : pathname[1];
      const notionId =
        typeof hasWeirdString === "string"
          ? hasWeirdString
          : hasWeirdString[hasWeirdString?.length - 1];
      savePageInfo("notionPageId", notionId);
      setValidPortfolioData({
        description: false,
        ghUrl: false,
        image: false,
        lvUrl: false,
        name: false,
        tags: false,
      });
      setVerified(null);
      verifyNotionMutation.mutate({ id: notionId } as any);
    } catch (e: any) {
      console.log(e);
      toast.error("invalid url");
    }
  }

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-col items-start justify-center">
        <p className="text-white-200 font-pp-sb">Add Notion Page</p>
        <p className="text-white-300 text-[14px] font-pp-rg">
          Add a notion page which would be used for your portfolio projects.
        </p>
        <br />
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full flex items-start justify-start">
          {/* @ts-ignore */}
          <input
            className="w-full py-[14px] rounded-l-[10px] outline-none border-[1px] border-solid border-blue-300 px-4 text-slate-100 font-pp-rg bg-dark-100 text-[13px] "
            placeholder="https://benrobo.notion.site/Portfolio-f8dec7f670154145a0a0dc04fd07961f"
            onChange={handleInput}
            // defaultValue={inpVal}
            // value={pageInfo?.notionPageId}
            value={inpVal}
            data-name="notionPageId"
          />
          <button
            onClick={verifyNotionUrl}
            disabled={verifyNotionMutation?.isLoading}
            className="w-[150px] flex flex-col items-center justify-center px-5 py-[12px] border-solid border-[.9px] border-blue-300 rounded-r-[10px] bg-blue-300"
          >
            {verifyNotionMutation?.isLoading ? (
              <Spinner color="#fff" />
            ) : (
              <span className="text-[12px] p-[3px] font-pp-sb text-white-100">
                Verify Page
              </span>
            )}
          </button>
        </div>
        <Gap height={30} />
      </div>
      <div className="w-full flex flex-col items-start justify-start">
        <div className="w-full h-auto">
          <div className="w-full flex flex-col items-start justify-start">
            <p className="text-slate-200 font-pp-rg text-[13px] ">
              Use this{" "}
              <a
                href={NotionTemplate}
                target="_blank"
                className="text-white-100 underline mr-2"
              >
                Notion Template
              </a>
              as a guide. It should include the following <kbd>rows</kbd> below.
            </p>
          </div>
          <br />
          {/* Portfolio Type */}
          {pageInfo?.type === "portfolio" && (
            <div
              className={`w-full min-h-[90px] flex gap-5 flex-wrap items-start justify-start ${
                verifyNotionMutation?.isLoading
                  ? "animate-pulse"
                  : "animate-none"
              } `}
            >
              <p className="text-slate-200 font-pp-sb text-[13px] flex items-center justify-center">
                Name
                <ValidIconState
                  valid={validPortfolioData?.name}
                  verified={verified}
                />
              </p>
              <p className="text-slate-200 font-pp-sb text-[13px] flex items-center justify-center">
                Description
                <ValidIconState
                  valid={validPortfolioData?.description}
                  verified={verified}
                />
              </p>
              <p className="text-slate-200 font-pp-sb text-[13px] flex items-center justify-center">
                Tags
                <ValidIconState
                  valid={validPortfolioData?.tags}
                  verified={verified}
                />
              </p>
              <p className="text-slate-200 font-pp-sb text-[13px] flex items-center justify-center">
                Github Url
                <ValidIconState
                  valid={validPortfolioData?.ghUrl}
                  verified={verified}
                />
              </p>
              <p className="text-slate-200 font-pp-sb text-[13px] flex items-center justify-center">
                Live Url
                <ValidIconState
                  valid={validPortfolioData?.lvUrl}
                  verified={verified}
                />
              </p>
              <p className="text-slate-200 font-pp-sb text-[13px] flex items-center justify-center">
                Image
                <ValidIconState
                  valid={validPortfolioData?.image}
                  verified={verified}
                />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddNotionPage;

interface ValidIconState {
  valid: boolean;
  verified: boolean;
}

function ValidIconState({ valid, verified }: ValidIconState) {
  return (
    <>
      {valid ? (
        <ImCheckboxChecked
          color={verified !== null ? (valid ? "#05ff82" : "#777") : "#777"}
          className="ml-2"
          size={12}
        />
      ) : (
        <IoClose
          color={verified !== null ? (valid ? "#ff0000" : "#7777") : "#7777"}
          className="ml-2"
          size={12}
        />
      )}
    </>
  );
}
