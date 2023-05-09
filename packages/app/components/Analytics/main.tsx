import React, { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { HiArrowLongUp } from "react-icons/hi2";
import { TbClick } from "react-icons/tb";
import { formatNumber } from "../../util/formatNumber";
import { SiteViewsAnalyticsChart, TinyAreaChart } from "./charts";
// import countries from "../../data/countries.json";
import { FormControl, Select } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getAllSiteViews } from "../../http";
import { HandleDashboardResponse } from "../../util/response";

function MainCardAnalytics() {
  const [siteViews, setSiteViews] = useState<
    { views: number; slug: string; date: string }[]
  >([]);
  const siteViewsQuery = useQuery({
    queryFn: async () => await getAllSiteViews(),
    queryKey: ["siteViews"],
  });

  const [selectedSite, setSelectedSite] = useState<
    { views: number; slug: string; date: string } | any
  >({});

  const handleSelectedSite = (e: any) => {
    const value = e.target?.value;
    if (value.length === 0) return;
    const filteredSite = siteViews.filter((d) => d.slug === value)[0];
    setSelectedSite(filteredSite);
  };

  useEffect(() => {
    const { data, error } = siteViewsQuery;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      HandleDashboardResponse(
        response,
        () => {},
        (data) => {
          if (data?.length > 0) {
            setSiteViews(data);
            setSelectedSite(data[0]);
          }
        },
        () => {}
      );
    }
  }, [siteViewsQuery.data]);

  return (
    <div className="w-full h-auto px-[2em] flex flex-col items-start justify-between gap-7">
      <div className="w-full flex flex-col items-start justify-around">
        <div className="w-full flex items-center justify-between gap-5">
          <AnalyticsCard
            data={siteViews}
            handleSelectedSite={handleSelectedSite}
            title="Site Clicks"
            Icon={
              <TbClick className="p-1 text-white-400 text-3xl rounded-md" />
            }
            count={selectedSite?.views}
          />
        </div>
      </div>
    </div>
  );
}

export default MainCardAnalytics;

interface AnanlyticsCardProps {
  title: string;
  data?: { views: number; slug: string; date: string }[];
  handleSelectedSite?: (e: any) => void;
  count: number;
  Icon: React.ReactNode;
}

function AnalyticsCard({
  title,
  Icon,
  data,
  handleSelectedSite,
  count,
}: AnanlyticsCardProps) {
  return (
    <div className="w-[300px] h-[150px] px-5 py-5 rounded-md bg-dark-200 flex flex-col items-start justify-start gap-5  relative overflowHidden shadow-lg border-[1px] border-solid border-white-600 ">
      <div className="w-full z-[100] ">
        <div className="top w-full flex items-center justify-between gap-2">
          <div className="flex items-center justify-start ">
            {Icon}
            <p className="text-white-300 pp-SB ">{title}</p>
          </div>
          <div className="absolute w-[100px] top-5 right-2 flex flex-col items-start justify-start">
            <FormControl>
              <Select
                borderWidth={".2px"}
                borderColor={"whiteAlpha.600"}
                color={"whiteAlpha.600"}
                onChange={handleSelectedSite}
              >
                {data.length > 0 ? (
                  data.map((d) => <option value={d.slug}>{d.slug}</option>)
                ) : (
                  <option value="">Select Slug</option>
                )}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="bottom w-full flex flex-col items-start justify-start mt-5">
          <p className="text-white-100 pp-SB text-5xl">{formatNumber(count)}</p>
        </div>
      </div>
      <div className="w-full absolute bottom-[-4px] left-[-5px]">
        {/* <TinyAreaChart data={data} dataKey="uv" /> */}
      </div>
    </div>
  );
}
