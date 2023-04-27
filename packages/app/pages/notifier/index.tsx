import { BsDiscord } from "react-icons/bs";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import withAuth from "../../util/withAuth";
import Gap from "../../components/Gap";
import { genRandNum } from "../../util";
import { BiCopy } from "react-icons/bi";
import { Switch } from "@chakra-ui/react";

function Notifier() {
  return (
    <MainDashboardLayout activeTab="notifier">
      <div className="w-full h-full flex items-start justify-center">
        <div className="w-full h-full flex flex-col items-start justify-start py-5 px-4 border-r-solid border-r-[1px] border-r-white-600 overflow-y-scroll hideScrollBar">
          <div className="flex items-center justify-start gap-5">
            <BsDiscord className="text-blue-300" size={25} />
            <p className="text-white-100 font-pp-eb text-[20px]">
              Showwcial Notifier
            </p>
          </div>
          <p className="text-white-300 font-pp-rg text-[13px] mt-2 ">
            Receive updates ranging from
            <kbd className="bg-dark-200 p-1 rounded-md">jobs</kbd>,
            <kbd className="bg-dark-200 p-1 rounded-md">threads</kbd>,{" "}
            <kbd className="bg-dark-200 p-1 rounded-md">shows</kbd> from
            showwcase communities to your personal <b>discord</b> server
            channel. Get started by creating a new notifier variant below.
          </p>
          <br />
          <button className="px-6 py-3 flex items-center justify-center text-white-100 bg-blue-300 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg">
            Create Variant
          </button>
          <br />
          <Gap />
          <div className="w-full flex flex-col items-start justify-start gap-3">
            <NotifierVariant />
          </div>
        </div>

        <div className="w-full h-full flex flex-col items-start justify-start">
          {false && (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-white-200 font-pp-sb text-[14px] ">
                Nothing to show here for now..
              </p>
              <span>😞</span>
            </div>
          )}
          <div className="w-full flex flex-col items-center justify-center px-4 py-4">
            <div className="w-full flex flex-col items-start justify-start gap-4">
              <p className="text-white-300 font-pp-rg">
                NAME:{" "}
                <span className="text-white-200 font-pp-sb ml-5">Test 1</span>
              </p>
              <p className="text-white-300 font-pp-rg">
                Token:
                <span className="text-white-200 font-pp-sb ml-5">
                  {genRandNum(35)}
                </span>
              </p>
              <p className="text-white-300 font-pp-rg">
                Enable:
                <span className="text-white-200 font-pp-sb ml-5">
                  <Switch isChecked={true} />
                </span>
              </p>
              <Gap height={50} />
              <button className="px-6 py-3 flex items-center justify-center text-white-100 bg-red-400 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg">
                Delete Variant
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainDashboardLayout>
  );
}

export default withAuth(Notifier);

function NotifierVariant() {
  return (
    <button className="w-full h-auto flex items-start justify-start bg-dark-300 py-4 px-3 rounded-lg">
      <div className="w-[70px] h-full flex items-center justify-center p-4 rounded-lg border-solid border-[.5px] border-white-600 ">
        <span className="text-2xl">🔥</span>
      </div>
      <div className="w-full flex flex-col items-start justify-start ml-2 gap-2">
        <p className="text-white-100 font-pp-sb text-[14px]">Tests 1</p>
        <div className="w-full flex flex-wrap items-start justify-start gap-2">
          <NotifierTags
            tags={["javascript", "reactjs", "backend", "AI", "LLM"]}
          />
        </div>
      </div>
      <button className="px-3 py-3 flex items-center justify-center border-solid border-[1px] border-white-600 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg">
        <BiCopy color="#ccc" />
      </button>
    </button>
  );
}

type NotifierProp = {
  tags?: string[];
};

function NotifierTags({ tags }: NotifierProp) {
  return (
    <>
      {tags.map((d, i) => (
        <span
          className="px-2 py-1 rounded-md text-[10px] bg-dark-100 text-white-100 border-solid border-[1px] border-blue-300 font-pp-sb"
          key={i}
        >
          {d}
        </span>
      ))}
    </>
  );
}
