import { toast } from "react-hot-toast";
import { copyToClipboard, isEmpty } from "../../util";
import { BiCopy, BiPencil, BiRefresh } from "react-icons/bi";
import SiteSideBar from "../../components/SiteSidebar";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getCreatedSites, refreshSiteData } from "../../http";
import { HandlePageBuilderResponse } from "../../util/response";
import { Spinner } from "../../components/Loader";

function AllSites() {
  const [sidebarVisible, setSidebarVisibility] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [selectedSite, setSelectedSite] = useState<any>({});
  const [createdSites, setCreatedSites] = useState<any[]>([]);
  const [shouldRefreshSiteData, setShouldRefreshSiteData] = useState(false);
  const allSitesQuery = useQuery({
    queryFn: async () => await getCreatedSites(),
    queryKey: ["fetchedCreatedSites"],
  });
  const refreshSiteDataMutation = useMutation(
    async (slug: string) => await refreshSiteData(slug)
  );

  const refetchSites = () => allSitesQuery.refetch();

  const handleSelectedSite = (e: any) => {
    const dataset = e?.target?.dataset;
    const id = dataset?.id;
    if (isEmpty(id)) return;
    const filteredSite = createdSites.filter((s) => s?.id === id)[0];
    setSelectedSite(id);
    setSidebarVisibility(true);
    setSelectedSite(filteredSite);
  };

  useEffect(() => {
    const { data, error } = allSitesQuery;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandlePageBuilderResponse(
        response,
        () => {},
        (data) => setCreatedSites(data),
        () => {}
      );
    }
  }, [allSitesQuery.data]);

  useEffect(() => {
    const { data, error } = refreshSiteDataMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandlePageBuilderResponse(
        response,
        () => refreshSiteDataMutation.reset(),
        () => {},
        () => refetchSites()
      );
    }
  }, [refreshSiteDataMutation.data]);

  function refreshData(slug: string) {
    if (isEmpty(slug)) {
      toast.error("site slug is missing.");
      return;
    }
    refreshSiteDataMutation.mutate(slug);
  }

  return (
    <div className="w-full h-full flex flex-wrap items-start justify-start px-4 py-3 gap-2">
      {allSitesQuery?.isLoading ? (
        <div className="w-full flex flex-col items-center justify-center">
          <Spinner color="#fff" />
        </div>
      ) : !allSitesQuery?.isLoading && createdSites?.length === 0 ? (
        <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center">
          <p className="text-white-300 font-pp-sb text-[16px] ">
            No sites available! 😔
          </p>
        </div>
      ) : (
        createdSites.map((d, i) => (
          <CreatedSites
            name={d?.name}
            id={d?.id}
            onSelected={handleSelectedSite}
            selectedSite={selectedSite}
            slug={d?.slug}
            themeName={d?.themeName}
            key={d?.id}
            refreshSiteData={refreshData}
            isRefreshing={refreshSiteDataMutation?.isLoading}
          />
        ))
      )}

      {sidebarVisible && (
        <SiteSideBar
          visible={sidebarVisible}
          closeSidebar={() => setSidebarVisibility(false)}
          siteId={selectedSiteId}
          selectedSite={selectedSite}
          refetchSites={refetchSites}
        />
      )}
    </div>
  );
}

export default AllSites;

interface CreatedSitesProps {
  name: string;
  slug: string;
  id: string;
  onSelected: (e: any) => void;
  selectedSite: string;
  themeName: string;
  refreshSiteData: (slug: string) => void;
  isRefreshing: boolean;
}

function CreatedSites({
  name,
  id,
  onSelected,
  selectedSite,
  slug,
  themeName,
  refreshSiteData,
  isRefreshing,
}: CreatedSitesProps) {
  const copyToken = () => {
    const url =
      typeof window !== "undefined" && window?.location?.origin + "/" + slug;
    copyToClipboard(url);
    toast.success("Url copied successfully.");
  };

  const SelectedStyle =
    selectedSite === id ? "bg-dark-200 text-white-100" : "bg-dark-300";

  return (
    <button
      key={id}
      className={`w-auto h-auto flex items-start justify-start ${SelectedStyle} py-4 px-3 rounded-lg cursor-default `}
    >
      <div className="w-[70px] h-full flex items-center justify-center p-4 rounded-lg border-solid border-[.5px] border-white-600 ">
        <span className="text-2xl">🎉</span>
      </div>
      <div className="w-full flex flex-col items-start justify-start ml-2 gap-2">
        <p className="text-white-100 font-pp-sb text-[14px]">
          {name}
          <kbd className="ml-1 px-2 py-1 border-solid border-[.5px] border-white-600 text-[10px] rounded-[3px] text-white-300 bg-dark-400">
            {themeName}
          </kbd>
        </p>
        <div className="w-full min-w-[200px] flex flex-wrap items-start justify-start gap-2">
          <a
            href={`${
              typeof window !== "undefined" && window?.location?.origin
            }/${slug}`}
            target="_blank"
            className=" text-white-300 font-pp-rg underline text-[13px]"
          >
            {slug}
          </a>
        </div>
      </div>
      <button
        className="px-3 py-3 flex items-center justify-center border-solid border-[1px] border-white-600 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg"
        onClick={copyToken}
      >
        <BiCopy color="#ccc" />
      </button>
      <button
        className="px-3 py-3 flex items-center justify-center border-solid border-[1px] border-white-600 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg"
        onClick={() => {
          if (!isRefreshing) refreshSiteData(slug);
        }}
      >
        <BiRefresh
          color="#ccc"
          className={`${isRefreshing ? "animate-spin" : "animate-none"}`}
        />
      </button>
      <button
        className="px-3 py-[10px] flex items-center justify-center border-solid border-[1px] border-white-600 scale-[.95] hover:scale-[1] transition-all font-pp-eb text-[13px] rounded-lg"
        onClick={onSelected}
        data-id={id}
      >
        <span
          className="text-white-200 font-pp-rg text-[10px] "
          onClick={onSelected}
          data-id={id}
        >
          Edit
        </span>
      </button>
    </button>
  );
}

type NotifierProp = {
  tags?: string[];
};

function SiteTags({ tags }: NotifierProp) {
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
