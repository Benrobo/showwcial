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

interface BookmarkThreadProp {
  closeActiveThread: () => void;
}

export default function BookmarkThread({
  closeActiveThread,
}: BookmarkThreadProp) {
  const [threadUrl, setThreadUrl] = useState("");
  const [threadInfo, setThreadInfo] = useState({});
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

  async function fetchThreadInfo(e: any) {
    if (e.key === "Enter") {
      const url = e.target.value;
      setThreadUrl(url);
      if (!validateUrl(url)) {
        setIsUrlValid(false);
        setShakeInp(true);
        setThreadInfo({});
        return;
      }
      // check if url matches showwcase thread url.
      setThreadInfo({});
      const { hostname } = new URL(url);
      const splittedUrl = url.split("/");
      const threadId = splittedUrl[splittedUrl.length - 1];
      const isValidId = /[0-9]/.test(threadId);
      if (!isValidId || hostname !== "www.showwcase.com") {
        setIsUrlValid(false);
        setShakeInp(true);
        return;
      }
      setIsUrlValid(true);
      try {
        setLoadingState(true);
        const res = await axios.get(
          `https://cache.showwcase.com/threads/${threadId}`
        );
        const fetchData = res?.data ?? (res as any)?.response?.data;
        setLoadingState(false);
        setThreadInfo(fetchData);
      } catch (e: any) {
        toast.error(`Failed: ${e.response?.data?.error}.`);
        setLoadingState(false);
      }
    }
  }

  async function saveThread() {
    const threadId = (threadInfo as any)?.id;
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
          {loadingState ? (
            <div className="w-full h-[100px] flex flex-col items-center justify-center">
              <Spinner color="#3F7EEE" />
            </div>
          ) : (
            Object.entries(threadInfo).length > 0 && (
              <ShowwcaseThreadStyle
                displayName={(threadInfo as any)?.user?.displayName}
                emoji={(threadInfo as any)?.user.activity?.emoji}
                headline={(threadInfo as any)?.user?.headline}
                previewState={true}
                title={(threadInfo as any)?.title}
                threadMessage={(threadInfo as any)?.message}
                threadId={(threadInfo as any)?.id}
                threadLink={threadUrl}
                userImage={(threadInfo as any)?.user?.profilePictureKey}
                username={(threadInfo as any)?.user?.username}
                threadImages={(threadInfo as any)?.images}
                key={1}
                linkPreviewData={
                  (threadInfo as any)?.linkPreviewMeta === "null"
                    ? { url: "", title: "", description: "" }
                    : (threadInfo as any).linkPreviewMeta
                }
              />
            )
          )}
          {(threadInfo as any)?.images?.length > 0 && <Gap height={50} />}
          {Object.entries(threadInfo).length > 0 && (
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
                    Bookmark Thread
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
