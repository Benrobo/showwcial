import { IoClose } from "react-icons/io5";
import Modal from "../Modal";
import { IconButton } from "@chakra-ui/react";
import Gap from "../Gap";
import { useEffect, useState } from "react";
import ShowwcaseThreadStyle from "./showwcaseThreadStyle";
import { useMutation, useQuery } from "react-query";
import { fetchAllBookmarks } from "../../http";
import { useRouter } from "next/router";
import { HandleBookmarkResponse } from "../../util/response";
import { LoaderModal, Spinner } from "../Loader";
import ShowwcaseShowStyle from "./showwcaseShowStyle";

interface ViewBookmarkThreadProp {
  closeModal: () => void;
}

function ViewBookmarks({ closeModal }: ViewBookmarkThreadProp) {
  const [activeView, setActiveView] = useState("thread");
  const [bookmarkData, setBookmarkData] = useState([]);
  const [initFetched, setInitFetched] = useState(true);
  const router = useRouter();
  const queryParam = router.query["type"] ?? activeView;
  const fetchBookmarkMutation = useMutation(
    async (data: string) => await fetchAllBookmarks(data as any)
  );

  useEffect(() => {
    fetchBookmarkMutation.mutate(queryParam as string);
  }, []);

  useEffect(() => {
    const { data, error } = fetchBookmarkMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleBookmarkResponse(
        response,
        () => {},
        () => {},
        (data) => {
          console.log(data);
          setBookmarkData(data);
        }
      );
    }
  }, [fetchBookmarkMutation.data]);

  return (
    <div className="w-full h-full absolute bg-dark-100 left-0 top-0 flex flex-col items-start justify-start">
      <div className="absolute top-5 right-0 p-1 z-[70]">
        {/* @ts-ignore */}
        <IconButton
          aria-label="close"
          className="mt-5 mr-5 bg-dark-405"
          bgColor={"rgb(18, 21, 26,.5)"}
          textColor="#fff"
          _hover={{ bg: "#20222C" }}
          icon={<IoClose />}
          onClick={closeModal}
        />
      </div>
      <div className="w-full flex flex-col items-start justify-start relative top-10">
        <div className="w-full flex flex-col items-start justify-start px-4">
          <p className="text-white-100 font-pp-sb">View Saved Bookmarks</p>
          <Gap height={20} />
          <div className="w-full flex items-start justify-start gap-4">
            <button
              onClick={() => {
                setActiveView("thread");
                fetchBookmarkMutation.mutate("thread");
              }}
              className={`w-auto h-auto ${
                activeView === "thread" ? "bg-blue-300" : "bg-dark-300"
              } px-5 py-3 rounded-[10px] flex flex-col items-center justify-center transition-all hover:scale-[1] scale-[.95] `}
            >
              <p className="text-white-100 font-pp-sb text-[12px]">Threads</p>
            </button>
            <button
              onClick={() => {
                setActiveView("show");
                fetchBookmarkMutation.mutate("thread");
              }}
              className={`w-auto h-auto ${
                activeView === "show" ? "bg-blue-300" : "bg-dark-300"
              } px-5 py-3 rounded-[10px] flex flex-col items-center justify-center transition-all hover:scale-[1] scale-[.95] `}
            >
              <p className="text-white-100 font-pp-sb text-[12px]">Shows</p>
            </button>
          </div>
        </div>
        <Gap />
        <div className="w-full h-full px-5 flex flex-wrap items-start justify-start gap-2">
          {fetchBookmarkMutation.isLoading && (
            <LoaderModal position="absolute" />
          )}

          {fetchBookmarkMutation.isLoading === false &&
            bookmarkData.length > 0 &&
            bookmarkData.map((data, i) => {
              if (data?.type === "thread") {
                return (
                  <div className="w-[370px]">
                    <ShowwcaseThreadStyle
                      displayName={(data as any)?.displayName}
                      emoji={(data as any)?.emoji}
                      headline={(data as any)?.headline}
                      previewState={false}
                      title={(data as any)?.title}
                      threadMessage={(data as any)?.content}
                      threadId={(data as any)?.threadId}
                      threadLink={`https://www.showwcase.com/thread/${data?.threadId}`}
                      userImage={(data as any)?.userImage}
                      username={(data as any)?.username}
                      threadImages={
                        typeof data?.images === "string"
                          ? JSON.parse((data as any)?.images)
                          : data?.images
                      }
                      linkPreviewData={
                        data?.linkPreviewMeta === "null"
                          ? null
                          : data?.linkPreviewMeta
                      }
                      key={i}
                    />
                  </div>
                );
              } else {
                return (
                  <div className="w-[370px]">
                    <ShowwcaseShowStyle
                      displayName={(data as any)?.displayName}
                      previewState={false}
                      title={(data as any)?.title}
                      showId={(data as any)?.threadId}
                      showLink={`https://www.showwcase.com/thread/${data?.threadId}`}
                      userImage={(data as any)?.userImage}
                      coverImg={data?.coverImage}
                      key={i}
                    />
                  </div>
                );
              }
            })}
          {fetchBookmarkMutation.isLoading === false &&
          bookmarkData.length === 0 ? (
            <div className="w-full h-full mt-20 flex flex-col items-center justify-center">
              <p className="text-white-200 font-pp-rg">
                No Bookmark Data Available. 😞
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ViewBookmarks;
