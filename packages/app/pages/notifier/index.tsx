import { BsDiscord } from "react-icons/bs";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import withAuth from "../../util/withAuth";
import Gap from "../../components/Gap";
import { genRandNum } from "../../util";
import { BiCopy } from "react-icons/bi";
import { Switch } from "@chakra-ui/react";
import Modal from "../../components/Modal";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function Notifier() {
  const [showCreateVariant, setShowCreateVariant] = useState(false);

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
          <button
            className="px-6 py-3 flex items-center justify-center text-white-100 bg-blue-300 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg"
            onClick={() => setShowCreateVariant(!showCreateVariant)}
          >
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

      {showCreateVariant && (
        <CreateVariant
          closeModal={() => setShowCreateVariant(!showCreateVariant)}
        />
      )}
    </MainDashboardLayout>
  );
}

export default withAuth(Notifier);

interface CreateVariantProp {
  closeModal?: () => void;
}

function CreateVariant({ closeModal }: CreateVariantProp) {
  const [loadingState, setLoadingState] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [activeCommunities, setActiveCommunities] = useState<
    { name: string; slug: string }[]
  >([]);
  const [variantData, setVariantData] = useState({
    type: "",
    name: "",
    icon: "",
    tags: [],
    communities: [],
  });

  const limitSelection = (e: ChangeEvent, limit: number = 5) => {
    const options = (e.target as any).options;
    let selectedCount = 0;

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedCount++;
      }
    }

    for (let i = 0; i < options.length; i++) {
      if (!options[i].selected && selectedCount >= limit) {
        options[i].disabled = true;
      } else {
        options[i].disabled = false;
      }
    }
  };

  const fetchTagAndCommunities = async () => {
    try {
      setLoadingState(true);
      const baseUrl = "https://cache.showwcase.com";
      const comm = await axios
        .get(`${baseUrl}/communities/active?limit=100`)
        .then((r) => r.data);

      setLoadingState(false);

      let filteredTags = [];

      const filteredCommNames = comm.map(
        (data: any) =>
          data.name?.length > 0 &&
          data?.slug?.length > 0 && { name: data?.name, slug: data?.slug }
      );

      comm.forEach((commData: any) => {
        if (commData?.tags?.length > 0) {
          commData?.tags
            .map((tag: any) => tag?.tagDescription)
            .forEach((tg: string) => {
              if (!filteredTags.includes(tg)) {
                filteredTags.push(tg.replace("#", ""));
              }
            });
        }
      });

      setActiveCommunities(filteredCommNames);
      setAllTags(filteredTags);
    } catch (e: any) {
      setLoadingState(false);
      console.log(e);
      toast.error(`Something went wrong.`);
    }
  };

  const handleInput = (e: any, type: string) => {
    if (type === "multiple") {
      const selectedOptions = [];
      const options = e.target.options;
      const { name } = e.target?.dataset;

      for (let i = 0; i < options.length; i++) {
        const option = options[i];

        if (option.selected) {
          selectedOptions.push(option.value);
        }
        setVariantData((prev: any) => ({ ...prev, [name]: selectedOptions }));
      }
    }
    if (["icon", "name", "type"].includes(type)) {
      const { name } = e.target?.dataset;
      const value = e.target?.value;
      setVariantData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    fetchTagAndCommunities();
  }, []);

  async function saveVariant() {
    console.log(variantData);
  }

  return (
    <Modal isBlurBg isOpen={true} showCloseIcon onClose={closeModal}>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-[450px] h-auto bg-dark-300 rounded-md flex flex-col items-start justify-start">
          <div className="w-full h-aut p-3 flex flex-col items-start justify-start border-b-solid border-b-[1px] border-b-white-600 ">
            <p className="text-white-200 font-pp-sb text-[14px] ">
              Create Variant
            </p>
          </div>
          <br />
          <div className="w-full flex p-3">
            <select
              className="w-full border-[1px] border-solid border-white-600 p-3 font-pp-rg bg-dark-100 rounded-md outline-none text-[13px] text-white-200"
              data-name="type"
              onChange={(e) => handleInput(e, "type")}
            >
              <option value="">Select type</option>
              <option value="thread">Thread</option>
              <option value="shows" disabled>
                Shows
              </option>
              <option value="jobs" disabled>
                Jobs
              </option>
            </select>
          </div>
          <div className="w-full flex flex-col items-start justify-start p-3">
            <div className="w-full flex items-center justify-between gap-2">
              <input
                type="text"
                className="w-full border-[1px] border-solid border-white-600 p-3 font-pp-rg bg-dark-100 rounded-md outline-none text-[13px] text-white-200"
                placeholder="Name"
                data-name="name"
                onChange={(e) => handleInput(e, "name")}
              />
              <select
                className="w-[100px] border-[1px] border-solid border-white-600 p-3 font-pp-rg bg-dark-100 rounded-md outline-none text-[13px] text-white-200"
                onChange={(e) => handleInput(e, "icon")}
                data-name="icon"
              >
                <option value="🔥">🔥</option>
                <option value="🚀">🚀</option>
                <option value="✅">✅</option>
                <option value="⚡️">⚡️</option>
              </select>
            </div>
            <div className="w-full flex flex-col items-start justify-start mt-3">
              <p className="text-white-400 font-pp-rg text-[13px] mb-2">
                Tags (max: 5)
              </p>
              <select
                className="w-full max-h-[100px] border-[1px] border-solid border-white-600 p-3 font-pp-rg bg-dark-100 rounded-md outline-none text-[13px] text-white-200"
                multiple
                data-name="tags"
                onChange={(e) => {
                  limitSelection(e, 5);
                  handleInput(e, "multiple");
                }}
              >
                {loadingState ? (
                  <option value="">..Loading 😌</option>
                ) : allTags?.length > 0 ? (
                  allTags.map((tag, i) => (
                    <option value={tag} key={i}>
                      {tag}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No data available
                  </option>
                )}
              </select>
            </div>
            <div className="w-full flex flex-col items-start justify-start mt-3">
              <p className="text-white-400 font-pp-rg text-[13px] mb-2">
                Communities (max: 5)
              </p>
              <select
                className="w-full h-[100px] border-[1px] border-solid border-white-600 p-3 font-pp-rg bg-dark-100 rounded-md outline-none text-[13px] text-white-200"
                multiple
                data-name="communities"
                onChange={(e) => {
                  limitSelection(e, 5);
                  handleInput(e, "multiple");
                }}
              >
                {loadingState ? (
                  <option value="">..Fetching 😌</option>
                ) : activeCommunities?.length > 0 ? (
                  activeCommunities.map((data, i) => (
                    <option value={data?.slug} key={i}>
                      {data?.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No data available
                  </option>
                )}
              </select>
            </div>
          </div>
          <div className="w-full flex items-center justify-center p-3">
            <button
              className="w-full px-6 py-3 flex items-center justify-center text-white-100 bg-blue-300 hover:animate-pulse transition-all font-pp-rg text-[13px] rounded-lg"
              onClick={saveVariant}
            >
              Save Variant
            </button>
          </div>
          <br />
        </div>
      </div>
    </Modal>
  );
}

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
