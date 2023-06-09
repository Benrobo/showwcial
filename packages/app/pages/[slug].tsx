import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getCreatedSiteBySlug } from "../http";
import { isEmpty } from "../util";
import ImageTag from "../components/Image";
import OasisTheme from "./themes/oasis";
import { LoaderModal } from "../components/Loader";
import NuroTheme from "./themes/nuro";
import { NuroThemeProps, OasisProps } from "../@types";

function UserPortfolio() {
  const router = useRouter();
  const { slug } = router.query;
  const [error, setError] = useState(null);
  const [notfound, setNotfound] = useState(false);
  const portfolioDataQuery = useQuery({
    queryFn: async () => await getCreatedSiteBySlug(slug),
    queryKey: ["portfolioSiteData"],
    enabled: isEmpty(slug as string) ? false : true,
  });
  const [siteData, setSiteData] = useState<null | any>(null);

  let userRenderedSiteTheme = null;

  useEffect(() => {
    const { data, error } = portfolioDataQuery;
    if (typeof data !== "undefined" || error !== null) {
      const response = data;
      if (response?.errorStatus) {
        const { msg, notfound } = handleServerError(response, null);
        setNotfound(notfound);
        if (msg !== null) setError(msg);
        return;
      }

      setError(null);
      setNotfound(false);

      const themeData = response?.data?.sites;
      setSiteData(themeData);
    }
  }, [portfolioDataQuery.data]);

  if (portfolioDataQuery?.isLoading) {
    return <LoaderModal />;
  }

  if (siteData !== null) {
    if (siteData?.themeName === "oasis") {
      const {
        about,
        email,
        fullname,
        ghRepo,
        headline,
        resumeUrl,
        socialLinks,
        stacks,
        tagline,
        userImage,
        experiences,
      } = siteData?.portfolioData as OasisProps;
      const portfolioProjects = siteData?.portfolioProjects;

      userRenderedSiteTheme = (
        <OasisTheme
          about={{ content: about ?? "", image: userImage }}
          email={email}
          fullname={fullname.trim() ?? ""}
          githubRepo={ghRepo}
          headline={headline}
          tagline={tagline}
          resumeUrl={resumeUrl ?? "#"}
          showcaseprofile={siteData?.showwcaseProfile}
          socialLinks={socialLinks}
          stacks={stacks}
          workExperience={experiences}
          projects={portfolioProjects}
        />
      );
    }
    if (siteData?.themeName === "nuro") {
      const {
        email,
        fullname,
        ghRepo,
        resumeUrl,
        socialLinks,
        tagline,
        headline,
        userImage,
        experiences,
      } = siteData?.portfolioData as NuroThemeProps;
      const about = siteData?.portfolioData["about"];
      const techStacks = siteData?.portfolioData["stacks"];
      const portfolioProjects = siteData?.portfolioProjects;

      userRenderedSiteTheme = (
        <NuroTheme
          about={{ content: about ?? "", stacks: techStacks }}
          userImage={userImage}
          email={email}
          fullname={fullname.trim() ?? ""}
          ghRepo={ghRepo}
          tagline={tagline}
          headline={headline}
          resumeUrl={resumeUrl ?? "#"}
          showcaseprofile={siteData?.showwcaseProfile}
          socialLinks={socialLinks}
          experiences={experiences}
          projects={portfolioProjects}
        />
      );
    }
  }

  return (
    <div className="w-full h-screen overflow-x-hidden">
      {userRenderedSiteTheme}
      {error !== null && <ErrorComp notfound={notfound} message={error} />}
    </div>
  );
}

export default UserPortfolio;

function handleServerError(response: any, resetState: () => void) {
  let error = {
    msg: null,
    notfound: false,
  };
  if (response?.message === "Network Error") {
    error["msg"] = `${response?.message}. Try again later.`;
    resetState && resetState();
  }
  if (response?.code === "ECONNABORTED") {
    error["msg"] = `Connection Error. Try again later.`;
    resetState && resetState();
  }
  if (
    response?.code === "--route/route-not-found" ||
    response?.code === "--api/server-error"
  ) {
    error["msg"] = `Something went wrong. Try again later.`;
    resetState && resetState();
  }

  if (response?.code === "--siteBySlug/notfound") {
    error["msg"] = `Opps! Site doesnt exists.`;
    error["notfound"] = true;
    resetState && resetState();
  }
  if (response?.code === "--siteBySlug/success") {
    error["msg"] = null;
    resetState && resetState();
  }

  return error;
}

interface ErrorProp {
  notfound: boolean;
  message: string;
}

function ErrorComp({ notfound, message }: ErrorProp) {
  return (
    <div className="w-full h-screen hideScrollbar flex flex-col items-center justify-center bg-dark-300 ">
      <div className="w-full max-w-[500px] flex flex-col items-center justify-center">
        <ImageTag
          src={
            notfound ? "/images/headers/404-2.png" : "/images/headers/error.png"
          }
          className="max-w-[50%]"
        />
        <h2 className="text-blue-200 pp-EB text-[30px] ">An Error Occured!</h2>
        <p className="text-white-300 pp-RG text-[13px] ">{message}</p>
      </div>
    </div>
  );
}
