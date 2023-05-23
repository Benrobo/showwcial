import remarkGfm from "remark-gfm";
import ImageTag from "../Image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { IoLink, IoMenuOutline, IoTrash, IoTriangle } from "react-icons/io5";
import { useState } from "react";
import { copyToClipboard, formatStringToMarkdown, isEmpty } from "../../util";
import { toast } from "react-hot-toast";

interface ShowStyleProp {
  title?: string;
  coverImg?: string;
  showId?: string;
  showLink?: string;
  previewState?: boolean;
  readingStats?: string;
  userImage?: string;
  displayName?: string;
  category?: string;
  key?: number;
}

export default function ShowwcaseShowStyle({
  title,
  showId,
  showLink,
  previewState = true,
  displayName,
  userImage,
  category,
  coverImg,
  readingStats,
  key,
}: ShowStyleProp) {
  const [openDW, setOpenDW] = useState(false);
  const threadUrl = showLink ?? "";
  const imageRegex =
    /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp)(\?[^\s]+)?)/gi;
  const validUserImg = imageRegex.test(userImage)
    ? userImage
    : `https://profile-assets.showwcase.com/${userImage}`;

  return (
    <div
      id="triangleUp"
      key={key}
      data-id={showId}
      className="w-[300px] h-auto max-auto flex items-center justify-center flex-col relative bg-dark-300 p-3 rounded-md"
    >
      <div className={`w-full h-[150px] rounded-t-md p-3 show-${showId} `}>
        <style>{`
          .show-${showId}{
            background-image:url(${
              coverImg ??
              "https://project-assets.showwcase.com/4190/1657864017758-CnpG44ZQc.webp"
            });
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
          }
        `}</style>
        {previewState && (
          <div className="absolute top-[-20px] w-full flex items-center justify-center">
            <IoTriangle size={25} className="text-dark-300" />
          </div>
        )}
      </div>
      <div className="w-full flex items-start justify-start">
        {!isEmpty(category) && (
          <span className="px-4 py-2 pp-SB rounded-md bg-dark-100 border-solid border-[.5px] border-white-600 text-white-100 text-[12px] mt-3 ">
            {category ?? "Blog"}
          </span>
        )}
      </div>
      <div className="w-full flex items-start justify-start">
        <div className="w-auto absolute top-0 right-3 flex flex-col items-end justify-end">
          <button
            className="mr-2 mt-3 flex flex-col items-center justify-center"
            onClick={() => setOpenDW(!openDW)}
          >
            <IoMenuOutline className="text-white-200" size={20} />
          </button>
          {openDW && (
            <div className="w-[150px] shadow-2xl rounded-md flex flex-col items-start justify-start bg-dark-100">
              <ul className="p-2 w-full">
                <li
                  onClick={() => {
                    copyToClipboard(threadUrl);
                    toast.success("URL Copied.");
                  }}
                  className="w-full text-white-200 rounded-md p-2 hover:bg-dark-200 pp-SB text-[12px] flex items-center justify-start cursor-pointer"
                >
                  <IoLink size={15} className="mr-3" /> Copy Link
                </li>
                {/* {!previewState && (
                  <li className="w-full text-white-200 rounded-md p-2 hover:bg-dark-200 pp-SB text-[12px] flex items-center justify-start cursor-pointer">
                    <IoTrash size={15} className="mr-3" /> Delete
                  </li>
                )} */}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-auto flex flex-col items-start justify-start">
        <a
          href={showLink ?? "#"}
          className="text-white-100 pp-SB text-[14px] mt-2 hover:underline"
        >
          {title ?? "GraphQL for Beginners: Setting Up GraphQL Server"}
        </a>
        <br />
        <div className="w-full flex items-center justify-start gap-2">
          <ImageTag
            src={
              validUserImg ??
              "https://profile-assets.showwcase.com/4190/1645016832124-profile%2520pic.jpg"
            }
            className={`w-[20px] rounded-[50%]`}
          />
          <span className="text-white-300 pp-RG text-[12px] ">
            {displayName ?? "John Doe"}
          </span>
          <span className="text-white-200 pp-SB ml-2 text-[12px]">
            {readingStats ?? ""}
          </span>
        </div>
      </div>
    </div>
  );
}
