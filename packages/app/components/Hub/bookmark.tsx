import { RxLinkBreak2 } from "react-icons/rx";
import Modal from "../Modal";
import ShowwcaseThreadStyle from "./showwcaseThreadStyle";
import { IoBookmark, IoClose, IoCode } from "react-icons/io5";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Spinner } from "../Loader";
import Gap from "../Gap";
import { useMutation } from "react-query";
import { saveToBookmark } from "../../http";
import {
  HandleBookmarkResponse,
  HandleThreadResponse,
} from "../../util/response";
import { genRandNum, isEmpty, sleep } from "../../util";
import ShowwcaseShowStyle from "./showwcaseShowStyle";
import { BiScreenshot } from "react-icons/bi";
import { toPng } from "html-to-image";
import html2canvas from "html2canvas";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

interface BookmarkProp {
  closeActiveThread: () => void;
}

export default function Bookmark({ closeActiveThread }: BookmarkProp) {
  const [hubUrl, setHubUrl] = useState("");
  const [hubtype, setHubType] = useState("");
  const [hubInfo, setHubInfo] = useState({});
  const [isUrlValid, setIsUrlValid] = useState<null | boolean>(null);
  const [shakeInp, setShakeInp] = useState<null | boolean>(null);
  const [loadingState, setLoadingState] = useState(false);
  const bookmarkMutation = useMutation(
    async (data: any) => await saveToBookmark(data)
  );
  const [showShowwcaseLogo, setShowShowwcaseLogo] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement | any>(null);

  const toggleWidget = () => setWidgetOpen(!widgetOpen);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const { data, error } = bookmarkMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleBookmarkResponse(
        response,
        () => bookmarkMutation.reset(),
        () => {},
        () => {}
      );
    }
  }, [bookmarkMutation.data]);

  useEffect(() => {
    // reset shakeInp
    if (shakeInp) {
      setTimeout(() => {
        setShakeInp(null);
      }, 2000);
    }
  }, [shakeInp]);

  const determineUrlType = (url: string) => {
    let response = { type: null, parentId: null };
    if (!validateUrl(url)) {
      setIsUrlValid(false);
      setShakeInp(true);
      setHubInfo({});
      return response;
    }
    const { pathname, hostname } = new URL(url);
    const splittedUrl = pathname.split("/").filter((s) => s?.length > 0);

    if (hostname !== "www.showwcase.com") {
      setIsUrlValid(false);
      setShakeInp(true);
      return response;
    }

    // handle shows
    if (splittedUrl.includes("show") && splittedUrl.length === 3) {
      response["parentId"] = splittedUrl[1];
      response["type"] = "show";
    }
    if (splittedUrl.includes("thread") && splittedUrl.length === 2) {
      response["parentId"] = splittedUrl[1];
      response["type"] = "thread";
    }

    return response;
  };

  async function fetchThreadInfo(e: any) {
    if (e.key === "Enter") {
      const url = e.target.value;
      const { type, parentId } = determineUrlType(url);

      if (isEmpty(type) || isEmpty(parentId)) {
        toast.error(`Invalid Url`);
        return;
      }

      setHubUrl(url);
      setHubInfo({});
      setHubType(type);

      const threadId = parentId;
      const isValidId = /[0-9]/.test(threadId);
      if (!isValidId) {
        setIsUrlValid(false);
        setShakeInp(true);
        return;
      }
      setIsUrlValid(true);
      try {
        setLoadingState(true);
        const reqUrl =
          type === "show"
            ? `https://cache.showwcase.com/projects/${parentId}`
            : `https://cache.showwcase.com/threads/${threadId}`;
        const res = await axios.get(reqUrl);
        const fetchData = res?.data ?? (res as any)?.response?.data;
        setLoadingState(false);
        setHubInfo(fetchData);
        console.log(fetchData);
      } catch (e: any) {
        toast.error(`Failed: ${e.response?.data?.error}.`);
        setLoadingState(false);
      }
    }
  }

  async function saveThread() {
    const threadId = (hubInfo as any)?.id;
    const payload = { id: threadId, type: hubtype };
    bookmarkMutation.mutate(payload);
  }

  const convertJsxToImage = async (node: HTMLDivElement) => {
    setShowShowwcaseLogo(true);
    await sleep(2);
    const canvas = await html2canvas(node, {
      allowTaint: false,
      useCORS: true,
    });
    const dataUrl = canvas.toDataURL("image/png");
    var link = document.createElement("a");
    link.download = `showwcase-${hubtype}-${genRandNum()}.png`;
    link.href = dataUrl;
    link.click();
    setShowShowwcaseLogo(false);
  };

  const convertJsxToImage2 = async (node: HTMLDivElement) => {
    setShowShowwcaseLogo(true);
    await sleep(2);
    toPng(node, { quality: 0.95 }).then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = `showwcase-${hubtype}-${genRandNum()}.png`;
      link.href = dataUrl;
      link.click();
      setShowShowwcaseLogo(false);
    });
  };

  const takeScreenShot = useCallback(() => {
    if (widgetRef.current === null) return;
    toast.promise(convertJsxToImage2(widgetRef.current), {
      success: "Image saved successfully.",
      error: "Something went wrong",
      loading: "Saving Image....",
    });
  }, [widgetRef]);

  return (
    <>
      <Modal
        isOpen={true}
        isBlurBg={true}
        showCloseIcon={true}
        onClose={closeActiveThread}
      >
        <div className="w-full h-screen flex flex-col items-start justify-center ">
          <div className="w-[450px] h-[650px] flex flex-col items-center justify-start ">
            <div
              className={`w-full relative flex items-center justify-start bg-dark-100 rounded-[30px] px-2 py-2 border-solid border-[2px] ${
                shakeInp ? "invalidInput" : ""
              } ${
                isUrlValid || isUrlValid === null
                  ? "border-blue-300"
                  : "border-red-200"
              }  `}
              style={{
                opacity: loadingState ? 0.5 : 1,
              }}
            >
              <RxLinkBreak2 size={40} color="#ccc" className="p-2" />
              <input
                type="url"
                className="w-full outline-none border-none bg-transparent text-white-100"
                placeholder="https://www.showwcase.com/thread/94146"
                onKeyUp={fetchThreadInfo}
                disabled={bookmarkMutation.isLoading ?? loadingState}
              />
            </div>
            <br />
            {loadingState && (
              <div className="w-full h-[100px] flex flex-col items-center justify-center">
                <Spinner color="#3F7EEE" />
              </div>
            )}

            {Object.entries(hubInfo).length > 0 && hubtype === "thread" && (
              <ShowwcaseThreadStyle
                displayName={(hubInfo as any)?.user?.displayName}
                emoji={(hubInfo as any)?.user.activity?.emoji}
                headline={(hubInfo as any)?.user?.headline}
                previewState={true}
                title={(hubInfo as any)?.title}
                threadMessage={(hubInfo as any)?.message}
                threadId={(hubInfo as any)?.id}
                threadLink={hubUrl}
                userImage={(hubInfo as any)?.user?.profilePictureUrl}
                username={(hubInfo as any)?.user?.username}
                threadImages={(hubInfo as any)?.images}
                key={1}
                linkPreviewData={
                  (hubInfo as any)?.linkPreviewMeta === "null"
                    ? { url: "", title: "", description: "" }
                    : isEmpty((hubInfo as any)?.linkPreviewMeta?.project)
                    ? (hubInfo as any).linkPreviewMeta
                    : {
                        url: (hubInfo as any).linkPreviewMeta.project?._self,
                        title: (hubInfo as any).linkPreviewMeta.project?.title,
                        description: (hubInfo as any).linkPreviewMeta.project
                          ?.projectSummary,
                        images: (hubInfo as any).linkPreviewMeta.project
                          ?.coverImageUrl,
                      }
                }
                showShowwcaseLogo={showShowwcaseLogo}
                widgetRef={widgetRef}
              />
            )}
            {Object.entries(hubInfo).length > 0 && hubtype === "show" && (
              <ShowwcaseShowStyle
                displayName={(hubInfo as any)?.user?.displayName}
                previewState={true}
                title={(hubInfo as any)?.title}
                showId={(hubInfo as any)?.id}
                showLink={hubUrl}
                userImage={(hubInfo as any)?.user?.profilePictureUrl}
                coverImg={(hubInfo as any)?.coverImageUrl}
                key={1}
                readingStats={(hubInfo as any)?.readingStats?.text ?? ""}
                showShowwcaseLogo={showShowwcaseLogo}
                widgetRef={widgetRef}
              />
            )}

            {(hubInfo as any)?.images?.length > 0 && <Gap height={20} />}

            {Object.entries(hubInfo).length > 0 && (
              <div className="w-auto h-full fixed top-0 right-0 p-4 flex flex-col items-center justify-center gap-3">
                <button
                  className="w-auto hover:scale-[.96] scale-[1] transition-all bg-blue-300 text-white-100 p-5 flex items-center justify-center text-[10px] pp-SB rounded-[30px] "
                  onClick={saveThread}
                  disabled={bookmarkMutation.isLoading}
                >
                  {bookmarkMutation.isLoading ? (
                    <Spinner color="#fff" />
                  ) : (
                    <div className="flex items-center justify-center">
                      <IoBookmark size={15} color="#fff" className="" />
                    </div>
                  )}
                </button>
                <button
                  className="w-auto hover:scale-[.96] scale-[1] transition-all bg-blue-300 text-white-100 p-4 flex items-center justify-center text-[10px] pp-SB rounded-[30px] "
                  onClick={takeScreenShot}
                >
                  <div className="flex items-center justify-center">
                    <BiScreenshot size={20} color="#fff" className="" />
                  </div>
                </button>
                <button
                  className="w-auto hover:scale-[.96] scale-[1] transition-all bg-blue-300 text-white-100 p-4 flex items-center justify-center text-[10px] pp-SB rounded-[30px] "
                  onClick={toggleWidget}
                >
                  <div className="flex items-center justify-center">
                    <IoCode size={20} color="#fff" className="" />
                  </div>
                </button>
              </div>
            )}
            <Gap />
          </div>
        </div>
      </Modal>
      <EmbedThread
        visible={widgetOpen}
        closeModal={toggleWidget}
        threadId={(hubInfo as any)?.id}
      />
    </>
  );
}

interface EmbedProp {
  visible: boolean;
  closeModal: () => void;
  threadId: number;
}

function EmbedThread({ visible, closeModal, threadId }: EmbedProp) {
  return (
    <Modal isOpen={visible} onClose={closeModal} isBlurBg fixed showCloseIcon>
      <div className="w-full h-screen flex flex-col items-start justify-center ">
        <div className="w-[450px] h-auto bg-dark-300 rounded-md flex flex-col items-center justify-start ">
          <div className="w-full text-center border-b-solid border-b-[.5px] border-b-white-600 p-3 ">
            <p className="text-white-100 pp-SB">Embed Showwcase Thread</p>
          </div>
          <div className="w-full flex flex-col items-start justify-start p-5">
            <p className="text-white-300 pp-RG text-[13px] ">
              Include the following code in the
              <kbd className="bg-blue-300 ml-2 mr-2 text-white-100 px-2 py-1 rounded-md text-[10px] ">
                {"<head />"}
              </kbd>
              section of your site
            </p>
            <br />
            <pre className="px-3 py-2 bg-dark-200 rounded-md break-words whitespace-pre-wrap text-[12px] text-white-200 ">{`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/showwcial-embed/style.css"/>`}</pre>
            <br />
            <p className="text-white-300 pp-RG text-[13px] ">
              Invoke the widget within your application by calling adding the
              following code.
            </p>
            <br />
            <pre className="max-w-full px-3 py-2 bg-dark-200 rounded-md break-words whitespace-pre-wrap text-[12px] text-white-200 ">
              {`<body>

  <div id="unique-id-name"></div>

  <script src="https://cdn.jsdelivr.net/npm/showwcial-embed@0.2.0/index.js"></script>

  <script>
    const embedd = new ShowwcaseEmbed(
      "#unique-id-name",
      [${threadId}] // list of showwcase threads id. you could include one or two threads.
    );
  </script>
</body>`}
            </pre>
          </div>
        </div>
      </div>
    </Modal>
  );
}
