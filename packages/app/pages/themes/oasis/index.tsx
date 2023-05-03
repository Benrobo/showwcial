import {
  AiFillInstagram,
  AiFillLinkedin,
  AiOutlineTwitter,
} from "react-icons/ai";
import { RiGithubLine } from "react-icons/ri";
import { SiHashnode } from "react-icons/si";

export default function OasisTheme() {
  return (
    <div className="w-full h-screen font-pp-sb flex flex-col items-start justify-start bg-dark-300">
      {/* Top Navbar */}
      <div className="w-full h-auto p-2 bg-dark-900 backdrop-blur ">
        <div className=" flex items-center justify-between ">
          <div className="w-full ml-8"></div>
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
            </ul>
          </div>
        </div>
      </div>
      {/* Socials Links Section */}
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
    </div>
  );
}
