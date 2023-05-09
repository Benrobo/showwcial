import {
  AiFillInstagram,
  AiFillLinkedin,
  AiOutlineStar,
  AiOutlineTwitter,
} from "react-icons/ai";
import { RiGithubLine } from "react-icons/ri";
import { SiHashnode } from "react-icons/si";
import ImageTag from "../../../components/Image";
import Gap from "../../../components/Gap";
import { IoLogoOctocat } from "react-icons/io";
import { FiExternalLink } from "react-icons/fi";
import { HiOutlineFolder } from "react-icons/hi2";
import ShowwcialBanner from "../comp/banner";
import { isEmpty } from "../../../util";
import { useRouter } from "next/router";
import PreviewOasisTheme from "./preview";
import { useState } from "react";
import moment from "moment";
import { TbWorld } from "react-icons/tb";

interface OasisProps {
  resumeUrl?: string;
  userImage?: string;
  email?: string;
  socialLinks?: {
    label?: string;
    url?: string;
  }[];
  fullname?: string;
  tagline?: string;
  headline?: string;
  showcaseprofile?: string;
  about?: {
    content?: string;
    image?: string;
  };
  stacks?: string[];
  workExperience?: {
    id: number | string;
    companyName?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }[];
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
    githubUrl?: string;
  }[];
}

export default function OasisTheme({
  resumeUrl,
  about,
  email,
  fullname,
  githubRepo,
  headline,
  projects,
  showcaseprofile,
  socialLinks,
  stacks,
  tagline,
  userImage,
  workExperience,
}: OasisProps) {
  const router = useRouter();
  const params = router.query;
  const previewMode = Boolean(params["preview"]) ?? false;

  if (previewMode) {
    return <PreviewOasisTheme />;
  }

  const formattedAboutCont = about?.content
    .replace(" ", "")
    .split("\n")
    .filter((s) => s?.length > 0);

  function renderSocialLinkIcon(label: string) {
    console.log(label);
    let icon = null;
    if (label === "hashnode") {
      icon = <SiHashnode className="text-blue-301" size={25} />;
    }
    if (label === "github") {
      icon = <RiGithubLine className="text-blue-301" size={25} />;
    }
    if (label === "instagram") {
      icon = <AiFillInstagram className="text-blue-301" size={25} />;
    }
    if (label === "twitter") {
      icon = <AiOutlineTwitter className="text-blue-301" size={25} />;
    }
    if (label === "linkedin") {
      icon = <AiFillLinkedin className="text-blue-301" size={25} />;
    }
    if (label === "website") {
      icon = <TbWorld className="text-blue-301" size={25} />;
    }
    return icon;
  }

  return (
    <div className="w-full h-screen font-pp-sb flex flex-col items-start justify-start bg-dark-300 scroll-smooth transition-all  overflow-y-scroll hideScrollBar2">
      {/* Top Navbar */}
      <div className="w-full h-auto z-[100] fixed top-0 p-2 bg-dark-900 backdrop-blur ">
        <div className=" flex items-center justify-between ">
          <div className="w-full ml-8">
            <ImageTag className="w-[40px] rounded-[50%]" src={about?.image} />
          </div>
          <div className="w-auto flex items-center justify-start mr-8 ">
            <ul className="w-full flex items-center justify-start">
              <li className="flex items-center justify-center gap-2 m-2">
                <a
                  href="#about"
                  className="flex gap-2 p-[10px] font-mono before:content-['01.'] before:text-blue-301 before:font-mono text-[13px] text-white-100 hover:text-blue-301 transition-all"
                >
                  About
                </a>
              </li>
              <li className="flex items-center justify-center gap-2 m-2">
                <a
                  href="#experience"
                  className="flex gap-2 p-[10px] font-mono before:content-['02.'] before:text-blue-301 before:font-mono text-[13px] text-white-100 hover:text-blue-301 transition-all"
                >
                  Experience
                </a>
              </li>
              <li className="flex items-center justify-center gap-2 m-2">
                <a
                  href="#projects"
                  className="flex gap-2 p-[10px] font-mono before:content-['03.'] before:text-blue-301 before:font-mono text-[13px] text-white-100 hover:text-blue-301 transition-all"
                >
                  Projects
                </a>
              </li>
              <li className="flex items-center justify-center gap-2 m-2">
                <a
                  href="#contacts"
                  className="flex gap-2 p-[10px] font-mono before:content-['04.'] before:text-blue-301 before:font-mono text-[13px] text-white-100 hover:text-blue-301 transition-all"
                >
                  Contacts
                </a>
              </li>
              <li className="flex items-center justify-center gap-2 m-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  className="w-auto px-5 py-2 rounded-md border-solid border-[2px] border-blue-301 text-blue-301 scale-[.95] hover:scale-[1] transition-all font-pp-rg text-[13px]"
                >
                  Resume
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Socials Links and Email Section Section */}
      <div
        id="orientation"
        className="w-[40px] h-full max-h-[335px] fixed left-[40px] right-auto bottom-0 z-[10] "
      >
        <ul className="w-full h-full max-h-[220px] flex flex-col items-center justify-end gap-6 after:fixed after:left-[60px] after:bottom-0 after:w-[1px] after:h-[90px] after:contents-[''] after:bg-white-400 ">
          {socialLinks?.length > 0
            ? socialLinks.map((d) => (
                <li className="flex flex-col items-center justify-center">
                  <a href={d.url}>
                    {renderSocialLinkIcon(d.label.toLowerCase())}
                  </a>
                </li>
              ))
            : null}
        </ul>
      </div>
      <div
        id="orientation"
        className="w-[40px] h-full max-h-[335px] fixed right-[40px] left-auto bottom-0 z-[10] "
      >
        <ul className="w-full h-full flex flex-col items-center justify-center after:w-[1px] after:h-[120px] after:contents-[''] after:bg-white-400 ">
          <div className="w-full h-full max-h-[230px] flex flex-col items-center justify-center">
            <a
              href={`mailto:${email ?? ""}`}
              className="text-blue-301 font-mono text-[14px] rotate-[90deg] mt-[20px] space-y-[20px] "
            >
              {email ?? "johndoe@mail.com"}
            </a>
          </div>
        </ul>
      </div>
      <main className="w-full h-auto flex flex-col items-start justify-start px-[150px]">
        {/* Header */}
        <section className="w-full h-full  flex flex-col items-start justify-start pt-[100px]">
          <p className="text-blue-301 font-mono font-medium">Hi, my name is </p>
          <div className="w-full flex flex-col items-start justify-start">
            <h2 className=" text-[60px] space-y-[10px] text-slate-100 font-pp-eb ">
              {fullname ?? "Benaiah Alumona"}
            </h2>
            <h2 className=" text-[60px] space-y-[10px] text-slate-200 font-pp-eb ">
              {tagline ?? "I solve problem for a living."}
            </h2>
            <p className="text-[16px] max-w-[540px] mt-5 text-slate-200 font-pp-rg ">
              {headline ??
                `Mission driven software engineer, with a passion for thoughtful UI
              design, collaboration, and teaching.`}
            </p>
            <a
              href={showcaseprofile}
              target="_blank"
              className="w-auto flex items-center justfy-center px-6 py-5 rounded-[5px] border-solid border-[2px] border-blue-301 text-blue-301 mt-10 text-[13px] font-mono"
            >
              Showwcase Profile!
            </a>
          </div>
          <Gap height={300} />
        </section>
        {/* About Section */}
        <section id="about" className="w-full h-full my-10 mb-10">
          <div className="w-full flex items-center justify-start">
            <h2 className="w-full flex items-center justify-start text-white-100 m-[10px] font-pp-sb text-[25px] before:content-['01.'] before:font-mono before:text-blue-301 before:mr-2 after:content-[''] after:w-[300px] after:opacity-[.3] after:h-[.5px] after:bg-slate-200 after:ml-10 ">
              About
            </h2>
          </div>
          <br />
          <div className="w-full grid grid-cols-2 ">
            <div className="w-full ml-2 flex flex-col items-start justify-start">
              <div className="w-full max-w-[450px] flex flex-col items-start justify-start gap-5 ">
                {!isEmpty(about?.content) ? (
                  formattedAboutCont.map((cnt, i) => (
                    <p
                      key={i}
                      className="text-slate-200 font-pp-rg text-[14px] "
                    >
                      {cnt}
                    </p>
                  ))
                ) : (
                  <>
                    <p className="text-slate-200 font-pp-rg text-[14px] ">
                      17+ years of experience in Software Development and User
                      Interface Engineering. Bringing forth expertise in the
                      design, development, and delivery of software systems.
                      Equipped with a diverse and promising skill-set.
                      Proficient in various platforms, and languages. Able to
                      effectively self-manage during independent projects, as
                      well as collaborate as part of a productive team.
                    </p>
                    <p className="text-slate-200 font-pp-rg text-[14px] ">
                      A passionate content creator who wrote over 200 articles
                      on his own blog and many other freelancing engagements
                      like freeCodeCamp, CSS-Tricks, and many more. Always up
                      for knowledge sharing with tips and tricks on Twitter and
                      recently launched YouTube channel. An open-source
                      enthusiast created several projects in the areas of web
                      development to create tools, mentoring resources, and
                      guides.
                    </p>
                  </>
                )}
                <p className="text-slate-200 font-pp-rg text-[14px]">
                  Here are a few technologies I’ve been working with recently:
                </p>
                <div className="w-full max-w-[350px] flex flex-wrap items-center justify-start mt-1 gap-3">
                  {stacks?.length > 0 ? (
                    stacks.map((st, i) => (
                      <p
                        key={i}
                        className="text-slate-200 font-mono flex items-center justify-center text-[12px]"
                      >
                        <AiOutlineStar
                          className="text-blue-301 mr-1"
                          size={14}
                        />
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
            <div className="w-full  h-[300px] flex items-start justify-end ">
              <div className="w-auto">
                <ImageTag
                  className="w-[300px] rounded-md "
                  src={
                    about?.image ??
                    "https://profile-assets.showwcase.com/102662/1683311191679-1683311188721-DSC_1744.jpeg"
                  }
                />
              </div>
            </div>
          </div>
        </section>
        {/* Experience / Job Section */}
        <section
          id="experience"
          className="w-full max-w-[900px] h-full my-10 mb-10"
        >
          <div className="w-full flex items-center justify-start">
            <h2 className="w-full flex items-center justify-start text-white-100 m-[10px] font-pp-sb text-[25px] before:content-['02.'] before:font-mono before:text-blue-301 before:mr-2 after:content-[''] after:w-[300px] after:opacity-[.3] after:h-[.5px] after:bg-slate-200 after:ml-10 ">
              Work Experience
            </h2>
          </div>
          <br />
          <div id="experience"></div>
          <div className="w-full  px-[20px] flex items-start justify-start">
            {workExperience?.length > 0 ? (
              <WorkExperience workexp={workExperience} />
            ) : (
              <p className="relative opacity-[.4] w-full flex items-center justify-start text-slate-200 text-[12px] ml-5 px-[30px] gap-3 font-mono before:content-['▹'] before:text-blue-301 before:absolute before:left-0 before:top-0 before:text-[20px] mb-5 ">
                I probably dont have any work experience yet, but would surely
                update this when i get one ASAP.
              </p>
            )}
          </div>
        </section>
        {/* Projects Section */}
        <section className="w-full h-full my-10 mb-10">
          <div className="w-full flex items-center justify-start">
            <h2 className="w-full flex items-center justify-start text-white-100 m-[10px] font-pp-sb text-[25px] before:content-['03.'] before:font-mono before:text-blue-301 before:mr-2 after:content-[''] after:w-[300px] after:h-[.5px] after:opacity-[.3] after:bg-slate-200 after:ml-10 ">
              Projects
            </h2>
          </div>
          <div id="projects"></div>
          <div
            className={`w-full ${
              projects?.length > 0 ? "min-h-[740px]" : "h-auto"
            } flex flex-wrap items-start justify-center gap-2`}
          >
            {projects?.length > 0 ? (
              projects.map((p, i) => (
                <PortfolioCards
                  key={i}
                  githubUrl={p.ghUrl}
                  description={p.description}
                  image={p.image}
                  liveUrl={p?.live_url}
                  tags={p?.tags}
                  title={p?.name}
                />
              ))
            ) : (
              <p className="text-slate-200 opacity-[.4] text-[14px] font-pp-rg ">
                Opps, I have no projects currently, but will add some ASAP.
              </p>
            )}
          </div>
          <Gap height={200} />
          <div className="w-full max-w-[1000px] ">
            <div className="w-full flex flex-col items-center justify-center">
              <h2 className="text-slate-100 font-pp-sb text-[25px] ">
                Other Noteworthy Projects.
              </h2>
            </div>
            {!isEmpty(githubRepo as any) && (
              <div className="grid grid-cols-2 gap-5 mt-9 p-[40px]">
                {githubRepo.map((r, i) => (
                  <GithubRepoCards
                    githubUrl={r.githubUrl}
                    description={r.description}
                    tags={r.tags}
                    title={r.name}
                    key={i}
                  />
                ))}
              </div>
            )}
            {isEmpty(githubRepo as any) && (
              <p className="text-slate-200 mt-4 opacity-[.4] text-[14px] font-pp-rg text-center ">
                Opps, I have no noteworthy projects currently, but will add some
                ASAP.
              </p>
            )}
          </div>
        </section>
        {/* Contact Section */}
        <section
          id="contacts"
          className="w-full max-w-[600px] mx-auto text-center h-full my-10 mb-10 flex flex-col items-center justify-center"
        >
          <h2 className="text-blue-301 font-mono text-[16px] before:content-['04'] before:text-blue-301 before:mr-2 ">
            What's Next?
          </h2>
          <h2 className="text-slate-100 font-pp-eb text-[46px] mb-8">
            Get In Touch
          </h2>
          <p className="text-slate-200 font-pp-rg text-[17px] ">
            I'm not saying I'm the world's best conversationalist, but I did
            once talk to myself for three hours straight. So I think we'll be
            just fine.
          </p>
          <br />
          <a
            href="mailto:johndoe@mail.com"
            className="w-auto px-8 py-4 rounded-[1px] border-solid border-[2px] border-blue-301 text-blue-301 scale-[.95] hover:scale-[1] transition-all font-pp-rg text-[14px]"
          >
            Say Hello
          </a>
        </section>
      </main>
      <ShowwcialBanner />
    </div>
  );
}

interface WorkexpProps {
  workexp?: {
    id: number | string;
    companyName?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }[];
}

function WorkExperience({ workexp }: WorkexpProps) {
  const [selectedExp, setSelectedExp] = useState<any>(workexp[0]);
  const [firstJobId, setFirstJobId] = useState<string | number>(workexp[0]?.id);

  const handleSelectedJob = (id: string) => {
    const filteredJob = workexp.filter((j) => j.id === id)[0];
    setSelectedExp(filteredJob);
    setFirstJobId(id);
  };

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
    <>
      <div className="w-[250px] h-full flex flex-col items-start justify-start">
        {workexp?.map((j) => (
          <button
            key={j.id}
            data-id={j.id}
            className={`w-full outline-none rounded-[0px] border-l-solid border-l-[2px] ${
              firstJobId === j?.id
                ? "border-l-blue-301 text-blue-301"
                : "border-l-white-600 text-slate-200"
            }  font-mono px-2 py-3 transition-all text-[13px] hover:bg-dark-900 `}
            onClick={() => handleSelectedJob(j?.id as string)}
          >
            {j.companyName}
          </button>
        ))}
      </div>
      <div className="w-full min-h-[340px] h-full flex flex-col items-start justify-start px-4">
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-slate-100 font-pp-rg text-[17px] ">
            {selectedExp?.title}
          </h2>
          <h2 className="text-blue-301 font-pp-sb text-[17px] ">
            @{selectedExp?.companyName}
          </h2>
        </div>
        <div className="flex items-center justify-center gap-4">
          <p className="text-slate-200 text-[13px] font-mono">
            {moment(selectedExp?.startDate).format("MMMM")} -{" "}
            {selectedExp?.current
              ? "Present"
              : moment(selectedExp?.endDate).format("MMMM")}{" "}
            {moment(selectedExp?.endDate).format("YYYY")}
          </p>
        </div>
        <div className="mt-3 flex flex-col items-start justify-start">
          {selectedExp?.description.length > 0
            ? splitDescription(selectedExp?.description).map((d) => (
                <p className="relative w-full flex items-center justify-start text-slate-200 text-[12px] ml-5 px-[30px] gap-3 font-mono before:content-['▹'] before:text-blue-301 before:absolute before:left-0 before:top-0 before:text-[20px] mb-5 ">
                  - {d}
                </p>
              ))
            : null}
        </div>
      </div>
    </>
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
  const id = title.toLowerCase().replaceAll(" ", "-");
  return (
    <div className="w-full max-w-[300px] h-full max-h-[500px] rounded-[15px] bg-dark-100 p-4 mt-4 ">
      <div
        className={`relative w-full max-h-[250px] bg-white-100 h-[250px] rounded-[15px] project-image ${id} `}
      >
        <style>{`
          .${id}{
            background-position: center;
            background-image: url('${image}');
            background-repeat: no-repeat;
            background-size: cover;
          }
        `}</style>
        <div className="w-auto flex items-center justify-center bg-white-500 backdrop-blur-[10px] p-2 absolute top-0 right-0 gap-3 rounded-t-[15px] rounded-l-[0px] ">
          <a href={githubUrl}>
            <IoLogoOctocat className="text-blue-301" size={20} />
          </a>
          {liveUrl !== null && (
            <a href={liveUrl}>
              <FiExternalLink className="text-blue-301" size={20} />
            </a>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col items-start justify-start py-2 mt-2">
        <p className="text-white-100 font-pp-eb text-[24px] mb-2 ">{title}</p>
        <p className="text-slate-100 font-pp-rg text-[13px] mb-5 ">
          {description ??
            `Lorem ipsum, dolor sit amet consectetur adipisicing elit. Libero
          corrupti explicabo blanditiis ipsum rerum hic!`}
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
    <div className="w-full h-auto p-8 rounded-[10px] flex flex-col items-start justify-start bg-dark-100 shadow-lg ">
      <div className="w-full flex items-center justify-between mb-5">
        <HiOutlineFolder size={25} className="text-blue-301" />
        <IoLogoOctocat size={25} className="text-blue-301" />
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-3 mb-0">
        <p className="text-slate-100 font-pp-sb text-[18px] hover:text-blue-301 transition-all ">
          {title ?? "webapis-playground Public"}
        </p>
        <p className="text-slate-200 font-pp-rg text-[12px] transition-all ">
          {description ??
            `The Web APIs Playground is a project to showcase the JavaScript Web
          APIs with examples and demonstrations. Client-side JavaScript APIs are
          here to help with providing wrapper functions for many low-level
          tasks.`}
        </p>
        <br />
        <div className="flex items-start justify-start flex-wrap gap-2">
          {tags?.length > 0 ? (
            tags.map((t, i) => (
              <span
                key={i}
                className="text-slate-200 font-mono text-[10px] px-2 py-1 rounded-md bg-dark-300 "
              >
                {t}
              </span>
            ))
          ) : (
            <>
              <span className="text-slate-200 font-mono text-[10px] px-2 py-1 rounded-md bg-dark-300 ">
                Reactjs
              </span>
              <span className="text-slate-200 font-mono text-[10px] px-2 py-1 rounded-md bg-dark-300 ">
                Reactjs
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
