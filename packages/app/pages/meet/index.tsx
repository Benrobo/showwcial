import { BiCopy } from "react-icons/bi";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import { copyToClipboard } from "../../util";
import toast from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import Modal from "../../components/Modal";
import { useMutation, useQuery } from "react-query";
import { createMeeting, deleteMeeting, getMeetings } from "../../http";
import { useCallback, useEffect, useState } from "react";
import { HandleMeetResponse } from "../../util/response";
import { Spinner } from "../../components/Loader";
import { CgSpinner } from "react-icons/cg";

export default function Meet() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allMeetings, setAllMeetings] = useState([]);
  const [meetingName, setMeetingName] = useState("");
  const getMeetingsQuery = useQuery({
    queryFn: async () => await getMeetings(),
    queryKey: ["getMeetings"],
  });
  const createMeetingMutation = useMutation(async (data: any) =>
    createMeeting(data)
  );
  const deleteMeetingMutation = useMutation(async (data: any) =>
    deleteMeeting(data)
  );

  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const [loadingStack, setLoadingStack] = useState<{ id: string }[]>([]);

  useEffect(() => {
    if (
      typeof getMeetingsQuery.data !== "undefined" ||
      getMeetingsQuery.error !== null
    ) {
      const { data } = getMeetingsQuery;
      const response = data;
      HandleMeetResponse(
        response,
        () => {},
        (data) => {
          setAllMeetings(data);
        }
      );
    }
  }, [getMeetingsQuery.data]);

  useEffect(() => {
    if (
      typeof createMeetingMutation.data !== "undefined" ||
      createMeetingMutation.error !== null
    ) {
      const { data } = createMeetingMutation;
      const response = data;
      HandleMeetResponse(
        response,
        () => {
          createMeetingMutation.reset();
        },
        () => {},
        () => {
          getMeetingsQuery.refetch();
          setIsModalOpen(!isModalOpen);
        }
      );
    }
  }, [createMeetingMutation.data]);

  useEffect(() => {
    if (
      typeof deleteMeetingMutation.data !== "undefined" ||
      deleteMeetingMutation.error !== null
    ) {
      const { data } = deleteMeetingMutation;
      const response = data;
      HandleMeetResponse(
        response,
        () => {
          deleteMeetingMutation.reset();
        },
        (data) => {
          const { id } = data;
          const deleteLoaderStack = loadingStack.filter((l) => l.id !== id);
          setLoadingStack(deleteLoaderStack);
        },
        () => getMeetingsQuery.refetch()
      );
    }
  }, [deleteMeetingMutation.data]);

  function createMeet() {
    if (meetingName.length === 0) {
      toast.error("meeting name is empty.");
      return;
    }
    createMeetingMutation.mutate({ name: meetingName });
  }

  function deleteCreatedMeeting(id: string) {
    setLoadingStack((prev) => [...prev, { id }]);
    deleteMeetingMutation.mutate({ id });
  }

  return (
    <MainDashboardLayout activeTab="meet">
      <div className="w-full h-auto flex flex-col items-start justify-start">
        <div className="relative w-full h-auto border-b-solid border-b-[.5px] border-b-white-600 py-3 px-4 flex flex-col items-start justify-start">
          <h1 className="font-extrabold pp-EB text-[1em] text-white-100">
            Your Social Circle, Just One Tap Away
          </h1>
          <p className="text-white-300 text-[13px] pp-RG">
            Bridge the distance and connect with friends through heartfelt video
            conversations.
          </p>
          <br />
          <button
            className="w-auto px-4 py-2 rounded-md bg-blue-300 text-white-100 pp-SB text-[14px]"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Create New Meeting
          </button>
        </div>
        <div className="w-full h-auto py-5 px-3 flex flex-wrap items-start justify-start gap-5">
          {allMeetings.length > 0
            ? allMeetings.map((d, i) => (
                <MeetingCards
                  name={d.name}
                  slug={d.slug}
                  id={d.id}
                  key={d.id}
                  deleteMeeting={deleteCreatedMeeting}
                  loadingStack={loadingStack}
                />
              ))
            : null}
        </div>
      </div>
      <Modal isBlurBg isOpen={isModalOpen} showCloseIcon onClose={toggleModal}>
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-[300px] h-auto rounded-md bg-dark-300 border-solid border-[.5px] border-white-600 ">
            <div className="w-full border-b-solid border-b-[.5px] border-b-white-600 flex flex-col items-center justify-center py-2">
              <p className="text-white-100 text-[18px] pp-SB">
                Create New Meeting
              </p>
            </div>
            <br />
            <div className="w-full px-3 flex flex-col items-start justify-start mb-3">
              <input
                type="text"
                className="w-full px-3 py-3 outline-none text-[14px] bg-dark-100 text-white-100 rounded-md"
                placeholder="Meeting Name"
                maxLength={30}
                onChange={(e) => setMeetingName(e.target.value)}
                defaultValue={meetingName}
              />
              <button
                className="w-full mt-3 px-4 py-2 rounded-md bg-blue-300 text-white-100 pp-SB text-[14px]"
                disabled={createMeetingMutation.isLoading}
                onClick={createMeet}
              >
                {createMeetingMutation.isLoading ? (
                  <div className="w-full flex items-center justify-center gap-4">
                    <Spinner color="#fff" /> Creating
                  </div>
                ) : (
                  "Create Meeting"
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </MainDashboardLayout>
  );
}

interface MeetingProps {
  name: string;
  slug: string;
  id: string;
  deleteMeeting: (id: string) => void;
  loadingStack: { id: string }[];
}

function MeetingCards({
  name,
  slug,
  id,
  deleteMeeting,
  loadingStack,
}: MeetingProps) {
  const copyToken = () => {
    const { location } = window;
    const url = `${location.origin}/meet/${slug}`;
    copyToClipboard(url);
    toast.success("Url copied.");
  };

  const currentStack = loadingStack.filter((d) => d.id === id) ?? null;

  return (
    <div
      data-id={id}
      key={id}
      className={`w-auto h-auto flex items-start justify-start bg-dark-300 py-4 px-3 rounded-lg text-white-100`}
    >
      <div className="w-[50px] h-[50px] flex items-center justify-center p-4 rounded-lg border-solid border-[.5px] border-white-600 ">
        <span className="text-2xl">📽</span>
      </div>
      <div className="w-full flex flex-col items-start justify-start ml-2 gap-2">
        <p className="text-white-100 pp-SB text-[14px]">
          {name ?? "Meeting Name"}
        </p>
        <div className="w-full flex flex-wrap items-start justify-start gap-2">
          <span className="text-white-400 text-[12px] pp-RG">{slug}</span>
        </div>
      </div>
      <button
        className="ml-2 px-3 py-3 flex items-center justify-center border-solid border-[1px] border-white-600 scale-[.95] hover:scale-[1] transition-all pp-EB text-[13px] rounded-lg"
        onClick={copyToken}
      >
        <BiCopy color="#ccc" />
      </button>
      <button
        className="ml-2 px-3 py-3 flex items-center justify-center border-solid border-[1px] border-white-600 scale-[.95] hover:bg-red-305 hover:text-white-100 hover:scale-[1] transition-all pp-EB text-[13px] rounded-lg"
        onClick={() => deleteMeeting(id)}
      >
        {currentStack !== null && currentStack[0]?.id === id ? (
          <CgSpinner color="#fff" className=" animate-spin " size={14} />
        ) : (
          <AiFillDelete />
        )}
      </button>
    </div>
  );
}
