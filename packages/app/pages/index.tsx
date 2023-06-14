import next from "next";
import ImageTag from "../components/Image";
import { BsArrowUpRight, BsFillPlayFill } from "react-icons/bs";
import Gap from "../components/Gap";
import { useState } from "react";
import Modal from "../components/Modal";
import withoutAuth from "../util/withoutAuth";

function Home() {
  const [isVideoPreview, setIsVideoPreview] = useState(false);
  const videoPreviewUrl = "https://youtube.com/embed/GHnJyDZ2yww";

  const toggleVideoPreview = () => setIsVideoPreview(!isVideoPreview);

  const userProfileImageStyle = {
    backgroundImage: `url("./images/ack/me.jpeg")`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  const showwcaseImageStyle = {
    background: "#fff",
    backgroundImage: `url("./images/ack/showwcase.png")`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <div className="w-full h-screen bg-dark-100 overflow-x-hidden scroll-smooth pattern-bg">
      {/* header */}
      <div className="relative w-full min-h-[400px] max-h-[700px] bg-dark-200 ">
        <div className="w-full flex items-center justify-around h-auto px-2 py-4">
          <div className="w-auto flex items-center justify-center">
            <div className="p-1 scale-[.8] flex items-center justify-center text-[13px] pp-RG text-white-100 bg-white-600 rounded-[30px] border-solid border-[1px] border-white-600 backdrop-blur ">
              <ImageTag
                src="/images/logos/logo2.png"
                alt="logo"
                className="scale-[1] w-[35px] rounded-[20px] "
              />
            </div>
            {/* <span className="text-white-200 ml-2 pp-EB text-[13px] ">showccial</span> */}
          </div>
          <div className="w-auto flex items-start justify-center gap-5">
            <a href="#" className="text-white-100 pp-RG text-[12px]">
              Why Showwcial
            </a>
            <a href="#features" className="text-white-100 pp-RG text-[12px]">
              Features
            </a>
            <a
              href="mailto:alumonabenaiah71@gmail.com"
              target="_blank"
              className="text-white-100 pp-RG text-[12px]"
            >
              Contact
            </a>
          </div>
          <div className="w-auto flex items-start justify-center gap-2">
            <a
              href="/auth/login"
              className="px-7 py-2 flex items-center justify-center text-[13px] pp-SB text-white-100 bg-white-600 rounded-[30px] border-solid border-[1px] border-white-600 backdrop-blur "
            >
              Try Now
            </a>
          </div>
        </div>
        <div className="w-full min-h-[550px] flex flex-col items-center justify-start py-8 text-center ">
          <h1 className="text-[50px] pp-EB text-white-100">
            Elevate Your Digital Identity
          </h1>
          <p className="text-[15px] opacity-[.7] pp-RG text-white-100">
            Your One-Stop Content Hub: Threads, Shows, Portfolios, and More
          </p>
          <button
            className="px-7 py-3 mt-5 flex items-center justify-center text-[13px] pp-RG text-dark-700 bg-white-100 rounded-[30px] border-solid border-[1px] border-white-600 backdrop-blur transition-all scale-[.90] hover:scale-[1] "
            onClick={toggleVideoPreview}
          >
            Watch Demo <BsFillPlayFill size={20} />
          </button>
        </div>
      </div>
      <div className="w-full  h-[600px] flex flex-col items-center justify-center mb-[250px]">
        <div className="w-full h-auto max-h-[300px] flex flex-col items-center bg-dark-100">
          <ImageTag
            src="/images/mockups/1.png"
            className="w-[60rem] relative top-[-20rem]  "
          />
        </div>
        <div className="w-full h-auto  mt-5 py-9 flex flex-col items-center">
          <div className="w-full max-w-[60%] flex flex-col items-center text-center">
            <p className="text-white-200 pp-RG text-[13px] z-[10] ">
              Discover, connect, and thrive with Showwcial. Harness the power of
              threads and shows tailored to your interests and communities.
              Create professional portfolio sites with ease, personalize your
              experience with our intuitive Discord bot, and stay organized with
              our bookmarking feature. Join a vibrant ecosystem where creators
              and enthusiasts come together to inspire and grow.
            </p>
          </div>
        </div>
      </div>

      {/* <Gap height={50} /> */}
      {/* Features */}
      <a id="features"></a>
      <div className="w-full h-auto flex flex-col items-center justify-center">
        <p className="text-white-100 pp-EB text-[35px] mb-5 z-[20]">Features</p>
        <p className="text-white-200 max-w-[600px] text-center pp-RG text-[13px] z-[20] ">
          Discover, Engage, and Grow: Showwcial Revolutionizes How You Showcase
          and Connect with Your Audience. Here are the lists of features offered
          by Showwcial.
        </p>
        <br />
        <Gap height={100} />
        <div className="w-auto h-full flex flex-col items-center justify-center">
          <FeaturesContent
            title="Thread Creation"
            description="Easily create and share engaging threads on any topic. Whether you
              want to express your thoughts, share valuable insights, or spark
              meaningful conversations, our intuitive interface allows you to
              craft compelling threads with ease."
            imagePath="/images/mockups/2.png"
            align="l-r"
          />
          <Gap height={50} />
          <FeaturesContent
            title="Subthreads for Enhanced Discussions"
            description="Take your conversations to the next level with subthreads. Similar to Twitter's reply threads, our app lets you create multiple subthreads within a main thread, enabling more organized and interactive discussions among participants."
            imagePath="/images/mockups/3.png"
            align="r-l"
          />
          <Gap height={50} />
          <FeaturesContent
            title="Powerful Discord Bot Integration"
            description="Supercharge your Discord server with our feature-rich bot. Seamlessly integrate it into your community to instantly retrieve shows and threads based on specific tags or communities. Engage your members with relevant content, foster discussions, and create a vibrant and dynamic community experience."
            imagePath="/images/mockups/5.png"
            align="l-r"
          />
          <Gap height={50} />
          <FeaturesContent
            title="Bookmarking and Saved Content"
            description="Never lose track of valuable threads and shows. Our app provides a convenient bookmarking feature, allowing you to save and organize your favorite content for quick access. Stay inspired, stay informed, and easily revisit your most cherished discussions."
            imagePath="/images/mockups/6.png"
            align="r-l"
          />
          <Gap height={50} />
          <FeaturesContent
            title="Effortless Portfolio Site Creation"
            description="Showcase your work and talents effortlessly with our built-in portfolio site creator. Say goodbye to the hassle of building a website from scratch. Simply choose from customizable templates, upload your content, and personalize your portfolio site to reflect your unique style and professional brand."
            imagePath="/images/mockups/4.png"
            align="r-l"
          />
          <Gap height={50} />
          <FeaturesContent
            title="Effortless Portfolio Site Creation"
            description="Showwcial provides a way for users to identify who and who's not on showwcase platform via twitter."
            imagePath="/images/mockups/7.png"
            align="l-r"
          />
          <Gap height={100} />
        </div>
        {/* Team */}
        <div className="w-full h-full min-h-[350px] mt-8 mb-6 flex flex-col items-center justify-center z-[20] ">
          <p className="text-white-100 text-center pp-EB text-[35px] mb-5">
            Acknowlegement
          </p>
          <p className="text-white-200 max-w-[70%] text-center pp-RG text-[13px]">
            Special thanks to the incredible platforms and APIs that power my
            app's functionality and make it all possible. I extend my heartfelt
            acknowledgement to <kbd>Showwcase</kbd> and the Blog API for their
            invaluable contributions in bringing engaging conversations,
            captivating shows, and seamless content creation to my users.
          </p>
          <Gap height={50} />
          <div className="w-full flex items-center justify-around">
            <div className="w-[200px] rounded-md border-solid border-[.5px] border-white-600 p-5 flex flex-col items-center justify-center bg-dark-300 z-[10]">
              <div
                className="ack-image w-[100px] h-[100px] rounded-[50%] "
                style={userProfileImageStyle}
              ></div>
              <br />
              <p className="text-white-400 pp-RG text-[12px] italic ">
                Built By:
              </p>
              <a
                target="_blank"
                href="https://www.showwcase.com/benrobo"
                className="text-white-100 pp-EB text-[15px] hover:underline"
              >
                Benaiah
                <span className="text-white-200 text-[12px]">@benrobo</span>
              </a>
            </div>
            <div className="w-[200px] bg-dark-300 z-[10] rounded-md border-solid border-[.5px] border-white-600 p-5 flex flex-col items-center justify-center">
              <div
                className="ack-image-2 w-[100px] h-[100px] rounded-[50%] "
                style={showwcaseImageStyle}
              ></div>
              <br />
              <p className="text-white-400 pp-RG text-[12px] italic ">
                Powered By:
              </p>
              <a
                target="_blank"
                href="https://www.showwcase.com"
                className="text-white-100 pp-EB text-[15px] hover:underline"
              >
                Showwcase HQ
              </a>
            </div>
          </div>
        </div>
        {/* Get started */}
        <div className="w-full h-full z-[10] min-h-[300px] py-8 bg-dark-300 flex flex-col items-center justify-center">
          <h1 className="text-[40px] pp-EB text-white-100">
            It&apos;s easy to get started.
          </h1>
          <br />
          <a
            href="/auth/login"
            target="_blank"
            className="px-7 py-3 flex items-center justify-center text-[13px] pp-SB text-dark-100 bg-white-100 rounded-[30px] border-solid border-[1px] border-white-600 backdrop-blur "
          >
            Get Started <BsArrowUpRight size={15} className="ml-2" />
          </a>
        </div>
      </div>

      <Modal
        isBlurBg
        isOpen={isVideoPreview}
        onClose={toggleVideoPreview}
        showCloseIcon
      >
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-full h-auto max-w-[70%] bg-dark-200 flex flex-col items-center justify-center">
            <iframe
              width="760"
              height="415"
              src={
                videoPreviewUrl.length > 0
                  ? videoPreviewUrl
                  : "https://www.youtube.com/embed/A4_TFHzqAAg"
              }
              title="Showwcial Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default withoutAuth(Home);

interface FeaturesContProp {
  title?: string;
  description?: string;
  imagePath?: string;
  align: "l-r" | "r-l";
}

function FeaturesContent({
  title,
  description,
  imagePath,
  align,
}: FeaturesContProp) {
  return (
    <>
      {align === "l-r" ? (
        <div className="w-full max-w-[90%] mt-8 grid grid-cols-2 gap-7 px-8 z-[10]">
          <div className="w-full h-auto flex flex-col items-start justify-center">
            <h1 className="text-white-100 pp-SB">{title}</h1>
            <p className="text-white-200 pp-RG text-[14px] mt-5 ">
              {description}
            </p>
          </div>
          <div className="w-full max-w-[750px]">
            <ImageTag src={imagePath} className="rounded-[10px]" />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-[90%] mt-8 grid grid-cols-2 gap-7 px-8 z-[10] ">
          <div className="w-full max-w-[750px]">
            <ImageTag src={imagePath} className="rounded-[10px]" />
          </div>
          <div className="w-full h-auto flex flex-col items-start justify-start">
            <h1 className="text-white-100 pp-SB">{title}</h1>
            <p className="text-white-200 pp-RG text-[14px] mt-5 ">
              {description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
