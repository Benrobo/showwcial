import { RxDotFilled } from "react-icons/rx";
import ImageTag from "../components/Image";
import MainDashboardLayout from "../components/Layout/mainDashboard";
import { AiFillHeart } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion, PanInfo } from "framer-motion";

const fakeUser = [
  {
    username: "johnny",
    fullname: "John Doe",
    userId: 121212,
    tags: ["Dancing", "Drawing"],
    profilePic:
      "https://profile-assets.showwcase.com/102662/1683311191679-1683311188721-DSC_1744.jpeg",
  },
  {
    username: "benny",
    fullname: "Benny Ben",
    userId: 12343,
    tags: ["Dancing", "Drawing", "Feeding"],
    profilePic:
      "https://profile-assets.showwcase.com/102662/1683311191679-1683311188721-DSC_1744.jpeg",
  },
];

export default function Friendcord() {
  const [cards, setCards] = useState(fakeUser);
  const [suggestedFollowers, setSuggestedFollowers] = useState(fakeUser);
  const [currentUserData, setCurrentUserData] = useState([]);
  const [history, setHistory] = useState([]);
  const [swipeX, setSwipeX] = useState(0);

  const activeIndex = suggestedFollowers.length - 1;

  const removeCard = (oldCard, action) => {
    setHistory((current) => [...current, { ...oldCard, action }]);
    setCards((current) =>
      current.filter((card) => {
        return card.userId !== oldCard.userId;
      })
    );
    // setResult((current) => ({ ...current, [swipe]: current[swipe] + 1 }));
    console.log({
      oldCard,
      action,
    });
  };

  console.log(history);

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
            <AnimatePresence>
              {cards.map((d, i) => (
                <SwipeCard
                  key={d.username}
                  active={i === activeIndex}
                  data={{
                    username: d.username,
                    fullname: d.fullname,
                    userId: d.userId,
                    tags: d.tags,
                    profilePic: d.profilePic,
                  }}
                  removeCard={removeCard}
                  swipeX={swipeX}
                />
              ))}
            </AnimatePresence>
            {cards.length === 0 && (
              <div className="w-full h-[400px] flex flex-col justify-center items-center">
                <p className="text-white-100 pp-SB text-[15px] ">
                  That all we got for now
                </p>
                <p className="text-white-300 pp-RG text-[13px]">
                  Come back later.
                </p>
              </div>
            )}
            {cards.length > 0 && (
              <div className="absolute bottom-[-27em] w-full flex items-center justify-center gap-8">
                <IoClose
                  className="rounded-[50%] cursor-pointer transition-all scale-[.95] hover:scale-[.99] bg-white-400 p-3 text-white-100 "
                  size={45}
                  onClick={(e) => {
                    removeCard(cards[cards.length - 1], "unfollow");
                    setSwipeX(-1000);
                  }}
                />
                <AiFillHeart
                  className="rounded-[50%] cursor-pointer transition-all scale-[.95] hover:scale-[.99] bg-red-305 p-3 text-white-100 "
                  size={45}
                  onClick={(e) => {
                    removeCard(cards[cards.length - 1], "follow");
                    setSwipeX(1000);
                  }}
                />
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
  swipeX?: number;
}

function SwipeCard({ data, removeCard, active, key, swipeX }: SwipeCardProp) {
  const [leaveX, setLeaveX] = useState<null | number>(0);
  const [leaveY, setLeaveY] = useState<null | number>(0);

  useEffect(() => {
    setLeaveX(swipeX);
  }, [Math.abs(swipeX)]);

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

  return (
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
        // rotate: `${data.username.length % 2 === 0 ? 6 : -6}deg`,
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
        <div className="w-full h-[100px] max-h-[90px] bg-red-305 flex flex-col items-center justify-center">
          {/* Header */}
        </div>
        <div className="w-full h-full px-3 flex flex-col items-start justify-start">
          <div className="w-full flex flex-col items-start justify-start">
            <ImageTag
              src={data.profilePic ?? "/images/ack/me.jpeg"}
              className="w-[80px] h-[80px] rounded-[50%] border-solid border-[5px] border-dark-200 mt-[-2em] bg-dark-200 "
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
              ? data.tags.map((d, i) => <Tags tag={d} key={i} active={false} />)
              : null}
          </div>
          <div className="w-full h-[100px] "></div>
        </div>
      </div>
    </motion.div>
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
