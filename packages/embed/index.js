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
        return `<div class="thread-image">
        <img src="${main.images}"/>
      </div>`
      }
      return ""
    }

    const renderLinkPreview = () => {
      if (this.isEmpty(main.images)) {
        const { url, image, hostname, title, description } = linkPreview;
        return `<a href="${url}" class="linkPreview">
        <div>
          <!-- image -->
          <img src="${image ?? "https://assets.showwcase.com/coverimages/thumbnail.png"}"
        />
          <div
            class="details"
          >
            <p class="pp-RG text-[12px]">${new URL(url).hostname}</p>
            <p class="pp-RG p-14">${title.length > 25 ? title.slice(0, 25) + "..." : title ?? ""}</p>
            <p class="pp-RG p-14">${description.length > 30 ? description.slice(0, 30) + "..." : description}</p>
          </div>
        </div>
      </a>`
      }
      return ""
    }

    const addDottt = (text, cond) => {
      if (text.length > cond) {
        let newText = text.slice(0, cond);
        return `${newText}...`
      }
      return text;
    }

    const threadCont = `
    <div class="showwcial-embed">
  <!-- User Info -->
  <div class="showwcial-userInfo">
    <div class="showwcase-user-profile">
      <img src="${main.userImage}" class="" />
    </div>
    <div class="showwcial-user-details">
      <div class="showwcial-user-details-1">
        <p class="p-14 pp-SB">${addDottt(main.fullname, 12)}</p>
        <p class="p-14">${main.emoji}</p>
        <p class="p-13 pp-RG">@${main.username}</p>
      </div>
      <div class="showwcial-user-details-1">
        <p class="p-14 pp-RG">${addDottt(main.tagline, 20)}</p>
      </div>
    </div>
    <div class="showwcase-logo">
      <img src="./assets/logos/showwcase-2.jpeg" class="" />
    </div>
  </div>
  <!-- Thread section -->
  <div class="showwcial-thread-section">
    <p class="pp-SB p-14 title">${main.title}</p>
    <div class="markdown-content pp-RG" id="thread-markdown-content">
      ${MarkdownToHtml.parse(main.description)}
    </div>

    <!-- Thread Image -->
    ${renderThreadImage()}

    <!-- Thread Link Preview -->
    ${renderLinkPreview()}

    <!-- Thread action info -->
    <!-- <div class="timing">
      <span class="pp-RG p-13">${main.timestamp}</span>
    </div> -->

    <div class="divider"></div>

    <!-- Reply, Likes, Copy -->
    <div class="thread-actions">
      <a href="#" class="">
        <ion-icon name="heart" class="icon icon1"></ion-icon>
        <span class="p-14 pp-SB">${main.likes}</span>
      </a>
      <a href="#" class="">
        <ion-icon name="arrow-up-circle" class="icon icon2"></ion-icon>
        <span class="p-14 pp-SB">${main.upvotes}</span>
      </a>
      <a href="#" class="">
        <ion-icon name="chatbubble" class="icon icon3"></ion-icon>
        <!-- <span class="p-14 pp-SB">${main.comments}</span> -->
      </a>
      <a href="#" class="">
        <ion-icon name="link" class="icon icon3"></ion-icon>
        <span class="p-13 pp-RG">Copy Link</span>
      </a>
    </div>
    <div class="readmore">
      <a href="${main.threadUrl}" class="p-14 pp-RG">Read more on Showwcase</a>
    </div>
  </div>
</div>`

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
