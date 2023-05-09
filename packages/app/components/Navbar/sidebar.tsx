import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsFillTagsFill, BsRobot } from "react-icons/bs";
import { FaCog } from "react-icons/fa";
import { MdSpaceDashboard, MdStyle, MdWebStories } from "react-icons/md";
import { RxCaretDown } from "react-icons/rx";
import { TbWorld } from "react-icons/tb";
import ImageTag from "../Image";
import { CgWebsite } from "react-icons/cg";

interface SidebarProps {
  active?: string;
}

const returnActiveStyle = (active: string, name: string) => {
  let style = "";
  const combo = `${active}-${name}`;
  switch (combo) {
    case "dashboard-dashboard":
      style = `text-white-100 bg-white-600 pp-EB`;
      break;
    case "chat-chat":
      style = `text-white-100 bg-white-600 pp-EB`;
      break;
    case "thread-thread":
      style = `text-white-100 bg-white-600 pp-EB`;
      break;
    case "notifier-notifier":
      style = `text-white-100 bg-white-600 pp-EB`;
      break;
    case "pageBuilder-pageBuilder":
      style = `text-white-100 bg-white-600 pp-EB`;
      break;
    case "domain-domain":
      style = `text-white-100 bg-white-600 pp-EB`;
      break;
    case "themes-themes":
      style = `text-white-100 bg-white-600 pp-EB`;
      break;
    case "settings-settings":
      style = `text-white-100 bg-white-600 pp-EB`;
      break;

    default:
      style = "text-white-300 pp-SB";
      break;
  }
  return style;
};

function SideBar({ active }: SidebarProps) {
  return (
    <div className="w-[18%] h-[100vh] py-[3em] border-r-[1px] border-r-solid border-r-white-600  overflow-y-scroll hideScrollBar">
      <ul className="w-full flex flex-col items-start justify-start px-4 gap-6 mt-7">
        <Link href="/dashboard" className="w-full">
          <li
            className={`${returnActiveStyle(
              active,
              "dashboard"
            )} hover:bg-white-600 py-2 rounded-[10px] cursor-pointer hover:text-white-100 hover:pp-SB transition-all gap-3 flex items-start justify-start`}
          >
            <MdSpaceDashboard className="ml-2 text-2xl " /> Dashboard
          </li>
        </Link>
        <Link href="/chat" className="w-full">
          <li
            className={`${returnActiveStyle(
              active,
              "chat"
            )} hover:bg-white-600 py-2 rounded-[10px] cursor-pointer hover:text-white-100 hover:pp-SB transition-all gap-3 flex items-center justify-start`}
          >
            <MdWebStories className="ml-2 text-2xl " /> Chat
          </li>
        </Link>
        <Link href="/thread" className="w-full">
          <li
            className={`${returnActiveStyle(
              active,
              "thread"
            )} hover:bg-white-600 py-2 rounded-[10px] cursor-pointer hover:text-white-100 hover:pp-SB transition-all gap-3 flex items-center justify-start`}
          >
            <MdWebStories className="ml-2 text-2xl " /> Threads
          </li>
        </Link>
        <Link href="/notifier" className="w-full">
          <li
            className={`${returnActiveStyle(
              active,
              "notifier"
            )} hover:bg-white-600 py-2 rounded-[10px] cursor-pointer hover:text-white-100 hover:pp-SB transition-all gap-3 flex items-center justify-start`}
          >
            <BsRobot className="ml-2 text-2xl " /> Notifier
          </li>
        </Link>
        <Link href="/pageBuilder" className="w-full">
          <li
            className={`${returnActiveStyle(
              active,
              "pageBuilder"
            )} hover:bg-white-600 py-2 rounded-[10px] cursor-pointer hover:text-white-100 hover:pp-SB transition-all gap-3 flex items-center justify-start`}
          >
            <CgWebsite className="ml-2 text-2xl " /> Page Builder
          </li>
        </Link>

        <li className="w-full text-white-400 text-[14px] pp-SB ">ADVANCED</li>

        {/* <Link href="#" className="w-full">
          <li
            className={`${returnActiveStyle(
              active,
              "domain"
            )} hover:bg-white-600 py-2 rounded-[10px] cursor-pointer hover:text-white-100 hover:pp-SB transition-all gap-3 flex items-center justify-start`}
          >
            <TbWorld className="ml-2 text-2xl " /> Domain
          </li>
        </Link>
        <Link href="#" className="w-full">
          <li
            className={`${returnActiveStyle(
              active,
              ""
            )} hover:bg-white-600 py-2 rounded-[10px] cursor-pointer hover:text-white-100 hover:pp-SB transition-all gap-3 flex items-center justify-start`}
          >
            <MdStyle className="ml-2 text-2xl " /> Themes
          </li>
        </Link> */}
        <Link href="/settings" className="w-full">
          <li
            className={`${returnActiveStyle(
              active,
              "settings"
            )} hover:bg-white-600 py-2 rounded-[10px] cursor-pointer hover:text-white-100 hover:pp-SB transition-all gap-3 flex items-center justify-start`}
          >
            <FaCog className="ml-2 text-2xl " /> Settings
          </li>
        </Link>
      </ul>

      {/* content */}
    </div>
  );
}

export default SideBar;
