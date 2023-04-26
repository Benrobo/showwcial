import { ReactElement, ReactNode, useContext, useState } from "react";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import ThreadEditor from "../../components/Thread/editor";
import withAuth from "../../util/withAuth";
import DataContext from "../../context/DataContext";
import { MdPostAdd } from "react-icons/md";
import { TbNeedleThread } from "react-icons/tb";
import { BsFillBookmarkCheckFill, BsFillBookmarksFill } from "react-icons/bs";
import BookmarkThread from "../../components/Thread/bookmarkThread";
import ViewBookmarks from "../../components/Thread/viewBookmarks";

function Thread() {
  const {} = useContext(DataContext);
  const [activeComp, setActiveComp] = useState<
    string | "createThread" | "bookmarkThread" | ""
  >("");

  const handleActiveState = (name: string = "") => setActiveComp(name);
  const closeActiveState = () => setActiveComp("");

  let renderedComp = null;

  const renderComp = () => {
    if (activeComp === "createThread") {
      renderedComp = <ThreadEditor closeActiveThread={closeActiveState} />;
    }
    if (activeComp === "bookmarkThread") {
      renderedComp = <BookmarkThread closeActiveThread={closeActiveState} />;
    }
    if (activeComp === "viewBookmark") {
      renderedComp = <ViewBookmarks closeModal={closeActiveState} />;
    }
    return renderedComp;
  };

  return (
    <MainDashboardLayout activeTab="thread">
      <div className="w-full h-auto">
        {["bookmarkThread", "viewBookmark", ""].includes(activeComp) && (
          <div className="w-full flex flex-col items-start justify-start px-6 py-3">
            <p className="text-white-100 font-pp-sb text-[20px]">
              Manage Threads
            </p>
            <p className="text-white-300 font-pp-rg text-[14px]">
              Manage Threads
            </p>
          </div>
        )}
        {["bookmarkThread", "viewBookmark", ""].includes(activeComp) && (
          <div className="w-full mt-9 flex items-center justify-start px-6 gap-5">
            <ThreadFeatures
              label="Create Thread"
              handleActive={() => handleActiveState("createThread")}
              icon={
                <TbNeedleThread
                  size={30}
                  className="text-[30px]"
                  color="#fff"
                />
              }
            />
            <ThreadFeatures
              label="Bookmark Thread"
              handleActive={() => handleActiveState("bookmarkThread")}
              icon={
                <BsFillBookmarkCheckFill
                  size={30}
                  className="text-[30px]"
                  color="#fff"
                />
              }
            />
            <ThreadFeatures
              label="View Bookmark"
              handleActive={() => handleActiveState("viewBookmark")}
              icon={
                <BsFillBookmarksFill
                  size={30}
                  className="text-[30px]"
                  color="#fff"
                />
              }
            />
          </div>
        )}
        {renderComp()}
      </div>
    </MainDashboardLayout>
  );
}

export default withAuth(Thread);

interface ThreadFeatureProp {
  label: string;
  icon: ReactNode;
  handleActive?: () => void;
}

function ThreadFeatures({ label, icon, handleActive }: ThreadFeatureProp) {
  return (
    <button
      onClick={handleActive}
      className="w-auto h-auto bg-blue-300 rounded-lg p-4 px-8 flex flex-col items-center justify-center transition-all hover:scale-[1] scale-[.95] "
    >
      {icon}
      <p className="text-white-100 font-pp-sb text-[12px] mt-2">{label}</p>
    </button>
  );
}
