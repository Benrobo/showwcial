let content = `
# Hello, Markdown! \n Here is some example **formatting**
`;
// let element = document.getElementById("thread-markdown-content");
// element.innerHTML = MarkdownToHtml.parse(content);

window.addEventListener("DOMContentLoaded", () => {
  const script = document.createElement("script");
  script.src = "./markdownFormatter.js"
  document.body.appendChild(script)
})

class ShowwcaseEmbed {
  constructor(elementId, threadIds) {
    this.app = elementId;
    this.threadIds = threadIds;
    this.threads = [];
    this.init();
  }

  isEmpty(param) {
    return param === null || typeof param === "undefined" || param.length == 0;
  }

  isOnlyNumbers(text) {
    const regex = /^[0-9]+$/;
    const isNum = regex.test(text);
    return isNum;
  }

  async fetchThread(threadId) {
    let response = { success: false, data: null };
    try {
      const res = await fetch(
        `https://cache.showwcase.com/threads/${threadId}`
      );
      const result = await res.json();
      const data = result;
      response["data"] = data;
      response["success"] = true;
      return response;
    } catch (e) {
      console.log(`Failed retrieving thread. ${eb.message}`);
      response["success"] = false;
      return response;
    }
  }

  renderThread({
    main = {
      id,
      username,
      userImage,
      fullname,
      tagline,
      emoji,
      title,
      description,
      images,
      likes,
      upvotes,
    },
    linkPreview = { link, title, image, description }
  }) {
    const div = document.createElement('div');
    const mainContainer = document.querySelector(this.app);



    // render handlers
    const threadUrl = `https://www.showwcase.com/thread/${main.id}`
    const renderThreadImage = () => {
      if (!this.isEmpty(main.images)) {
        return `<div class="w-full mb-2">
        <img
          class="w-full max-w-[400px] h-auto bg-dark-100 rounded-[10px]"
          src="${main.images}"
        />
      </div>`
      }
      return ""
    }

    const renderLinkPreview = () => {
      if (this.isEmpty(main.images)) {
        return `<a
        href="${linkPreview.url}"
        class="w-full border-solid border-[1px] border-white-600 rounded-[10px] flex flex-col items-center justify-center mb-3"
      >
        <div class="w-full flex flex-col items-start justify-start">
          <!-- image -->
          <img
          class="w-full max-h-[250px] h-auto bg-dark-100 rounded-[10px]"
          src="${linkPreview.image ?? "https://assets.showwcase.com/coverimages/thumbnail.png"}"
        />
          <div
            class="w-full h-auto p-2 border-solid border-t-[1px] border-t-white-600 flex flex-col items-start justify-start"
          >
            <p class="text-white-400 pp-RG text-[12px]">${new URL(linkPreview?.url).hostname}</p>
            <p class="text-white-100 pp-RG text-[14px]">${linkPreview?.title.length > 25 ? linkPreview?.title.slice(0, 25) + "..." : linkPreview.title ?? ""}</p>
            <p class="text-white-400 pp-RG text-[14px]">${linkPreview.description.length > 30 ? linkPreview.description.slice(0, 30) + "..." : linkPreview.description}</p>
          </div>
        </div>
      </a>`
      }
      return ""
    }

    const threadCont = `
    <div
    onClick="window.location.href = '${threadUrl}'"
  class="min:w-full sm:w-full md:w-[380px] lg:w-[380px] xl:w-[380px] w-full cursor-pointer h-auto bg-dark-300 showwcial-bookmark-widget flex items-center justify-center flex-col relative p-3 rounded-md"
>
  <!-- User Info -->
  <div class="w-full flex items-start justify-start">
    <span class="relative w-[48px] h-[48px]">
      <img
        src="${main.userImage}"
        class="absolute top-0 left-0 object-cover min-w-[100%] max-w-[100%] max-h-[100%] min-h-[100%] rounded-[50%]"
      />
    </span>
    <div class="w-auto ml-5 flex flex-col items-start justify-start">
      <div class="flex items-start justify-start">
        <p class="text-white-100 pp-SB text-[14px]">${main.fullname.length > 10 ? main.fullname.slice(0, 10) + "..." : main.fullname}</p>
        <p class="text-white-100 pp-SB text-[14px] ml-1 mr-1">${main.emoji}</p>
        <p class="text-white-300 pp-RG text-[13px]">@${main.username}</p>
      </div>
      <div class="flex items-start justify-start">
        <p class="text-white-200 pp-RG text-[14px]">${main.tagline?.length > 30 ? main.tagline.slice(0, 30) + "..." : main.tagline}</p>
      </div>
    </div>
    <div
      class="w-auto absolute top-0 right-3 flex flex-col items-end justify-end"
    >
      <img
        src="./assets/logos/showwcase-2.jpeg"
        class="w-[30px] rounded-[50%] mr-2 mt-3 border-solid border-[.5px] border-white-600"
      />
    </div>
  </div>
  <!-- Thread section -->
  <div
    class="w-full h-auto flex flex-col break-all whitespace-normal flex-wrap whitespace-nowrap items-start justify-start"
  >
    ${main.title.length > 0 ? `<p class="w-full overflow-hidden text-white-200 flex flex-wrap pp-SB whitespace-normal text-[14px] break-words break-all mt-2">${main.title}</p>` : ""}
    <div class="text-white-200 pp-RG whitespace-pre-wrap flex-wrap text-[14px]">
      <div
        class="break-words overflow-hidden whitespace-pre-wrap overflow-hidden max-w-[420px]"
        id="thread-markdown-content"
      >${MarkdownToHtml.parse(main.description)}</div>
    </div>

    <!-- Thread Image -->
    ${renderThreadImage()}

    <!-- Thread Link Preview -->
    ${renderLinkPreview()}

    <!-- Thread action info -->
    <div class="w-full flex items-center justify-start">
      <span class="text-white-300 pp-RG text-[13px] mb-1"
        >9:20 PM . May 21, 2023</span
      >
    </div>

    <div class="w-full border-solid border-[.5px] border-white-600"></div>

    <!-- Reply, Likes, Copy -->
    <div class="w-full mt-3 flex items-center justify-start gap-3">
      <a href="#" class="flex items-center justify-center">
        <ion-icon
          name="heart"
          class="p-2 text-[15px] mr-1 rounded-[50%] hover:bg-red-900 transition-all text-red-305"
        ></ion-icon>
        <span class="text-[14px] text-white-400 pp-SB">${main.likes}</span>
      </a>
      <a href="#" class="flex items-center justify-center">
        <ion-icon
          name="arrow-up-circle"
          class="p-2 text-[15px] mr-1 rounded-[50%] hover:bg-green-600 transition-all text-green-500"
        ></ion-icon>
        <span class="text-[14px] text-white-400 pp-SB">${main.upvotes}</span>
      </a>
      <a href="#" class="flex items-center justify-center">
        <ion-icon
          name="chatbubble"
          class="p-2 text-[15px] mr-1 rounded-[50%] hover:bg-blue-705 transition-all text-blue-300"
        ></ion-icon>
        <span class="text-[14px] text-white-400 pp-SB"></span>
      </a>
      <a href="#" class="flex items-center justify-center ml-4 hover:underline">
        <ion-icon
          name="link"
          class="p-2 text-[15px] mr-1 rounded-[50%] hover:bg-blue-705 transition-all text-blue-300"
        ></ion-icon>
        <span class="text-[13px] hover:underline text-white-100 pp-RG"
          >Copy Link</span
        >
      </a>
    </div>
    <div class="w-full mt-5 flex items-center justify-center">
      <a
        href="${threadUrl}"
        class="w-full hover:bg-blue-705 transition-all flex items-center justify-center text-blue-300 pp-RG text-center px-3 py-2 rounded-[30px] border-solid border-[1px] border-white-600 text-[14px]"
      >
        Read more on Showwcase
      </a>
    </div>
  </div>
</div>
    `

    div.innerHTML = (threadCont);
    mainContainer.appendChild(div);
    console.log({ main, linkPreview });
  }

  async init() {
    const appId = this.app;
    const threadIds = this.threadIds;
    const exist = document.querySelector(appId);
    let error = null;

    if (this.isEmpty(appId)) {
      throw new Error("Element id is invalid.");
    }
    if (this.isEmpty(this.threadIds)) {
      throw new Error("Thread id can't be empty.");
    }

    // one thread
    if (threadIds.length === 1) {
      const id = threadIds[0];
      const threadResults = await this.fetchThread(id);

      if (!threadResults.success) {
        error = "Something went wrong fetching thread.";
      }

      const data = threadResults.data;

      let linkPreview = null;
      if (data?.linkPreviewMeta !== null && data?.linkPreviewMeta?.type === "external") {
        linkPreview = {
          description: data?.linkPreviewMeta?.description,
          title: data?.linkPreviewMeta?.title,
          image: data?.linkPreviewMeta?.images[0] ?? null,
          url: data?.linkPreviewMeta?.url
        }
      }
      if (data?.linkPreviewMeta !== null && data?.linkPreviewMeta?.type === "project") {
        linkPreview = {
          description: data?.linkPreviewMeta?.project?.projectSummary,
          title: data?.linkPreviewMeta?.project?.title,
          image: data?.linkPreviewMeta?.project?.coverImageUrl ?? null,
          url: data?.linkPreviewMeta?.project?._self
        }
      }

      this.renderThread({
        main: {
          description: data?.message,
          title: data?.title ?? "",
          images: data?.images[0] ?? "",
          username: data?.user?.username,
          userImage: data?.user?.profilePictureUrl,
          fullname: data?.user?.displayName,
          emoji: data?.user?.activity?.emoji,
          id: data?.id,
          likes: data?.totalUpvotes,
          upvotes: data?.totalBoosts,
          tagline: data?.user?.headline
        },
        linkPreview: linkPreview
      });
      return;
    }

    // multiple threads.
    if (threadIds.length > 1) {
      const threadData = [];

      let count = 0;
      let counter = threadIds.length;

      while (counter !== 0) {
        const id = threadIds[count];
        const resp = await this.fetchThread(id);
        if (!resp.success) {
          error = "Something went wrong fetching thread.";
          break;
        }
        const data = resp.data;
        threadData.push(data);
        count += 1;
        counter--;
      }

      // console.log(threadData.length);
      threadData.forEach(data => {
        let linkPreview = null;

        if (data?.linkPreviewMeta !== null && data?.linkPreviewMeta?.type === "external") {
          linkPreview = {
            description: data?.linkPreviewMeta?.description,
            title: data?.linkPreviewMeta?.title,
            image: data?.linkPreviewMeta?.images[0] ?? null,
            url: data?.linkPreviewMeta?.url
          }
        }
        if (data?.linkPreviewMeta !== null && data?.linkPreviewMeta?.type === "project") {
          linkPreview = {
            description: data?.linkPreviewMeta?.project?.projectSummary,
            title: data?.linkPreviewMeta?.project?.title,
            image: data?.linkPreviewMeta?.project?.coverImageUrl ?? null,
            url: data?.linkPreviewMeta?.project?._self
          }
        }

        this.renderThread({
          main: {
            description: data?.message,
            title: data?.title ?? "",
            images: data?.images[0] ?? "",
            username: data?.user?.username,
            userImage: data?.user?.profilePictureUrl,
            fullname: data?.user?.displayName,
            emoji: data?.user?.activity?.emoji,
            id: data?.id,
            likes: data?.totalUpvotes,
            upvotes: data?.totalBoosts,
            tagline: data?.user?.headline
          },
          linkPreview: linkPreview
        });
      })
      return;
    }
  }
}
