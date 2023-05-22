import { useState } from "react";
import { BiLinkExternal } from "react-icons/bi";
import themeConfig from "../themes/config.json";
import ImageTag from "../../components/Image";

type ValidPagePropInfo =
  | "name"
  | "slug"
  | "type"
  | "themeName"
  | "notionPageId"
  | "";
interface PageProps {
  savePageInfo: (name: ValidPagePropInfo, value: string) => void;
  pageInfo?: any;
}

export default function Themes({ savePageInfo, pageInfo }: PageProps) {
  const handleThemeSelect = (e) => {
    const themeName = e.target?.dataset;
    if (typeof themeName === "undefined") return;
    const name = themeName["name"];
    if (name === pageInfo?.themeName) {
      savePageInfo("themeName", "");
      return;
    }
    savePageInfo("themeName", name);
  };

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-col items-start justify-center">
        {/* <p className="text-white-200 font-pp-sb">Select Themes</p> */}
        <p className="text-white-300 text-[14px] font-pp-rg">
          Choose the theme that suit your needs.
        </p>
        <br />
      </div>
      <div className="w-full h-auto max-h-[400px] flex flex-wrap items-start justify-start gap-2 hideScrollBar overflow-hidden overflow-y-scroll">
        {themeConfig.themes.map((d) => (
          <ThemeCards
            pageInfo={pageInfo}
            name={d.name}
            onClick={handleThemeSelect}
            image={d.image}
            key={d.id}
            slug={d.slug}
          />
        ))}
      </div>
    </div>
  );
}

interface ThemeProps {
  name?: string;
  slug?: string;
  id?: string;
  image?: string;
  onClick?: (e: any) => void;
  pageInfo?: any;
}

function ThemeCards({ name, id, slug, image, pageInfo, onClick }: ThemeProps) {
  const isSelected = pageInfo?.themeName === slug;

  const themeBgStyle = {
    backgroundImage: `url("${image}")`,
    width: "100%",
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    backgroundPosition: "top",
    borderRadius: "10px",
  };

  return (
    <div
      className={`w-[200px] h-[200px] ${
        isSelected ? "border-blue-300" : "border-transparent"
      } rounded-[10px] bg-dark-100 relative border-solid border-[3px] scale-[.95] hover:scale-[1] transition-all cursor-pointer hover:border-blue-300 theme-card `}
    >
      <div
        className="w-full flex items-center theme-bg rounded-[8px] cursor-pointer"
        onClick={onClick}
        data-name={slug}
        style={themeBgStyle}
      ></div>
      <div className="w-full h-[40px] mt-5 p-2 absolute bottom-0 left-0 flex items-center justify-around backdrop-blur bg-white-600 theme-info rounded-[10px] ">
        <p className="text-white-100 text-[12px] font-pp-sb ">{name}</p>
        <a
          href={`/themes/${slug}?preview=true`}
          target="_blank"
          className="text-white-200"
        >
          <BiLinkExternal size={15} color="#fff" />
        </a>
      </div>
    </div>
  );
}
