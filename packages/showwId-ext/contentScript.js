const sleep = (time = 1) =>
  new Promise((res, rej) => setTimeout(res, time * 1000));

async function checkUserExistsOnShowwcase() {
  const { pathname } = window.location;
  const username = pathname.split("/")[1];
  const invalidUsernames = [
    "home",
    "settings",
    "explore",
    "notifications",
    "messages",
    "i",
    "bookmarks",
    "",
  ];

  if (invalidUsernames.includes(username)) return;

  console.log("SHOWWID INIT");
  await sleep(2);
  console.log("SHOWWID FETCHING....");

  //   make requests
  const URL = `https://cache.showwcase.com/users/check?username=${username}`;

  fetch(URL)
    .then((res) => res.json())
    .then((data) => {
      const userExists = data?.available === false ? true : false;
      const alternateParentDiv = document.querySelector(
        "#react-root > div > div > div.css-1dbjc4n.r-18u37iz.r-13qz1uu.r-417010 > main > div > div > div > div > div > div:nth-child(3) > div > div > div > div > div.css-1dbjc4n.r-6gpygo.r-14gqq1x > div.css-1dbjc4n.r-1wbh5a2.r-dnmrzs.r-1ny4l3l > div > div.css-1dbjc4n.r-1awozwy.r-18u37iz.r-1wbh5a2"
      );

      const imgUrl = chrome.runtime.getURL("icon/showwcase.png");
      const userProfile = `https://showwcase.com/${username}`;
      const div = document.createElement("a");
      div.setAttribute("data-id", "Showwcial-Ext");
      div.setAttribute("target", "_blank");
      div.classList.add("showwId-cont");
      div.href = userProfile;
      div.innerHTML = `<img src="${imgUrl}" width="20" height="20">`;
      alternateParentDiv.appendChild(div);
    })
    .catch((err) => {
      console.error(`Error verifying user identity. : ${err.message}`);
    });
}

// Listen for the onpushstate event and run the checkUserExistsOnShowwcase function
window.addEventListener("history.onpushstate", checkUserExistsOnShowwcase);

// Run the checkUserExistsOnShowwcase function once when the page first loads
checkUserExistsOnShowwcase();
