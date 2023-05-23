import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  AiFillInstagram,
  AiFillLinkedin,
  AiOutlineCodeSandbox,
  AiOutlineStar,
  AiOutlineTwitter,
  AiOutlineUser,
} from "react-icons/ai";
import { BiBook, BiHomeAlt } from "react-icons/bi";
import { BsCalendar } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { IoIosMail, IoLogoOctocat, IoMdMenu } from "react-icons/io";
import { IoBriefcase } from "react-icons/io5";
import { RiGithubLine } from "react-icons/ri";
import { SiHashnode } from "react-icons/si";
import { TbWorld } from "react-icons/tb";
import Gap from "../../../components/Gap";
import { HiOutlineFolder } from "react-icons/hi2";
import { useState } from "react";
import ImageTag from "../../../components/Image";
import moment from "moment";
import { NuroThemeProps } from "../../../@types";
import { isEmpty } from "../../../util";
import { useRouter } from "next/router";
import PreviewNuroTheme from "./preview";

type validPageName = "home" | "about" | "experiences" | "projects";

export default function NuroTheme({
  about,
  fullname,
  ghRepo,
  projects,
  socialLinks,
  tagline,
  userImage,
  experiences,
  email,
  showcaseprofile,
  resumeUrl,
}: NuroThemeProps) {
  const [activePage, setActivePage] = useState<validPageName>("home");
  const router = useRouter();
  const params = router.query;
  const previewMode = Boolean(params["preview"]) ?? false;

  if (previewMode) {
    return <PreviewNuroTheme />;
  }

  if (typeof location !== "undefined") {
    const pathName = location.pathname;
    const splitPath = pathName.split("/");
    const themeName = splitPath[splitPath.length - 1];
    if (themeName === "nuro") return <PreviewNuroTheme />;
  }

  const handleActivePage = (page: validPageName) => setActivePage(page);

  let renderedPage = null;

  function renderPage(activePage: validPageName) {
    if (activePage === "home") {
      renderedPage = <HomeSection tagline={tagline} fullname={fullname} />;
    }
    if (activePage === "experiences") {
      renderedPage = <Experiences workExperience={experiences} />;
    }
    if (activePage === "about") {
      renderedPage = (
        <AboutSection content={about.content} stacks={about?.stacks} />
      );
    }
    if (activePage === "projects") {
      renderedPage = <ProjectSection projects={projects} githubRepo={ghRepo} />;
    }
    return renderedPage;
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-black via-gray-800 to-black from-20% to-80% font-inter text-gray-500 selection:bg-white-600 selection:text-white-300 overflow-auto scroll-smooth hideScrollBar">
      <TopNavBar
        handleActivePage={handleActivePage}
        userImage={userImage}
        socialLinks={socialLinks}
        email={email}
        resumeUrl={resumeUrl}
      />
      <main className="w-full md:max-w-[900px] mx-auto h-auto min-h-full transition-all px-8 py-12 flex flex-col items-center justify-center scroll-smooth">
        {renderPage(activePage)}
      </main>
      <Gap height={20} />
    </div>
  );
}

// Navbar
interface NavbarProps {
  handleActivePage: (pageName: validPageName) => void;
  userImage?: string;
  socialLinks?: {
    label?: string;
    url?: string;
  }[];
  email: string;
  resumeUrl?: string;
}

function TopNavBar({
  handleActivePage,
  userImage,
  socialLinks,
  email,
  resumeUrl,
}: NavbarProps) {
  const allLinks = [
    ...(socialLinks ?? []),
    ...(resumeUrl ? [{ label: "resume", url: resumeUrl }] : []),
    ...(email ? [{ label: "email", url: `mailto:${email}` }] : []),
  ];

  function renderSocialLinkIcon(label: string) {
    console.log(label);
    let icon = null;
    if (label === "hashnode") {
      icon = <SiHashnode className="text-white-100" size={20} />;
    }
    if (label === "github") {
      icon = <RiGithubLine className="text-white-100" size={20} />;
    }
    if (label === "instagram") {
      icon = <AiFillInstagram className="text-white-100" size={20} />;
    }
    if (label === "twitter") {
      icon = <AiOutlineTwitter className="text-white-100" size={20} />;
    }
    if (label === "linkedin") {
      icon = <AiFillLinkedin className="text-white-100" size={20} />;
    }
    if (label === "website") {
      icon = <TbWorld className="text-white-100" size={20} />;
    }
    if (label === "email") {
      icon = <IoIosMail className="text-white-100" size={20} />;
    }
    if (label === "resume") {
      icon = <BiBook className="text-white-100" size={20} />;
    }
    return icon;
  }

  return (
    <div className="w-full h-auto fixed top-0 left-0 flex items-center justify-between z-[100] ">
      <div className="w-full flex items-start justify-start px-4 py-3">
        <Menu>
          <MenuButton
            px={3}
            py={5}
            transition="all 0.2s"
            borderRadius="md"
            background="#181920"
            borderWidth="3px"
            borderColor={"transparent"}
            _hover={{ bg: "#181920" }}
            _expanded={{
              bg: "#181920",
              borderColor: "#3F7EEE",
            }}
            _focus={{ boxShadow: "outline" }}
            as={Button}
          >
            <IoMdMenu />
          </MenuButton>
          <MenuList
            background={"#101014"}
            outline={"none"}
            borderWidth="1px"
            borderColor={"rgba(255,255,255,0.08)"}
            boxShadow={"dark-sm"}
          >
            <MenuItem
              transition={"all .5s"}
              py={3}
              _hover={{ bg: "#1E1E22", opacity: "1", color: "#fff" }}
              opacity={".6"}
              background={"#101014"}
              className="pp-RG py-4 text-[15px] flex items-center justify-start gap-3"
              onClick={() => handleActivePage("home")}
            >
              <BiHomeAlt size={20} color="#ccc" /> Home
            </MenuItem>
            <MenuItem
              transition={"all .5s"}
              py={3}
              _hover={{ bg: "#1E1E22", opacity: "1", color: "#fff" }}
              opacity={".6"}
              background={"#101014"}
              className="pp-RG py-4 text-[15px] flex items-center justify-start gap-3"
              onClick={() => handleActivePage("about")}
            >
              <AiOutlineUser size={20} color="#ccc" /> About
            </MenuItem>
            <MenuItem
              transition={"all .5s"}
              py={3}
              _hover={{ bg: "#1E1E22", opacity: "1", color: "#fff" }}
              opacity={".6"}
              background={"#101014"}
              className="pp-RG py-4 text-[15px] flex items-center justify-start gap-3"
              onClick={() => handleActivePage("experiences")}
            >
              <IoBriefcase size={20} color="#ccc" /> Experiences
            </MenuItem>
            <MenuItem
              transition={"all .5s"}
              py={3}
              _hover={{ bg: "#1E1E22", opacity: "1", color: "#fff" }}
              opacity={".6"}
              background={"#101014"}
              className="pp-RG py-4 text-[15px] flex items-center justify-start gap-3"
              onClick={() => handleActivePage("projects")}
            >
              <AiOutlineCodeSandbox size={20} color="#ccc" /> Projects
            </MenuItem>
            <MenuDivider />
            {/* Showwcial Links */}
            <div className="w-full flex flex-col items-start justify-start">
              {allLinks?.length > 0
                ? allLinks.map((item) => (
                    <MenuItem
                      transition={"all .5s"}
                      py={3}
                      _hover={{ bg: "#1E1E22", opacity: "1", color: "#fff" }}
                      opacity={".6"}
                      background={"#101014"}
                      className="pp-RG py-4 text-[15px] flex w-full items-center justify-between gap-5"
                    >
                      <div className="w-full flex items-center justify-start gap-3">
                        {renderSocialLinkIcon(item.label.toLowerCase())}
                        <span className="pp-RG">{item.label}</span>
                      </div>
                      <a href={item.url}>
                        <FiExternalLink />
                      </a>
                    </MenuItem>
                  ))
                : null}
            </div>
          </MenuList>
        </Menu>
      </div>
      <div className="w-full flex items-center justify-end px-5 py-4">
        <ImageTag
          className="w-[35px] rounded-[50%] border-solid border-[2px] border-white-100 "
          src={
            userImage ??
            "https://profile-assets.showwcase.com/102662/1683311191679-1683311188721-DSC_1744.jpeg"
          }
        />
      </div>
    </div>
  );
}
interface HomeProps {
  fullname?: string;
  tagline?: string;
}

function HomeSection({ fullname, tagline }: HomeProps) {
  const firstname = fullname?.trim().split(" ")[0];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      <h1 className="text-white-100 dark:text-white text-5xl sm:text-6xl md:text-6xl lg:text-8xl tracking-tight font-extrabold pp-EB">
        Hey{" "}
        <span className="inline-block origin-70 hover:animate-wave">👋</span>{" "}
        I'm {firstname ?? ""}, <br className="hidden sm:block" />a
        <div className="inline-flex px-3 lg:px-5 py-2 md:pb-4 bg-blue-705 bg-opacity-15 backdrop-filter backdrop-blur-sm filter saturate-200 text-primary-200 rounded-2xl default-transition default-focus mt-4 text-blue-200 ml-4">
          developer
        </div>
      </h1>
      <p className="max-w-xs mt-4 md:mt-8 mx-auto pp-RG text-base text-gray-400 sm:text-md md:text-lg md:max-w-3xl">
        {tagline ?? ""}
      </p>
      <br />
      <div className="w-full flex items-center justify-between gap-3"></div>
    </div>
  );
}

// Experiences
interface ExperienceProp {
  workExperience?: {
    id: number | string;
    companyName?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }[];
}

interface JobCardProp {
  id: number | string;
  companyName?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

function Experiences({ workExperience }: ExperienceProp) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-[] flex flex-col items-center justify-start">
        {workExperience.length > 0 ? (
          workExperience.map((exp) => (
            <JobCards
              id={exp.id}
              companyName={exp.companyName}
              current={exp.current}
              description={exp.description}
              endDate={exp.endDate}
              startDate={exp.startDate}
              key={exp.id}
              title={exp.title}
            />
          ))
        ) : (
          <p className="relative opacity-[.4] w-full flex items-center justify-start text-slate-200 text-[12px] ml-5 px-[30px] gap-3 font-mono before:content-['▹'] before:text-blue-301 before:absolute before:left-0 before:top-0 before:text-[20px] mb-5 ">
            I probably dont have any work experience yet, but would surely
            update this when i get one ASAP.
          </p>
        )}
      </div>
    </div>
  );
}

function JobCards({
  id,
  companyName,
  current,
  description,
  endDate,
  startDate,
  title,
}: JobCardProp) {
  function splitDescription(description) {
    const lines = description.split("\n").map((line) => line.trim());
    const result = [];
    let currentLine = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line !== "") {
        currentLine += (currentLine !== "" ? " " : "") + line;
      }

      if (line === "" || i === lines.length - 1) {
        result.push(currentLine);
        currentLine = "";
      }
    }

    return result;
  }
  return (
    <div
      id={id as string}
      className={`w-full md:w-[550px] rounded-md border-solid border-white-600 border-[3px] bg-dark2-800 p-4 py-5 flex items-center justify-start mb-5 `}
    >
      <div className="w-auto h-full flex flex-col items-center justify-center">
        <div className="p-3 bg-blue-705 backdrop-blur rounded-[50%]">
          <IoBriefcase size={20} className=" text-blue-200 " />
        </div>
      </div>
      <div className="relative w-full flex flex-col items-start justify-start px-4">
        <p className="absolute text-[12px] rounded-[5px] top-[-10px] right-0 px-2 py-1 bg-blue-705 text-blue-100 pp-SB flex items-center justify-start gap-2 ">
          <BsCalendar size={15} /> {moment(startDate).format("MMMM yy")} -{" "}
          {current ? "Present" : moment(endDate).format("MMMM yy")}
        </p>
        <h1 className="pp-EB text-white-100">{title}</h1>
        <p className="pp-RG text-[13px] text-white-400 ">@ {companyName}</p>
        <div className="mt-3 flex flex-col items-start justify-start">
          {splitDescription(description).map((d) => (
            <p className="relative w-full flex items-start text-start justify-start text-slate-200 text-[12px] ml-5 px-[30px] gap-3 font-mono before:content-['▹'] before:text-blue-300 before:absolute before:left-0 before:top-[-8px] before:text-[20px] mb-1 ">
              - {d}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

// About

interface AboutProps {
  content?: string;
  stacks?: string[];
}

function AboutSection({ content, stacks }: AboutProps) {
  const formattedAboutCont = content.split("\n").filter((s) => s?.length > 0);

  return (
    <div className="w-full h-full">
      <section
        id="about"
        className="w-full h-full flex flex-col items-center justify-center my-10 mb-10"
      >
        <div className="w-full md:max-w-[450px] flex items-center justify-start">
          <h2 className="w-full flex items-center justify-start text-white-100 m-[10px] pp-SB text-[25px] before:mr-2 after:content-[''] after:w-[300px] after:opacity-[.3] after:h-[.5px] after:bg-slate-200 after:ml-10 ">
            About
          </h2>
        </div>
        <br />
        <div className="w-full md:max-w-[450px] h-auto ">
          <div className="w-full h-full ml-2 flex flex-col items-start justify-start">
            <div className="w-full max-w-[450px] flex flex-col items-start justify-start gap-5 ">
              {!isEmpty(content) ? (
                formattedAboutCont.map((cnt, i) => (
                  <p key={i} className="text-slate-200 pp-RG text-[14px] ">
                    {cnt}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-slate-200 pp-RG text-[14px] ">
                    Opps, I have no about details available, would add this
                    soon!.
                  </p>
                </>
              )}
              <p className="text-slate-200 pp-RG text-[14px]">
                Here are a few technologies I’ve been working with recently:
              </p>
              <div className="w-full max-w-[350px] flex flex-wrap items-center justify-start mt-1 gap-3">
                {stacks?.length > 0 ? (
                  stacks.map((st, i) => (
                    <p
                      key={i}
                      className="text-slate-200 font-mono flex items-center justify-center text-[12px]"
                    >
                      <AiOutlineStar className="text-blue-301 mr-1" size={14} />
                      {st}
                    </p>
                  ))
                ) : (
                  <p className="text-slate-200 opacity-[.4] font-mono flex items-center justify-center text-[12px]">
                    <AiOutlineStar className="text-blue-301 mr-1" size={14} />
                    Opps 🙊, I gat no tech stacks.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Projects
interface ProjectsProps {
  projects?: {
    name?: string;
    description?: string;
    tags?: string[];
    ghUrl?: string;
    live_url?: string;
    image: string;
  }[];
  githubRepo?: {
    name?: string;
    description?: string;
    tags?: string[];
    url?: string;
  }[];
}

function ProjectSection({ githubRepo, projects }: ProjectsProps) {
  return (
    <section className="w-full md:max-w-[700px] h-full my-10 mb-10">
      <div className="w-full flex items-center justify-start">
        <h2 className="w-full flex items-center justify-start text-white-100 m-[10px] pp-SB text-[25px] before:mr-2 after:content-[''] after:w-[300px] after:h-[.5px] after:opacity-[.3] after:bg-slate-200 after:ml-10 ">
          Projects
        </h2>
      </div>
      <div
        className={`w-full p-0 flex flex-wrap items-start justify-start gap-2`}
      >
        {projects.length > 0
          ? projects.map((proj) => (
              <PortfolioCards
                githubUrl={proj.ghUrl}
                description={proj.description}
                image={proj.image}
                liveUrl={proj.live_url}
                tags={proj.tags}
                title={proj.name}
              />
            ))
          : null}
      </div>
      <div className="w-full max-w-[600px] ">
        <div className="w-full flex flex-col items-center justify-between gap-5 mt-3 py-[40px]">
          {githubRepo.length > 0
            ? githubRepo.map((gh) => (
                <GithubRepoCards
                  githubUrl={gh.url}
                  description={gh.description}
                  tags={gh.tags}
                  title={gh.name}
                />
              ))
            : null}
        </div>
      </div>
    </section>
  );
}

interface PortfolioCardsProp {
  title?: string;
  description?: string;
  githubUrl: string;
  liveUrl?: string;
  tags?: string[];
  image?: string;
}

function PortfolioCards({
  description,
  githubUrl,
  liveUrl,
  tags,
  title,
  image,
}: PortfolioCardsProp) {
  const projImageStyle = {
    backgroundImage: `url(${image ?? "/images/themes/demo1.webp"})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  return (
    <div className="w-full max-w-[200px] h-full max-h-[500px] rounded-[15px] bg-dark-100 p-4 mt-4 ">
      <div
        className="relative w-full max-h-[200px] h-[150px] bg-white-100 rounded-[15px] project-image "
        style={projImageStyle}
      >
        <div className="w-auto flex items-center justify-center bg-white-500 backdrop-blur-[10px] p-2 absolute top-0 right-0 gap-3 rounded-t-[15px] rounded-l-[0px] ">
          {!isEmpty(githubUrl) && (
            <a href={githubUrl ?? "#"}>
              <IoLogoOctocat className="text-white-400" size={20} />
            </a>
          )}
          {!isEmpty(liveUrl) && (
            <a href={liveUrl ?? "#"}>
              <FiExternalLink className="text-white-400" size={20} />
            </a>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col items-start justify-start py-2 mt-2">
        <p className="text-white-100 pp-EB text-[18px] mb-2 ">{title}</p>
        <p className="text-white-300 pp-RG text-[12px] mb-5 ">
          {description ?? ""}
        </p>
        <div className="flex items-start justify-start flex-wrap gap-2">
          {tags?.length > 0
            ? tags.map((t) => (
                <span
                  key={t}
                  className="text-slate-200 font-mono text-[10px] px-2 py-1 rounded-md bg-dark-300 "
                >
                  {t}
                </span>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

interface GHRepoCardsProp {
  title?: string;
  description?: string;
  githubUrl: string;
  tags?: string[];
}

function GithubRepoCards({
  githubUrl,
  description,
  tags,
  title,
}: GHRepoCardsProp) {
  return (
    <div className="relative w-full h-auto px-4 py-4 rounded-[10px] flex items-center justify-start bg-dark-100 shadow-lg border-solid border-[1px] border-white-600 ">
      <div className="w-auto h-full flex flex-col items-center justify-center">
        <div className="p-2 bg-blue-705 backdrop-blur rounded-[50%]">
          <AiOutlineCodeSandbox size={20} className=" text-blue-200 " />
        </div>
      </div>
      <div className="w-full flex items-start justify-between">
        <div className="w-full min-w-full flex flex-col items-start justify-start px-4 py-1">
          <p className="text-white-100 pp-SB text-[13px] ">{title}</p>
          <p className="w-full text-white-400 pp-RG text-[12px] ">
            {description ?? ""}
          </p>
        </div>
        <div className="w-full absolute right-3 top-2 flex items-center justify-end">
          <a
            href={githubUrl ?? ""}
            className="p-2 hover:bg-dark-200 border-solid border-[1px] border-white-600 flex flex-col items-center justify-center transition-all rounded-md "
          >
            <RiGithubLine />
          </a>
        </div>
      </div>
    </div>
  );
}
