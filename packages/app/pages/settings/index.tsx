import { useMutation, useQuery } from "react-query";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import withAuth from "../../util/withAuth";
import { addNotionIntegrationToken, getNotionToken } from "../../http";
import { LoaderModal, Spinner } from "../../components/Loader";
import { useEffect, useState } from "react";
import { HandleSettingsResponse } from "../../util/response";
import { toast } from "react-hot-toast";

function Settings() {
  const getNotionTokenQuery = useQuery({
    queryFn: async () => await getNotionToken(),
    queryKey: ["getNotionToken"],
  });
  const addNotionTokenMutation = useMutation(async (data) =>
    addNotionIntegrationToken(data as any)
  );
  const [appCredentials, setAppCredentials] = useState({
    notion: "",
    showwcase: "",
  });
  const [token, setToken] = useState({
    notion: "",
    showwcase: "",
  });

  useEffect(() => {
    const { data, error } = getNotionTokenQuery;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleSettingsResponse(
        response,
        () => {},
        (data) =>
          setAppCredentials({
            notion: data?.notionIntegrationToken,
            showwcase: data?.showwcaseToken,
          })
      );
    }
  }, [getNotionTokenQuery.data]);

  useEffect(() => {
    const { data, error } = addNotionTokenMutation;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleSettingsResponse(
        response,
        () => {},
        () => {},
        () => getNotionTokenQuery.refetch()
      );
    }
  }, [addNotionTokenMutation.data]);

  function addNotionToken(type: "notion" | "showwcase") {
    // return console.log(token.notion, appCredentials.notion);
    if (type === "notion") {
      if (
        token?.notion === appCredentials?.notion ||
        token?.notion.length === 0
      ) {
        toast.error("Token hasn't changed or is empty.");
        return;
      }
    }
    if (type === "showwcase") {
      if (
        token?.showwcase === appCredentials?.showwcase ||
        token?.showwcase.length === 0
      ) {
        toast.error("Token hasn't changed or is empty.");
        return;
      }
    }
    addNotionTokenMutation.mutate({ token: token[type], type } as any);
  }

  return (
    <MainDashboardLayout activeTab="settings">
      {getNotionTokenQuery.isLoading && <LoaderModal />}
      <div className="w-full h-full">
        <div className="w-full min-h-[150px] flex flex-col items-start justify-start px-5 py-4">
          <h2 className="text-white-100 font-pp-sb text-[20px] ">Settings</h2>
          <p className="text-slate-200 text-[13px] ">
            Manage Showccial Config.
          </p>
        </div>
        <div className="w-full flex flex-col items-start justify-start px-5 py-2">
          {/* Notion Integration */}
          <div className="w-full max-w-[450px] flex flex-col items-start justify-start">
            <p className="text-white-100 font-pp-sb text-[18px] ">
              Notion Integration
            </p>
            <p className="text-white-300 font-pp-rg text-[13px] ">
              Add your notion integration token. Dont know where to find one,
              follow this guide
              <a
                href="https://gist.github.com/Benrobo/e2cba898bdeb786ab73812aa84b8481a"
                className="textwhite-100 underline ml-1"
              >
                Here
              </a>
            </p>
            <br />
            <div className="w-full flex items-start justify-start gap-3">
              <input
                type="text"
                className="w-full px-4 py-4 text-[12px] rounded-md bg-dark-300 font-pp-rg text-white-100 border-none outline-none "
                placeholder="secret_7JuYFMeNMdssGSgzcdWm8wD4hDxcKXlaaJFFVTQXZQez"
                defaultValue={appCredentials?.notion}
                onChange={(e) =>
                  setToken((prev) => ({ ...prev, ["notion"]: e.target.value }))
                }
              />
              <button
                className="w-full max-w-[135px] rounded-md px-5 py-[16px] font-pp-sb text-white-100 bg-blue-300 text-[10px] flex items-center justify-center"
                onClick={() => addNotionToken("notion")}
              >
                {appCredentials?.notion?.length > 0 &&
                !addNotionTokenMutation.isLoading
                  ? "Update Token"
                  : "Add Token"}
                {addNotionTokenMutation.isLoading && <Spinner color="#fff" />}
              </button>
            </div>
          </div>

          {/* Showwcase */}
          <div className="w-full mt-[40px] max-w-[450px] flex flex-col items-start justify-start">
            <p className="text-white-100 font-pp-sb text-[18px] ">
              Showwcase Integration
            </p>
            <p className="text-white-300 font-pp-rg text-[13px] ">
              Add your personal showwcase api token. Dont know where to find
              one, follow this guide
              <a
                href="https://gist.github.com/Benrobo/e2cba898bdeb786ab73812aa84b8481a"
                className="textwhite-100 underline ml-1"
              >
                Here
              </a>
            </p>
            <br />
            <div className="w-full flex items-start justify-start gap-3">
              <input
                type="text"
                className="w-full px-4 py-4 text-[12px] rounded-md bg-dark-300 font-pp-rg text-white-100 border-none outline-none "
                placeholder="8f24d64ed20a134bdcdcf7df6b6f437dd129fff2ac1a4c6d814c34"
                defaultValue={appCredentials?.showwcase}
                onChange={(e) =>
                  setToken((prev) => ({
                    ...prev,
                    ["showwcase"]: e.target.value,
                  }))
                }
              />
              <button
                className="w-full max-w-[135px] rounded-md px-5 py-[16px] font-pp-sb text-white-100 bg-blue-300 text-[10px] flex items-center justify-center"
                onClick={() => addNotionToken("showwcase")}
              >
                {appCredentials?.showwcase?.length > 0 &&
                !addNotionTokenMutation.isLoading
                  ? "Update Token"
                  : "Add Token"}
                {addNotionTokenMutation.isLoading && <Spinner color="#fff" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainDashboardLayout>
  );
}

export default withAuth(Settings);
