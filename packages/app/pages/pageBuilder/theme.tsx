import { useState } from "react";
import { BiLinkExternal } from "react-icons/bi";

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("");

  const handleThemeSelect = (e) => {
    const themeName = e.target?.dataset;
    if (typeof themeName === "undefined") return;
    const name = themeName["name"];
    if (name === selectedTheme) {
      setSelectedTheme("");
      return;
    }
    setSelectedTheme(name);
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
        {[1, 2, 3].map((d) => (
          <ThemeCards
            selectedTheme={selectedTheme}
            name={"name" + d}
            onClick={handleThemeSelect}
          />
        ))}
      </div>
    </div>
  );
}

interface ThemeProps {
  name?: string;
  id?: string;
  selectedTheme?: string;
  onClick?: (e: any) => void;
}

function ThemeCards({ name, id, selectedTheme, onClick }: ThemeProps) {
  return (
    <div
      className="w-[200px] h-[200px] rounded-[10px] bg-dark-100 relative border-solid border-[3px] border-transparent transition-all cursor-pointer hover:border-blue-300 theme-card "
      style={{
        borderColor: selectedTheme === name ? "#3F7EEE" : "transparent",
      }}
      // onClick={onClick}
      // data-name={name}
    >
      <div
        className="w-full flex items-center theme-bg rounded-[8px]"
        onClick={onClick}
        data-name={name}
      >
        <style>{`
          .theme-bg{
            width: 100%;
            height: 100%;
            background-image:url('./images/themes/demo1.webp');
            background-repeat:no-repeat;
            background-size: 100% 100%;
            border-radius:10px;
          }
        `}</style>
      </div>
      <div className="w-full h-[40px] mt-5 p-2 absolute bottom-0 left-0 flex items-center justify-around backdrop-blur bg-dark-800 theme-info rounded-[10px] ">
        <p className="text-white-100 text-[12px] font-pp-sb ">Template Name</p>
        <a href="" className="text-white-200">
          <BiLinkExternal size={15} color="#fff" />
        </a>
      </div>
    </div>
  );
}
