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
  const [notionToken, setNotionToken] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const { data, error } = getNotionTokenQuery;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleSettingsResponse(
        response,
        () => {},
        (data) => setNotionToken(data)
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

  function addNotionToken() {
    if (token === notionToken || token.length === 0) {
      toast.error("Token hasn't changed or is empty.");
      return;
    }
    addNotionTokenMutation.mutate({ token } as any);
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
        <div className="w-full flex flex-col items-start justify-start px-5 py-4">
          {/* Notion Integration */}
          <div className="w-full max-w-[450px] flex flex-col items-start justify-start">
            <p className="text-white-100 font-pp-sb text-[18px] ">
              Notion Integration
            </p>
            <p className="text-white-300 font-pp-rg text-[13px] ">
              Add your notion integration token. Dont know where to find one,
              follow this guide
              <a href="#" className="textwhite-100 underline">
                Here
              </a>
            </p>
            <br />
            <div className="w-full flex items-start justify-start gap-3">
              <input
                type="text"
                className="w-full px-4 py-4 text-[12px] rounded-md bg-dark-300 font-pp-rg text-white-100 border-none outline-none "
                placeholder="secret_7JuYFMeNMdssGSgzcdWm8wD4hDxcKXlaaJFFVTQXZQez"
                defaultValue={notionToken}
                onChange={(e) => setToken(e.target.value)}
              />
              <button
                className="w-full max-w-[135px] rounded-md px-5 py-[16px] font-pp-sb text-white-100 bg-blue-300 text-[10px] flex items-center justify-center"
                onClick={addNotionToken}
              >
                {notionToken.length > 0 && !addNotionTokenMutation.isLoading
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
