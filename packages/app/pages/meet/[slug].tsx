import dynamic from "next/dynamic";
import {
  JitsiMainConfigOverwrite,
  JitsiVideoConfigOverwrite,
} from "../../config";
import { IJitsiMeetingProps } from "@jitsi/react-sdk/lib/types";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Spinner } from "../../components/Loader";
import { useQuery } from "react-query";
import { getMeeting } from "../../http";
import { isEmpty } from "../../util";
import { HandleMeetResponse } from "../../util/response";
const JitsiMeeting = dynamic(
  () =>
    import("@jitsi/react-sdk").then(({ JitsiMeeting }) => JitsiMeeting) as any,
  {
    ssr: false,
  }
) as React.FC<IJitsiMeetingProps>;

export default function VideoCall() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const meetId = router.query.slug;
  const getMeetingQuery = useQuery({
    queryFn: async () => await getMeeting({ slug: meetId } as any),
    queryKey: ["getMeeting"],
    enabled: !isEmpty(meetId) ? true : false,
  });
  const [error, setError] = useState(null);
  const [meetingData, setMeetingData] = useState<{
    name: string;
    slug: string;
    id: string;
  }>();

  const handleCloseLoadingState = useCallback(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  useEffect(() => {
    if (!getMeetingQuery.isLoading && isEmpty(error)) {
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 2000);
    }
  }, [loading]);

  useEffect(() => {
    if (
      typeof getMeetingQuery.data !== "undefined" ||
      getMeetingQuery.error !== null
    ) {
      const { data } = getMeetingQuery;
      const response = data;
      HandleMeetResponse(
        response,
        () => {},
        (data) => {
          if (data?.code === "MEETING_NOTFOUND") {
            setError("Invalid Meeting Link.");
          }
          setMeetingData(data);
        }
      );
    }
  }, [getMeetingQuery.data]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {!isEmpty(error) && (
        <div className="h-full w-full container flex flex-col items-center justify-center text-center fixed top-0 left-0">
          <h1 className="pp-SB text-[20px] text-white-100 ">{error}</h1>
          <br />
          <a
            className="ml-2 text-white-100 bg-blue-300 px-3 py-3 flex items-center justify-center border-solid border-[1px] border-white-600 scale-[.95] hover:scale-[1] transition-all pp-EB text-[13px] rounded-lg"
            href="/"
          >
            Go Home
          </a>
        </div>
      )}

      {loading && (
        <div className="h-full w-full container flex flex-col items-center justify-center text-center fixed top-0 left-0">
          <h1 className="pp-SB text-[20px] text-white-100 ">
            Please wait while we setup your call
          </h1>
          <Spinner />
        </div>
      )}

      {getMeetingQuery.isLoading && <Spinner color="#fff" />}

      {!getMeetingQuery.isLoading && error === null && (
        <JitsiMeeting
          spinner={() => <Spinner />}
          roomName={meetingData?.name || "mymeeting"}
          configOverwrite={JitsiVideoConfigOverwrite}
          interfaceConfigOverwrite={JitsiMainConfigOverwrite}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100vh";
            iframeRef.style.width = "100vw";
          }}
          onApiReady={() => {
            handleCloseLoadingState();
          }}
          onReadyToClose={() => {
            router.push("/");
          }}
        />
      )}
    </div>
  );
}
