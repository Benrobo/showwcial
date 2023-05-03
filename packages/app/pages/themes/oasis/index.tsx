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

export default function OasisTheme() {
  return (
    <div className="w-full h-screen font-pp-sb flex flex-col items-start justify-start bg-dark-300 scroll-smooth transition-all  overflow-y-scroll hideScrollBar2">
      {/* Top Navbar */}
      <div className="w-full h-auto fixed top-0 p-2 bg-dark-900 backdrop-blur ">
        <div className=" flex items-center justify-between ">
          <div className="w-full ml-8">
            <ImageTag
              className="w-[40px] rounded-[50%]"
              src="https://profile-assets.showwcase.com/4187/1645381241792-79FB9C2F-57D4-4E37-AF6B-FE05D87754C9.jpeg"
            />
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
                <button className="w-auto px-5 py-2 rounded-md border-solid border-[2px] border-blue-301 text-blue-301 scale-[.95] hover:scale-[1] transition-all font-pp-rg text-[13px]">
                  Resume
                </button>
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
        <ul className="w-full h-full flex flex-col items-center justify-center gap-6 after:w-[1px] after:h-[90px] after:contents-[''] after:bg-white-400 ">
          <li className="flex flex-col items-center justify-center">
            <a href="#">
              <RiGithubLine className="text-blue-301" size={25} />
            </a>
          </li>
          <li className="flex flex-col items-center justify-center">
            <a href="#">
              <AiOutlineTwitter className="text-blue-301" size={25} />
            </a>
          </li>
          <li className="flex flex-col items-center justify-center">
            <a href="#">
              <AiFillLinkedin className="text-blue-301" size={25} />
            </a>
          </li>
          <li className="flex flex-col items-center justify-center">
            <a href="#">
              <AiFillInstagram className="text-blue-301" size={25} />
            </a>
          </li>
          <li className="flex flex-col items-center justify-center">
            <a href="#">
              <SiHashnode className="text-blue-301" size={25} />
            </a>
          </li>
        </ul>
      </div>
      <div
        id="orientation"
        className="w-[40px] h-full max-h-[335px] fixed right-[40px] left-auto bottom-0 z-[10] "
      >
        <ul className="w-full h-full flex flex-col items-center justify-center after:w-[1px] after:h-[120px] after:contents-[''] after:bg-white-400 ">
          <div className="w-full h-full max-h-[230px] flex flex-col items-center justify-center">
            <a
              href="mailto:johndoe2mail.com"
              className="text-blue-301 font-mono text-[14px] rotate-[90deg] mt-[20px] space-y-[20px] "
            >
              johndoe@mail.com
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
              Tapas Adhikary
            </h2>
            <h2 className=" text-[60px] space-y-[10px] text-slate-200 font-pp-eb ">
              I solve problem for a living.
            </h2>
            <p className="text-[16px] max-w-[540px] mt-5 text-slate-200 font-pp-rg ">
              Mission driven software engineer, with a passion for thoughtful UI
              design, collaboration, and teaching.
            </p>
            <button className="w-auto flex items-center justfy-center px-6 py-5 rounded-[5px] border-solid border-[2px] border-blue-301 text-blue-301 mt-10 text-[13px] font-mono">
              Showwcase Profile!
            </button>
          </div>
          <Gap height={300} />
        </section>
        {/* About Section */}
        <section className="w-full h-full my-10 mb-10">
          <div className="w-full flex items-center justify-start">
            <h2 className="w-full flex items-center justify-start text-white-100 m-[10px] font-pp-sb text-[25px] before:content-['01.'] before:font-mono before:text-blue-301 before:mr-2 after:content-[''] after:w-[300px] after:h-[1px] after:bg-slate-200 after:ml-10 ">
              About
            </h2>
          </div>
          <br />
          <div className="w-full grid grid-cols-2 ">
            <div className="w-full ml-2 flex flex-col items-start justify-start">
              <div className="w-full max-w-[450px] flex flex-col items-start justify-start gap-5 ">
                <p className="text-slate-200 font-pp-rg text-[14px] ">
                  17+ years of experience in Software Development and User
                  Interface Engineering. Bringing forth expertise in the design,
                  development, and delivery of software systems. Equipped with a
                  diverse and promising skill-set. Proficient in various
                  platforms, and languages. Able to effectively self-manage
                  during independent projects, as well as collaborate as part of
                  a productive team.
                </p>
                <p className="text-slate-200 font-pp-rg text-[14px] ">
                  A passionate content creator who wrote over 200 articles on
                  his own blog and many other freelancing engagements like
                  freeCodeCamp, CSS-Tricks, and many more. Always up for
                  knowledge sharing with tips and tricks on Twitter and recently
                  launched YouTube channel. An open-source enthusiast created
                  several projects in the areas of web development to create
                  tools, mentoring resources, and guides.
                </p>
                <p className="text-slate-200 font-pp-rg text-[14px]">
                  Here are a few technologies I’ve been working with recently:
                </p>
                <div className="w-full max-w-[350px] flex flex-wrap items-center justify-start mt-1 gap-3">
                  {[1, 2, 3, 5, 6].map((d) => (
                    <p
                      key={d}
                      className="text-slate-200 font-mono flex items-center justify-center text-[12px]"
                    >
                      <AiOutlineStar className="text-blue-301 mr-1" size={14} />
                      Javascript
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full  h-[300px] flex items-start justify-end ">
              <div className="w-auto">
                <ImageTag
                  className="w-[300px] rounded-md "
                  src="https://profile-assets.showwcase.com/4187/1645381241792-79FB9C2F-57D4-4E37-AF6B-FE05D87754C9.jpeg"
                />
              </div>
            </div>
          </div>
          <div id="about"></div>
        </section>
      </main>
    </div>
  );
}
