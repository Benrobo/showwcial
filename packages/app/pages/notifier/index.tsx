import { BsDiscord } from "react-icons/bs";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import withAuth from "../../util/withAuth";
import Gap from "../../components/Gap";
import { copyToClipboard, genRandNum } from "../../util";
import { BiCopy } from "react-icons/bi";
import { Switch } from "@chakra-ui/react";
import Modal from "../../components/Modal";
import { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import { createVariant, deleteVariant, fetchAllVariants } from "../../http";
import { HandleNotifierResponse } from "../../util/response";
import { Router } from "next/router";
import { Spinner } from "../../components/Loader";

function Notifier() {
  const [showCreateVariant, setShowCreateVariant] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<any>({});
  const [allVariants, setAllVariants] = useState([]);
  const variantQuery = useQuery({
    queryFn: async () => await fetchAllVariants(),
    queryKey: ["allVariants"],
  });
  const deleteVariantMutation = useMutation(
    async (id: string) => await deleteVariant(id)
  );

  const AUTH_BOT_URL = `https://discord.com/oauth2/authorize?client_id=1100946925106233434&scope=bot`;

  useEffect(() => {
    if (selectedVariantId.length > 0) {
      const filterSelected = allVariants.filter(
        (d) => d?.id === selectedVariantId
      );
      setSelectedVariant(filterSelected[0]);
    }
  }, [selectedVariantId]);

  useEffect(() => {
    const { data, error } = variantQuery;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleNotifierResponse(
        response,
        () => {},
        (data) => setAllVariants(data),
        null
      );
    }
  }, [variantQuery.data]);

  useEffect(() => {
    const { data, error } = deleteVariantMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleNotifierResponse(
        response,
        () => {},
        () => {},
        () => variantQuery.refetch()
      );
    }
  }, [deleteVariantMutation.data]);

  const deleteSelectedVariant = () => {
    if (typeof window !== "undefined") {
      const comfirm = window.confirm("Are you sure about this action?");
      if (!comfirm) return;
      deleteVariantMutation.mutateAsync(selectedVariantId);
      setSelectedVariantId("");
    }
  };

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
          <div className="w-full flex items-center justify-start gap-2">
            <button
              className="px-6 py-3 flex items-center justify-center text-white-100 bg-blue-300 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg"
              onClick={() => setShowCreateVariant(!showCreateVariant)}
            >
              Create Variant
            </button>
            <a
              href={AUTH_BOT_URL}
              target="_blank"
              className="px-6 py-3 flex items-center justify-center text-white-100 bg-green-700 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg"
            >
              <BsDiscord size={20} className="text-white-100 mr-2" /> Install
              Bot.
            </a>
          </div>
          <br />
          <Gap />
          <div className="w-full flex flex-col items-start justify-start gap-3">
            {variantQuery.isLoading ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Spinner color="#fff" />
              </div>
            ) : !variantQuery.isLoading && allVariants.length > 0 ? (
              allVariants
                .sort(
                  (a, b) =>
                    Date.parse(a.createdAt as any) - Date.parse(b.createdAt)
                )
                .map((data, i) => (
                  <NotifierVariant
                    id={data?.id}
                    name={data?.name}
                    token={data?.token}
                    icon={data?.icon}
                    tags={data?.tags.slice(0, 5)}
                    selectedVariant={selectedVariantId}
                    onSelected={() => {
                      if (selectedVariantId === data?.id)
                        return setSelectedVariantId("");
                      setSelectedVariantId(data?.id);
                    }}
                  />
                ))
            ) : null}
          </div>
        </div>

        <div className="w-full h-full flex flex-col items-start justify-start">
          {selectedVariantId.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <p className="text-white-200 font-pp-sb text-[14px] ">
                {allVariants.length > 0
                  ? "👈 Select one of the variants"
                  : "Nothing to show here for now 😞.."}
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center px-4 py-4">
              <div className="w-full flex flex-col items-start justify-start gap-4">
                <p className="text-white-300 font-pp-rg text-[14px]">
                  NAME:{" "}
                  <span className="text-white-200 font-pp-sb ml-5">
                    {selectedVariant?.name}
                  </span>
                </p>
                <p className="text-white-300 font-pp-rg text-[14px]">
                  Token:
                  <span className="text-white-200 font-pp-sb ml-5">
                    {selectedVariant?.token}
                  </span>
                </p>
                <p className="text-white-300 font-pp-rg text-[14px]">
                  Communities:
                  <span className="text-white-200 font-pp-sb ml-5">
                    <NotifierTags tags={selectedVariant?.communities ?? []} />
                  </span>
                </p>
                <p className="text-white-300 flex font-pp-rg text-[14px]">
                  Tags:
                  <span className="text-white-200 flex flex-wrap font-pp-sb ml-5">
                    <NotifierTags tags={selectedVariant?.tags ?? []} />
                  </span>
                </p>
                <p className="text-white-300 font-pp-rg text-[14px]">
                  Disable:
                  <span className="text-white-200 font-pp-sb ml-5">
                    <Switch isChecked={selectedVariant?.disabled} />
                  </span>
                </p>
                <Gap height={50} />
                <button
                  className="px-6 py-3 flex items-center justify-center text-white-100 bg-red-400 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg"
                  onClick={deleteSelectedVariant}
                  disabled={deleteVariantMutation?.isLoading}
                >
                  {deleteVariantMutation?.isLoading ? (
                    <Spinner color="#fff" />
                  ) : (
                    "Delete Variant"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateVariant && (
        <CreateVariant
          closeModal={() => setShowCreateVariant(!showCreateVariant)}
          refreshVariant={() => variantQuery.refetch()}
        />
      )}
    </MainDashboardLayout>
  );
}

export default withAuth(Notifier);

interface CreateVariantProp {
  closeModal?: () => void;
  refreshVariant?: () => void;
}

function CreateVariant({ closeModal, refreshVariant }: CreateVariantProp) {
  const createVariantMutation = useMutation(
    async (data: any) => await createVariant(data)
  );
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

  const fetchShowTags = async () => {
    try {
      setAllTags([]);
      setLoadingState(true);
      const baseUrl = "https://cache.showwcase.com";
      const shows = await axios
        .get(`${baseUrl}/projects?limit=100`)
        .then((r) => r.data);

      setLoadingState(false);

      let filteredShows = [];

      shows.forEach((showData: any) => {
        if (showData?.tags?.length > 0) {
          showData?.tags
            .map((tag: any) => tag?.tagDescription)
            .forEach((tg: string) => {
              if (!filteredShows.includes(tg)) {
                filteredShows.push(tg.replace("#", ""));
              }
            });
        }
      });
      setAllTags(filteredShows);
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
    // fetch on initial render and when the type get updated.
    if (variantData?.type === "" || variantData.type === "thread") {
      // if allTags state already contains data, dont refetch data.
      if (allTags.length === 0) fetchTagAndCommunities();
    }
    if (variantData.type === "shows") {
      fetchShowTags();
    }
  }, [variantData?.type]);

  useEffect(() => {
    const { data, error } = createVariantMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleNotifierResponse(
        response,
        () => createVariantMutation.reset(),
        () => {},
        () => {
          closeModal();
          refreshVariant();
        }
      );
    }
  }, [createVariantMutation.data]);

  function saveVariant() {
    createVariantMutation.mutate(variantData);
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
              disabled={createVariantMutation.isLoading}
            >
              <option value="">Select type</option>
              <option value="thread">Thread</option>
              <option value="shows">Shows</option>
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
                disabled={createVariantMutation.isLoading}
              />
              <select
                className="w-[100px] border-[1px] border-solid border-white-600 p-3 font-pp-rg bg-dark-100 rounded-md outline-none text-[13px] text-white-200"
                onChange={(e) => handleInput(e, "icon")}
                data-name="icon"
                disabled={createVariantMutation.isLoading}
              >
                <option value="">emoji</option>
                <option value="🔥">🔥</option>
                <option value="🚀">🚀</option>
                <option value="✅">✅</option>
                <option value="⚡️">⚡️</option>
              </select>
            </div>
            <div className="w-full flex flex-col items-start justify-start mt-3">
              <p className="text-white-400 font-pp-rg text-[13px] mb-2">
                Tags (max: 10)
              </p>
              <select
                className="w-full max-h-[100px] border-[1px] border-solid border-white-600 p-3 font-pp-rg bg-dark-100 rounded-md outline-none text-[13px] text-white-200"
                multiple
                data-name="tags"
                disabled={createVariantMutation.isLoading}
                onChange={(e) => {
                  limitSelection(e, 10);
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
            {variantData?.type === "thread" && (
              <div className="w-full flex flex-col items-start justify-start mt-3">
                <p className="text-white-400 font-pp-rg text-[13px] mb-2">
                  Communities (max: 10)
                </p>
                <select
                  className="w-full h-[100px] border-[1px] border-solid border-white-600 p-3 font-pp-rg bg-dark-100 rounded-md outline-none text-[13px] text-white-200"
                  multiple
                  data-name="communities"
                  onChange={(e) => {
                    limitSelection(e, 10);
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
            )}
          </div>
          <div className="w-full flex items-center justify-center p-3">
            <button
              className="w-full px-6 py-3 flex items-center justify-center text-white-100 bg-blue-300 hover:animate-pulse transition-all font-pp-rg text-[13px] rounded-lg"
              onClick={saveVariant}
              disabled={createVariantMutation.isLoading}
            >
              {createVariantMutation.isLoading ? (
                <Spinner color="#fff" />
              ) : (
                "Save Variant"
              )}
            </button>
          </div>
          <br />
        </div>
      </div>
    </Modal>
  );
}

interface NotifierVariantPropS {
  tags: string[];
  name: string;
  token: string;
  id: string;
  icon: string;
  onSelected: () => void;
  selectedVariant: string;
}

function NotifierVariant({
  tags,
  name,
  token,
  id,
  icon,
  onSelected,
  selectedVariant,
}: NotifierVariantPropS) {
  const copyToken = () => {
    copyToClipboard(token);
    toast.success("Token copied successfully.");
  };

  const SelectedStyle =
    selectedVariant === id ? "bg-dark-200 text-white-100" : "bg-dark-300";

  return (
    <button
      data-id={id}
      key={id}
      className={`w-full h-auto flex items-start justify-start ${SelectedStyle} py-4 px-3 rounded-lg`}
      onClick={onSelected}
    >
      <div className="w-[70px] h-full flex items-center justify-center p-4 rounded-lg border-solid border-[.5px] border-white-600 ">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="w-full flex flex-col items-start justify-start ml-2 gap-2">
        <p className="text-white-100 font-pp-sb text-[14px]">{name}</p>
        <div className="w-full flex flex-wrap items-start justify-start gap-2">
          <NotifierTags tags={tags} />
        </div>
      </div>
      <button
        className="px-3 py-3 flex items-center justify-center border-solid border-[1px] border-white-600 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg"
        onClick={copyToken}
      >
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
      {tags.length === 0 ? (
        <span className="text-white-300">N/A</span>
      ) : (
        tags.map((d, i) => (
          <span
            className="px-2 py-1 rounded-md text-[10px] bg-dark-100 text-white-100 border-solid border-[1px] border-blue-300 font-pp-sb"
            key={i}
          >
            {d}
          </span>
        ))
      )}
    </>
  );
}
