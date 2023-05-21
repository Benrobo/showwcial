import { useContext, useEffect, useRef, useState } from "react";
import ImageTag from "../Image";
import DataContext from "../../context/DataContext";
import { BsTrash } from "react-icons/bs";
import { IoAddSharp, IoClose } from "react-icons/io5";
import {
  isEmpty,
  replaceTagsWithNewLine,
  sleep,
  splitThread,
} from "../../util";
import Gap from "../Gap";
import { useMutation, useQuery } from "react-query";
import { createThread } from "../../http";
import { Spinner } from "../Loader";
import { toast } from "react-hot-toast";
import { HandleThreadResponse } from "../../util/response";
import { MdSubtitles } from "react-icons/md";
import { Select } from "@chakra-ui/react";
import axios from "axios";

interface ThreadEditorProp {
  closeActiveThread: () => void;
}

export default function ThreadEditor({ closeActiveThread }: ThreadEditorProp) {
  const {} = useContext(DataContext);
  const createThreadMutation = useMutation(
    async (data: any) => await createThread(data)
  );
  const fetchCommunitiesQuery = useQuery({
    queryFn: async () => await fetchAllCommunities(),
    queryKey: ["fetchCommunities"],
  });
  const [posts, setPosts] = useState([{ id: 0, value: "" }]);
  const [threadTitle, setThreadTitle] = useState("");
  const [clearInput, setClearInput] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const MAX_CHAR = 1000;

  async function fetchAllCommunities() {
    try {
      const res = await axios.get(
        `https://cache.showwcase.com/communities/featured?limit=100`
      );
      const result = res.data;
      setCommunities(result);
    } catch (e: any) {
      console.log(`Something went wrong fetching community: ${e}`);
      setCommunities([]);
    }
  }

  //! work on this later.
  function handleSplittingOfThread() {
    const initialThreadContent = posts[0].value;
    const splittedThread = splitThread(MAX_CHAR, initialThreadContent);
    setPosts(splittedThread);
  }

  const isPostsEmpty =
    posts
      .map((p) => p.value.replaceAll("\n", ""))
      .map((v) => v.length === 0)
      .filter((p) => p === true).length === 0
      ? false
      : true;

  const addInput = (e) => {
    const newId = posts.length;
    setPosts([...posts, { id: newId, value: e.target.value }]);
  };

  const handleInput = (id: number, value: string) => {
    const formattedVal = replaceTagsWithNewLine(value);
    const filteredInp = posts.filter((input) => input.id === id);
    const filteredOut = posts.filter((input) => input.id !== id);
    filteredInp[0]["value"] = formattedVal;
    const comb = filteredInp.concat(filteredOut);
    const sorted = comb.sort((a, b) => a?.id - b?.id);
    setPosts(sorted);
  };

  const removeInput = (idToRemove: number) => {
    const newInputs = posts.filter((input) => input.id !== idToRemove);
    setPosts(newInputs);
  };

  useEffect(() => {
    if (clearInput) {
      setTimeout(() => {
        setClearInput(false);
      }, 1000);
    }
  }, [clearInput]);

  useEffect(() => {
    const { data, error } = createThreadMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleThreadResponse(
        response,
        () => createThreadMutation.reset(),
        () => {
          setPosts([{ id: 0, value: "" }]);
          setClearInput(true);
          setThreadTitle("");
          setSelectedCommunity("");
        }
      );
    }
  }, [createThreadMutation.data]);

  function postThread() {
    // handle posting of thread
    if (isPostsEmpty) {
      toast.error(`Input field(s) may be empty.`);
      return;
    }
    const payload = {
      content: posts.map((p) => p.value),
      title: threadTitle,
    };
    if (!isEmpty(selectedCommunity)) {
      payload["communityId"] = +selectedCommunity;
    }
    createThreadMutation.mutate(payload);
  }

  return (
    <div className="relative w-full h-screen mb-8 my-8 flex flex-col items-center justify-start">
      <Gap />
      <div className="w-auto p-2 absolute top-[-35px] right-0 flex items-center justify-between">
        <button
          className="w-auto hover:scale-[.96] scale-[1] transition-all bg-blue-300 text-white-100 px-6 py-2 flex items-center justify-between text-[12px] font-pp-sb rounded-[30px] "
          onClick={postThread}
          style={{
            opacity: isPostsEmpty ? 0.5 : 1,
          }}
          disabled={isPostsEmpty}
        >
          Post
        </button>
      </div>
      <div className="w-auto p-2 absolute top-[-35px] left-0 flex items-center justify-between">
        <button
          className="w-auto hover:scale-[.96] scale-[1] transition-all hover:bg-red-400 hover:text-white-100 p-2 flex items-center justify-between text-[12px] font-pp-sb rounded-[30px] "
          onClick={closeActiveThread}
        >
          <IoClose size={20} color="#ccc" />
        </button>
      </div>
      <div className="w-[450px] h-auto relative">
        <div className="w-full flex flex-col items-start justify-start">
          <select
            className="bg-transparent border-[1px] border-solid border-white-600 p-2 rounded-md text-white-200 outline-none mb-2 "
            disabled={fetchCommunitiesQuery.isLoading}
            onChange={(e) => setSelectedCommunity(e.target.value)}
          >
            <option value="">Communities</option>
            {communities?.length > 0
              ? communities.map((d) => <option value={d?.id}>{d?.name}</option>)
              : null}
          </select>
        </div>
        <div className="w-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center bg-dark-200 p-2 rounded-md">
            <MdSubtitles color="#ccc" />
          </div>
          <input
            type="text"
            className="w-full  font-pp-sb text-white-300 border-none outline-none bg-transparent p-3 text-[20px]"
            placeholder="Title..."
            onChange={(e) => setThreadTitle(e.target.value)}
            value={threadTitle}
            maxLength={60}
          />
        </div>
        {posts.map((input, index) => (
          <ThreadInputBox
            key={index}
            value={input.value === "null" ? "" : input.value}
            addInput={addInput}
            removeInput={removeInput}
            handleInput={handleInput}
            threadInp={posts}
            id={input.id as any}
            MAX_CHAR={MAX_CHAR}
            clearInput={clearInput}
          />
        ))}
        <Gap />
        {createThreadMutation.isLoading && (
          <div className="w-full h-full bg-transparent backdrop-blur-sm absolute top-0 left-0 flex flex-col items-center justify-center">
            <Spinner color="#fff" />
          </div>
        )}
      </div>
    </div>
  );
}
interface ThreadInputProps {
  threadInp?: { id: number; value: string }[];
  value?: string;
  id?: number;
  handleInput?: (id: number, value: string) => void;
  addInput?: (e) => void;
  removeInput?: (id: number) => void;
  MAX_CHAR?: number;
  key?: number;
  clearInput?: boolean;
}

function ThreadInputBox({
  value,
  id,
  key,
  threadInp,
  handleInput,
  addInput,
  removeInput,
  MAX_CHAR,
  clearInput,
}: ThreadInputProps) {
  const {} = useContext(DataContext);
  const [borderDivHeight, setBorderDivHeight] = useState(0);
  const inputRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userData"));

  if (clearInput) inputRef.current.value = "";

  useEffect(() => {
    function adjustHeight() {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
      setBorderDivHeight(inputRef.current.scrollHeight);
    }

    inputRef?.current?.addEventListener("input", adjustHeight);

    return () => {
      inputRef?.current?.removeEventListener("input", adjustHeight);
    };
  }, []);

  return (
    <div
      className="w-[450px] py-3 h-auto mt-5 relative overflow-hidden"
      key={key}
    >
      <div className="w-full h-auto flex items-start justify-center">
        <div className="w-auto h-full  flex flex-col items-center justify-start">
          <ImageTag
            src={userInfo?.image}
            className=" w-[40px] rounded-[50%] "
          />
          <div
            id="border-div"
            className="w-[2px] max-h-[420px] mt-2 h-full border-solid border-r-[2px] border-r-white-600 "
            style={{ height: `${borderDivHeight}px` }}
          ></div>
        </div>
        <div className="w-full h-auto  flex flex-col items-start justify-start">
          <div className="w-full relative flex flex-col items-start justify-start ml-2">
            <p className="text-white-100 font-pp-sb text-[14px] ">
              {userInfo?.fullname}
            </p>
            <p className="text-white-400 font-pp-rg text-[12px] ">
              @{userInfo?.username}
            </p>
            <p className="text-white-400 absolute top-2 right-4 font-pp-rg text-[12px] ">
              <span className="font-pp-sb">
                Max:{" "}
                <span
                  style={{
                    color: value.length > MAX_CHAR ? "red" : "",
                  }}
                >
                  {MAX_CHAR - value.length}
                </span>
              </span>
            </p>
          </div>
          <div className="w-full  flex flex-col items-start justify-start py-2">
            <textarea
              ref={inputRef}
              className="w-full bg-transparent resize-none text-white-100 border-none outline-none text-[14px] font-pp-rg"
              placeholder="Content..."
              style={{
                minHeight: "10px",
                maxHeight: "400px",
                overflowY: "auto",
              }}
              autoFocus={true}
              onInput={(e) => {
                const borderDivHeight = inputRef?.current?.scrollHeight;
                if (borderDivHeight === 42) setBorderDivHeight(0);
                if (borderDivHeight >= 43) setBorderDivHeight(borderDivHeight);
              }}
              onChange={(e) => handleInput(id, e.target.value)}
              defaultValue={value}
            ></textarea>
            {/* <div
              className="w-full bg-transparent resize-none text-white-100 border-none outline-none text-[14px] pre-wrap font-pp-rg"
              style={{
                minHeight: "50px",
                maxHeight: "400px",
                overflowY: "auto",
                height: borderDivHeight,
                whiteSpace: "pre-line",
              }}
              contentEditable
              onInput={(e) => {
                //   handleInput(
                //     id,
                //     (e.target as any).textContent.replace(/<br\s*\/?>/gm, "\n")
                //   )
                console.log(e.target.textContent);
              }}
              dangerouslySetInnerHTML={{ __html: value }}
              ref={inputRef}
            ></div> */}
            <div className="w-full relative py-5 flex items-start justify-between">
              <button
                className="w-auto absolute left-[-20px] hover:scale-[.96] scale-[1] transition-all bg-dark-200 text-blue-300 px-4 py-2 flex items-center justify-center text-[10px] font-pp-sb rounded-[30px] "
                onClick={addInput}
              >
                Add Thread
              </button>
              {id > 0 && (
                <button
                  className="w-auto absolute left-[90px] top-[23px] hover:scale-[.96] scale-[1] transition-all bg-red-100 text-red-200 px-2 py-2 flex items-center justify-center text-[10px] font-pp-sb rounded-lg "
                  onClick={() => removeInput(id)}
                >
                  <BsTrash />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
