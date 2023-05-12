import { RxLinkBreak2 } from "react-icons/rx";
import Modal from "../Modal";
import ShowwcaseThreadStyle from "./showwcaseThreadStyle";
import { IoBookmark, IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Spinner } from "../Loader";
import Gap from "../Gap";
import { useMutation } from "react-query";
import { bookmarkThread } from "../../http";
import { HandleThreadResponse } from "../../util/response";
import { isEmpty } from "../../util";
import ShowwcaseShowStyle from "./showwcaseShowStyle";

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
  const bookmarkThreadMutation = useMutation(
    async (data: any) => await bookmarkThread(data)
  );

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    const { data, error } = bookmarkThreadMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleThreadResponse(
        response,
        () => bookmarkThreadMutation.reset(),
        () => {}
      );
    }
  }, [bookmarkThreadMutation.data]);

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
    const payload = { threadId };
    bookmarkThreadMutation.mutate(payload);
  }

  return (
    <Modal
      isOpen={true}
      isBlurBg={true}
      showCloseIcon={true}
      onClose={closeActiveThread}
    >
      <div className="w-full h-full flex flex-col items-start justify-center hideScrollbar">
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
              disabled={bookmarkThreadMutation.isLoading ?? loadingState}
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
              userImage={(hubInfo as any)?.user?.profilePictureKey}
              username={(hubInfo as any)?.user?.username}
              threadImages={(hubInfo as any)?.images}
              key={1}
              linkPreviewData={
                (hubInfo as any)?.linkPreviewMeta === "null"
                  ? { url: "", title: "", description: "" }
                  : (hubInfo as any).linkPreviewMeta
              }
            />
          )}
          {Object.entries(hubInfo).length > 0 && hubtype === "show" && (
            <ShowwcaseShowStyle
              displayName={(hubInfo as any)?.user?.displayName}
              previewState={true}
              title={(hubInfo as any)?.title}
              showId={(hubInfo as any)?.id}
              showLink={hubUrl}
              userImage={(hubInfo as any)?.user?.profilePictureKey}
              coverImg={(hubInfo as any)?.coverImage}
              key={1}
            />
          )}

          {(hubInfo as any)?.images?.length > 0 && <Gap height={50} />}

          {Object.entries(hubInfo).length > 0 && (
            <div className="w-full h-auto p-4 flex items-center justify-center gap-3">
              <button
                className="w-[150px] hover:scale-[.96] scale-[1] transition-all bg-blue-300 text-white-100 px-4 py-3 flex items-center justify-center text-[10px] font-pp-sb rounded-[30px] "
                onClick={saveThread}
                disabled={bookmarkThreadMutation.isLoading}
              >
                {bookmarkThreadMutation.isLoading ? (
                  <Spinner color="#fff" />
                ) : (
                  <div className="flex items-center justify-center">
                    <IoBookmark size={10} color="#fff" className="mr-2" />{" "}
                    Bookmark {hubtype === "show" ? "Show" : "Thread"}
                  </div>
                )}
              </button>
            </div>
          )}
          <Gap />
        </div>
      </div>
    </Modal>
  );
}
