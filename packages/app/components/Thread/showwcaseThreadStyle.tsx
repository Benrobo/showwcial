import remarkGfm from "remark-gfm";
import ImageTag from "../Image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { IoLink, IoMenuOutline, IoTrash, IoTriangle } from "react-icons/io5";
import { useState } from "react";
import { copyToClipboard, formatStringToMarkdown } from "../../util";
import { toast } from "react-hot-toast";

interface ThreadStyleProp {
  title?: string;
  threadMessage?: string;
  threadId?: string;
  threadLink?: string;
  previewState?: boolean;
  userImage?: string;
  username?: string;
  displayName?: string;
  headline?: string;
  emoji?: string;
  threadImages?: string[];
  linkPreviewData?: {
    title: string;
    images: string;
    description: string;
    url: string;
  };
  key?: number;
}

export default function ShowwcaseThreadStyle({
  title,
  threadMessage,
  threadId,
  threadLink,
  previewState = true,
  displayName,
  emoji,
  headline,
  userImage,
  username,
  threadImages,
  linkPreviewData,
  key,
}: ThreadStyleProp) {
  const [openDW, setOpenDW] = useState(false);
  const { finalContent: threadContent, availableImage: threadImage } =
    formatStringToMarkdown(threadMessage ?? "");
  const threadUrl = threadLink ?? "";
  const imageRegex =
    /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp)(\?[^\s]+)?)/gi;
  const validUserImg = imageRegex.test(userImage)
    ? userImage
    : `https://profile-assets.showwcase.com/${userImage}`;

  return (
    <div
      id="triangleUp"
      key={key}
      data-id={threadId}
      className="w-full h-auto flex items-center justify-center flex-col relative bg-dark-300 p-3 rounded-md"
    >
      {previewState && (
        <div className="absolute top-[-20px] w-full flex items-center justify-center">
          <IoTriangle size={25} className="text-dark-300" />
        </div>
      )}
      <div className="w-full flex items-start justify-start">
        <span className="relative w-[48px] h-[48px] ">
          <ImageTag
            src={validUserImg ?? ""}
            className="absolute top-0 left-0 object-cover min-w-[100%] max-w-[100%] max-h-[100%] min-h-[100%] rounded-[50%]"
          />
        </span>
        <div className="w-auto ml-5 flex flex-col items-start justify-start">
          <div className="flex items-start justify-start">
            <p className="text-white-100 font-pp-sb text-[14px] ">
              {displayName}
            </p>
            <p className="text-white-100 font-pp-sb text-[14px] ml-1 mr-1 ">
              {emoji ?? "🚀"}
            </p>
            <p className="text-white-300 font-pp-rg text-[13px] ">
              @{username ?? "jonny54"}
            </p>
          </div>
          <div className="flex items-start justify-start">
            <p className="text-white-200 font-pp-rg text-[14px] ">
              {headline?.slice(0, 35) + "...." ?? "Mobile Engineer"}
            </p>
          </div>
        </div>
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
                  className="w-full text-white-200 rounded-md p-2 hover:bg-dark-200 font-pp-sb text-[12px] flex items-center justify-start cursor-pointer"
                >
                  <IoLink size={15} className="mr-3" /> Copy Link
                </li>
                {/* {!previewState && (
                  <li className="w-full text-white-200 rounded-md p-2 hover:bg-dark-200 font-pp-sb text-[12px] flex items-center justify-start cursor-pointer">
                    <IoTrash size={15} className="mr-3" /> Delete
                  </li>
                )} */}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-auto flex flex-col items-start justify-start">
        <p className="text-white-200 font-pp-sb text-[14px] mt-2 ">
          {title ?? ""}
        </p>
        <div className="text-white-200 font-pp-rg text-[14px] mt-5">
          <ReactMarkdown
            children={threadContent}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          />
          {threadImage?.length > 0 && (
            <ImageTag src={threadImage} className="rounded-[5px] mt-4" />
          )}
          {threadImages?.length > 0 && threadImage?.length === 0 && (
            <ImageTag src={threadImages[0]} className="rounded-[5px] mt-4" />
          )}
          {linkPreviewData?.url !== "" && (
            <a href={linkPreviewData?.url} target="_blank" className="w-full">
              <div className="w-full flex items-start justify-center mt-5 bg-dark-100 p-3 rounded-md">
                <div className="w-full flex flex-col items-start justify-start">
                  <p className="text-white-100 text-[14px]">
                    {linkPreviewData?.title?.slice(0, 30) + "..."}
                  </p>
                  <p className="text-white-300 text-[12px] mt-3 ">
                    {linkPreviewData?.description?.slice(0, 30) + "..."}
                  </p>
                  <p className="text-white-300 text-[12px] mt-3 ">
                    {linkPreviewData?.url?.slice(0, 20) + "..."}
                  </p>
                </div>
                <div className="w-full flex flex-col items-end justify-end">
                  <div
                    className="w-[160px] h-[100px]"
                    style={{
                      backgroundImage: `url("${
                        linkPreviewData?.images ?? linkPreviewData?.images[0]
                      }")`,
                      backgroundSize: "100%",
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
              </div>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
