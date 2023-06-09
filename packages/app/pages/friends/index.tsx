import { RxDotFilled } from "react-icons/rx";
import ImageTag from "../../components/Image";
import MainDashboardLayout from "../../components/Layout/mainDashboard";
import { AiFillHeart } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion, PanInfo } from "framer-motion";
import { fakeUser } from "./data";
import { tailwindColors } from "./data";
import { Spinner } from "../../components/Loader";
import { useQuery } from "react-query";
import { fetchSuggestedFollowers } from "../../http";
import { HandleFriendcordResponse } from "../../util/response";

function generateRandomColor(colors) {
  const colorKeys = Object.keys(colors);
  const randomColorKey =
    colorKeys[Math.floor(Math.random() * colorKeys.length)];
  const colorShades = colors[randomColorKey];

  const shadeKeys = Object.keys(colorShades);
  const randomShadeKey =
    shadeKeys[Math.floor(Math.random() * shadeKeys.length)];
  const randomColor = colorShades[randomShadeKey];

  return randomColor;
}

export default function Friendcord() {
  const [suggestedFollowers, setSuggestedFollowers] = useState([]);
  const [cards, setCards] = useState([]);
  const [currentUserData, setCurrentUserData] = useState([]);
  const [history, setHistory] = useState([]);
  const fetchSuggestedFollQuery = useQuery({
    queryFn: async () => await fetchSuggestedFollowers(),
    queryKey: ["followers"],
  });

  const activeIndex = suggestedFollowers.length - 1;

  const removeCard = (oldCard, action) => {
    setHistory((current) => [...current, { ...oldCard, action }]);
    setCards((current) =>
      current.filter((card) => {
        return card.id !== oldCard.userId;
      })
    );
    // setResult((current) => ({ ...current, [swipe]: current[swipe] + 1 }));
  };

  useEffect(() => {
    if (
      typeof fetchSuggestedFollQuery.data !== "undefined" ||
      fetchSuggestedFollQuery.error !== null
    ) {
      const { data } = fetchSuggestedFollQuery;
      const response = data;
      HandleFriendcordResponse(
        response,
        () => {},
        (data) => {
          console.log(data);
          setSuggestedFollowers(data);
          setCards(data);
        }
      );
    }
  }, [fetchSuggestedFollQuery.data]);

  return (
    <MainDashboardLayout activeTab="friends">
      <div className="w-full h-auto flex flex-col items-start justify-start">
        <div className="w-full h-auto border-b-solid border-b-[.5px] border-b-white-600 py-3 flex flex-col items-center justify-center">
          <h1 className="font-extrabold pp-EB text-[2em] text-white-100">
            we met on Showwcase
          </h1>
          <p className="text-white-300 text-[13px] pp-RG">
            Meet new friends with similar interests.
          </p>
        </div>
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <div className="relative w-full h-full max-w-[350px] mt-[5em] ">
            {fetchSuggestedFollQuery.isLoading && (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Spinner color="#fff" />
              </div>
            )}
            <AnimatePresence>
              {cards.length > 0 &&
                cards.map((d, i) => (
                  <SwipeCard
                    key={d.id}
                    active={i === activeIndex}
                    data={{
                      username: d.username,
                      fullname: d.fullname,
                      userId: d.id,
                      tags: d.tags,
                      profilePic: d.image,
                    }}
                    removeCard={removeCard}
                  />
                ))}
            </AnimatePresence>
            {cards.length === 0 && !fetchSuggestedFollQuery.isLoading && (
              <div className="w-full h-[400px] flex flex-col justify-center items-center">
                {/* <p className="text-white-100 pp-SB text-[15px] ">
                  That all we got for now
                </p>
                <p className="text-white-300 pp-RG text-[13px]">
                  Come back later.
                </p> */}
                <div className="w-full max-w-[150px] bg-red-305 rounded-[30px] p-2 flex items-center justify-center gap-5 ">
                  <p className="text-white-100 text-[14px] pp-SB">Matching</p>
                  <Spinner color="#fff" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainDashboardLayout>
  );
}

interface SwipeCardProp {
  data: {
    fullname: string;
    username: string;
    profilePic: string;
    tags: string[];
    userId: number | string;
  };
  active: boolean;
  key: any;
  removeCard: (data: any, action: string) => void;
  colors?: string;
}

function SwipeCard({ data, removeCard, active, colors, key }: SwipeCardProp) {
  const [leaveX, setLeaveX] = useState<number>(0);
  const [leaveY, setLeaveY] = useState<number>(0);

  const onDragEnd = (_e: any, info) => {
    // if (info.offset.y < -100) {
    //   setLeaveY(-2000);
    //   removeCard(data, "follow");
    //   return;
    // }
    if (info.offset.x > 100) {
      setLeaveX(1000);
      removeCard(data, "follow");
    }
    if (info.offset.x < -100) {
      setLeaveX(-1000);
      removeCard(data, "unfollow");
    }
  };

  const classNames = `w-full h-[450px] absolute max-w-[450px] rounded-[10px] flex flex-col items-start justify-start overflow-hidden bg-dark-200 cursor-grab `;

  // return null;

  return (
    <>
      <motion.div
        key={key}
        drag={true}
        dragConstraints={{ left: -20, right: 0, top: 0, bottom: 0 }}
        onDragEnd={onDragEnd}
        initial={{
          scale: 1,
        }}
        animate={{
          scale: 1.05,
          rotate: `${data.username.length % 2 === 0 ? 6 : -6}deg`,
        }}
        exit={{
          x: leaveX,
          y: leaveY,
          opacity: 0,
          scale: 0.5,
          transition: { duration: 1 },
        }}
        className={classNames}
        data-testid="active-card"
      >
        <div className={`${classNames}`}>
          <div
            className={`w-full h-[120px] max-h-[190px] flex flex-col items-center justify-center`}
            style={{
              backgroundColor: generateRandomColor(tailwindColors.colors),
            }}
          >
            {/* Header */}
          </div>
          <div className="w-full h-full px-3 flex flex-col items-start justify-start">
            <div className="w-full flex flex-col items-start justify-start">
              <ImageTag
                src={data?.profilePic ?? "/images/ack/me.jpeg"}
                className="w-[80px] h-[80px] max-w-[80px] max-h-[80px] rounded-[50%] border-solid border-[5px] border-dark-200 mt-[-2em] bg-dark-200 "
              />
              <div className="w-full mt-5 flex flex-col items-start justify-start">
                <p className="text-white-100 text-[15px] pp-SB">
                  {data.fullname ?? "Benaiah Alumona"}
                </p>
                <p className="text-white-300 text-[13px] pp-RG">
                  {data.username.length > 0 ? `@${data.username}` : "@benrobo"}
                </p>
              </div>
            </div>
            <p className="text-white-300 mt-6 pp-SB text-[12px] pp-RG">
              INTERESTS
            </p>
            <div className="w-full h-auto max-h-[120px] overflow-auto hideScrollBar2 mt-5 mb-8 flex flex-wrap items-start justify-start gap-2">
              {data.tags.length > 0
                ? data.tags.map((d, i) => (
                    <Tags tag={(d as any)?.name} key={i} active={false} />
                  ))
                : null}
            </div>
            <div className="w-full h-[100px] "></div>
          </div>
        </div>
      </motion.div>
      <div className="absolute bottom-[-27em] w-full flex items-center justify-center gap-8">
        <IoClose
          className="rounded-[50%] cursor-pointer transition-all scale-[.95] hover:scale-[.99] bg-white-400 p-3 text-white-100 "
          size={45}
          onClick={(e) => {
            removeCard(data, "unfollow");
            setLeaveX(-1000);
          }}
        />
        <AiFillHeart
          className="rounded-[50%] cursor-pointer transition-all scale-[.95] hover:scale-[.99] bg-red-305 p-3 text-white-100 "
          size={45}
          onClick={(e) => {
            removeCard(data, "follow");
            setLeaveX(1000);
          }}
        />
      </div>
    </>
  );
}

interface TagProp {
  tag: string;
  active?: boolean;
}

function Tags({ tag, active }: TagProp) {
  return (
    <span
      className={`px-2 ${active ? "bg-blue-500" : "bg-white-600"} ${
        active ? "text-white-100" : "text-white-400"
      } py-2 font-semibold pp-RG rounded-[30px] text-[10px] flex items-center justify-center pointer-events-none `}
    >
      <RxDotFilled
        color={active ? "#fff" : "#777"}
        className="mr-1"
        size={15}
      />
      {tag}
    </span>
  );
}
