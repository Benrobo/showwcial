import { toast } from "react-hot-toast";
import { copyToClipboard } from "../../util";
import { BiCopy, BiPencil } from "react-icons/bi";

function AllSites() {
  const handleSelectedSite = () => {};

  return (
    <div className="w-full h-full flex flex-wrap items-start justify-start px-4 py-3 gap-2">
      <CreatedSites
        name="Portfolio V3"
        id="dcscsdc"
        onSelected={handleSelectedSite}
        selectedSite="sdcsd"
      />
    </div>
  );
}

export default AllSites;

interface CreatedSitesProps {
  name: string;
  id: string;
  onSelected: () => void;
  selectedSite: string;
}

function CreatedSites({
  name,
  id,
  onSelected,
  selectedSite,
}: CreatedSitesProps) {
  const copyToken = () => {
    // copyToClipboard(token);
    toast.success("Token copied successfully.");
  };

  const SelectedStyle =
    selectedSite === id ? "bg-dark-200 text-white-100" : "bg-dark-300";

  return (
    <button
      data-id={id}
      key={id}
      className={`w-auto h-auto flex items-start justify-start ${SelectedStyle} py-4 px-3 rounded-lg`}
      onClick={onSelected}
    >
      <div className="w-[70px] h-full flex items-center justify-center p-4 rounded-lg border-solid border-[.5px] border-white-600 ">
        <span className="text-2xl">🎉</span>
      </div>
      <div className="w-full flex flex-col items-start justify-start ml-2 gap-2">
        <p className="text-white-100 font-pp-sb text-[14px]">{name}</p>
        <div className="w-full flex flex-wrap items-start justify-start gap-2">
          {/* <SiteTags tags={tags} /> */}
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
        onClick={copyToken}
      >
        <BiPencil color="#ccc" />
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
