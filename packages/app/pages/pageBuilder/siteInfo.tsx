import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsArrowLeftShort, BsArrowRightShort } from "react-icons/bs";

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

export function SiteInfo({ savePageInfo, pageInfo }: PageProps) {
  const handleInput = (e: any) => {
    const dataset = e.target?.dataset;
    const name = dataset?.name as ValidPagePropInfo;
    const value = e.target?.value;
    if (typeof name === "undefined") return;
    savePageInfo(name, value);
  };

  return (
    <div className="w-full flex flex-col items-start justify-center p-3">
      <div className="w-full flex items-center justify-between gap-2">
        <input
          type="text"
          className="w-full border-[1px] border-solid border-white-600 p-3 font-pp-rg bg-dark-100 rounded-md outline-none text-[13px] text-white-200"
          placeholder="Name"
          data-name="name"
          onChange={handleInput}
          // value={nameInp}
          value={pageInfo?.name}
        />
        <select
          className="w-full border-[1px] border-solid border-white-600 p-3 font-pp-rg bg-dark-100 rounded-md outline-none text-[13px] text-white-200"
          data-name="type"
          onChange={handleInput}
          // disabled={createVariantMutation.isLoading}
        >
          <option value="">Select page type</option>
          <option value="portfolio">Portfolio</option>
          <option value="linkInBio" disabled>
            Link-in-Bio
          </option>
          <option value="jobs" disabled>
            Jobs
          </option>
        </select>
      </div>
      <br />
      <InputGroup border="none" size={"lg"}>
        <InputLeftAddon
          children="showwcial.vercel.app/portfolio/"
          bgColor={"#131418"}
          textColor="#777"
          borderWidth={"1px"}
          borderColor={"rgba(255,255,255,0.08)"}
          fontSize="14px"
          pointerEvents={"none"}
          className="select-none font-pp-rg cursor-pointer"
        />
        <Input
          placeholder="slug"
          textColor="#fff"
          borderWidth={"1px"}
          borderColor={"rgba(255,255,255,0.08)"}
          _focus={{ border: "none", borderColor: "transparent" }}
          _hover={{ borderColor: "rgba(255,255,255,0.08)", bg: "none" }}
          fontSize="14px"
          className="font-pp-rg"
          data-name="slug"
          onChange={handleInput}
          value={pageInfo?.slug}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="1.75rem"
            size="sm"
            bgColor={"transparent"}
            onClick={() => {}}
            _hover={{ bgColor: "transparent" }}
            cursor="auto"
          >
            {/* <AiFillCheckCircle className="text-green-500" /> */}
          </Button>
        </InputRightElement>
      </InputGroup>
    </div>
  );
}
