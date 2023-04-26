import React from "react";
import { AiFillEye } from "react-icons/ai";
import { HiArrowLongUp } from "react-icons/hi2";
import { TbClick } from "react-icons/tb";
import { formatNumber } from "../../util/formatNumber";
import { SiteViewsAnalyticsChart, TinyAreaChart } from "./charts";
import countries from "../../data/countries.json";
import { FormControl, Select } from "@chakra-ui/react";

interface ReturnedCountryData {
  emoji?: string;
  name?: string;
  code?: string;
  count?: number;
  image?: string;
}

function getCountryFlag(countryData: any): ReturnedCountryData[] {
  const filteredCountries = countries.filter((country) => {
    for (let i = 0; i < countryData.length; i++) {
      if (country.code === countryData[i].name) {
        country["count"] = countryData[i]?.uv;
        return country;
      }
    }
  });

  return filteredCountries;
}

function MainCardAnalytics() {
  const data = [
    {
      name: "NG",
      uv: 200,
    },
    {
      name: "KE",
      uv: 2000,
    },
    {
      name: "US",
      uv: 1500,
    },
    {
      name: "UK",
      uv: 2380,
    },
  ];

  const siteviewData = [
    {
      timeframe: "Monday",
      views: 2200,
    },
    {
      timeframe: "Tuesday",
      views: 2000,
    },
    {
      timeframe: "Wednesday",
      views: 1500,
    },
    {
      timeframe: "Thursday",
      views: 1123,
    },
    {
      timeframe: "Friday",
      views: 455,
    },
    {
      timeframe: "Saturday",
      views: 3000,
    },
    {
      timeframe: "Sunday",
      views: 20,
    },
  ];

  return (
    <div className="w-full h-auto px-[2em] flex flex-col items-start justify-between gap-7">
      <div className="w-full flex flex-col items-start justify-around">
        <div className="w-full flex items-center justify-between gap-5">
          <AnalyticsCard
            data={data}
            title="Site Clicks"
            Icon={
              <TbClick className="p-1 text-white-400 text-3xl rounded-md" />
            }
            count={200}
          />
          <AnalyticsCard
            data={data}
            title="Impression"
            Icon={
              <AiFillEye className="p-1 text-white-400 text-3xl rounded-md" />
            }
            count={2100}
          />
          <AnalyticsCard
            data={data}
            title="Engagements"
            Icon={
              <AiFillEye className="p-1 text-white-400 text-3xl rounded-md" />
            }
            count={3100000}
          />
        </div>
      </div>
      <div className="w-full flex items-start justify-between gap-4 mt-7 ">
        {/* Large analytic graph */}
        <div className="w-full h-auto py-4 border-[1px] border-solid border-white-600 rounded-lg">
          <div className="w-full px-4 flex items-center justify-between">
            <p className="text-white-200 pp-SB">Sites Views</p>
            <div className="w-auto flex items-center justify-start">
              <FormControl>
                <Select
                  borderWidth={"1px"}
                  borderColor={"whiteAlpha.600"}
                  color={"whiteAlpha.600"}
                >
                  <option>Today</option>
                  <option>Last 7 Days</option>
                  <option>2 Weeks</option>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="w-full h-[300px]">
            <SiteViewsAnalyticsChart
              fill="rgba(1, 65, 226, 0.1)"
              data={siteviewData}
              strokeWidth={3}
              dataKey="views"
            />
          </div>
        </div>
        {/* Top countries analytics */}
        <div className="w-[35%] bg-dark-200 flex flex-col items-start justify-start border-[1px] border-solid border-white-600 rounded-lg">
          <div className="w-full rounded-md flex items-center justify-between px-5 py-3">
            <p className="text-white-100 pp-SB text-[14px] ">Countries</p>
            <div className="w-auto">
              <FormControl>
                <Select
                  borderWidth={"1px"}
                  borderColor={"whiteAlpha.600"}
                  color={"whiteAlpha.600"}
                  fontSize="13px"
                  width={100}
                >
                  <option>Clicks</option>
                  <option>Impression</option>
                  <option>Engagements</option>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="w-full border-t-solid border-t-[1px] border-t-white-600 py-4 "></div>
          <div className="w-full px-5 py-2 flex flex-col items-start justify-between">
            {getCountryFlag(data).map((data) => (
              <div
                key={data.code}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center justify-start gap-3">
                  <span className="bg-dark-200 rounded-xl">{data.emoji}</span>
                  <span className="text-white-200 pp-SB text-[14px]">
                    {data.name}
                  </span>
                </div>
                <span className="text-white-200 pp-SB text-[14px]">
                  {formatNumber(data?.count)}
                </span>
              </div>
            ))}
          </div>
          <br />
        </div>
      </div>
    </div>
  );
}

export default MainCardAnalytics;

interface AnanlyticsCardProps {
  title: string;
  data: object[];
  count: number;
  Icon: React.ReactNode;
}

function AnalyticsCard({ title, Icon, data, count }: AnanlyticsCardProps) {
  return (
    <div className="w-[300px] h-[150px] px-7 py-5 rounded-md bg-dark-200 flex flex-col items-start justify-start gap-5  relative overflowHidden shadow-lg border-[1px] border-solid border-white-600 ">
      <div className="w-full z-[100] ">
        <div className="top w-full flex items-center justify-between gap-2">
          <div className="flex items-center justify-start ">
            {Icon}
            <p className="text-white-300 pp-SB ">{title}</p>
          </div>
          <div className="absolute top-5 right-5 flex flex-col items-start justify-start">
            <span className="text-green-400 flex items-center justify-center text-green-200 pp-SB gap-1">
              <HiArrowLongUp className="text-1xl" />
              <span className="text-[17px]">75%</span>
            </span>
          </div>
        </div>
        <div className="bottom w-full flex flex-col items-start justify-start mt-5">
          <p className="text-white-100 pp-SB text-5xl">{formatNumber(count)}</p>
        </div>
      </div>
      <div className="w-full absolute bottom-[-4px] left-[-5px]">
        <TinyAreaChart data={data} dataKey="uv" />
      </div>
    </div>
  );
}
