import { Button, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import Gap from "../../components/Gap";
import { Spinner } from "../../components/Loader";
import { verifyNotionPage } from "../../http";

type ValidPagePropInfo =
  | "name"
  | "slug"
  | "type"
  | "themeName"
  | "notionPage"
  | "";
interface PageProps {
  savePageInfo: (name: ValidPagePropInfo, value: string) => void;
  pageInfo: any;
}

function AddNotionPage({ savePageInfo, pageInfo }: PageProps) {
  const [loading, setLoading] = useState(false);

  const handleInput = (e: any) => {
    const dataset = e.target?.dataset;
    const name = dataset?.name as ValidPagePropInfo;
    const value = e.target?.value;
    if (typeof name === "undefined") return;
    savePageInfo(name, value);
  };

  const [validData, setValidData] = useState({
    portfolio: {
      name: false,
      description: false,
      tags: false,
      ghUrl: false,
      lvUrl: false,
    },
  });
  let NotionTemplate = "";

  if (pageInfo?.type === "portfolio") {
    NotionTemplate =
      "https://benrobo.notion.site/9875e21da7864b67a24edd0f82b4ec9f?v=7409c57af5674b2e983ff2591dea170b";
  }

  async function verifyNotionUrl() {
    const res = await verifyNotionPage("9875e21da7864b67a24edd0f82b4ec9f");
    console.log(res);
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
            defaultValue={pageInfo?.notionPage}
          />
          <button
            onClick={verifyNotionUrl}
            disabled={loading}
            className="w-[150px] flex flex-col items-center justify-center px-5 py-[12px] border-solid border-[.9px] border-blue-300 rounded-r-[10px] bg-blue-300"
          >
            {loading ? (
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
            <div className="w-full min-h-[90px] flex gap-5 flex-wrap items-start justify-start">
              <p className="text-slate-200 font-pp-sb text-[13px]">Name</p>
              <p className="text-slate-200 font-pp-sb text-[13px]">
                Description
              </p>
              <p className="text-slate-200 font-pp-sb text-[13px]">Tags</p>
              <p className="text-slate-200 font-pp-sb text-[13px]">
                Github Url
              </p>
              <p className="text-slate-200 font-pp-sb text-[13px]">Live Url</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddNotionPage;
