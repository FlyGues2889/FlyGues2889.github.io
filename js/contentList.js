// 定义创建消息卡片的函数
function createMessageCard(
  title,
  time,
  message,
  hasPhotos = false,
  photoNum = 0, // 设置默认值为 0
  showAvatar = true,
  showLikeButton = false // 新增参数控制是否显示 likeButton
) {
  const msgContainer = document.createElement("mdui-card");
  msgContainer.classList.add("msgContainer");
  msgContainer.setAttribute("clickable", "");

  if (showAvatar) {
    // 头像区域
    const avatarBox = document.createElement("div");
    avatarBox.classList.add("avatarBox");

    const avatar = document.createElement("mdui-avatar");
    avatar.style.marginRight = "0.5rem";
    const avatarImg = document.createElement("img");
    avatarImg.src = "assets/image/passage.svg";
    avatar.appendChild(avatarImg);

    const userInfo = document.createElement("div");

    const userName = document.createElement("b");
    userName.textContent = title;

    const userTime = document.createElement("small");
    userTime.textContent = time;

    userInfo.appendChild(userName);
    userInfo.appendChild(document.createElement("br"));
    userInfo.appendChild(userTime);
    avatarBox.appendChild(avatar);
    avatarBox.appendChild(userInfo);
    msgContainer.appendChild(avatarBox);
  } else {
    // 详细消息卡片的标题区域
    const detailTitle = document.createElement("h2");
    detailTitle.textContent = title;
    msgContainer.appendChild(detailTitle);

    const detailTime = document.createElement("small");
    detailTime.textContent = time;
    msgContainer.appendChild(detailTime);

    const divider = document.createElement("mdui-divider");
    msgContainer.appendChild(divider);
  }

  // 消息内容区域
  const msgContext = document.createElement("div");
  msgContext.classList.add("msgContext");

  // 检查 message 是否包含 HTML 标签
  if (message.includes("<")) {
    msgContext.innerHTML = message;
  } else {
    msgContext.textContent = message;
  }

  if (hasPhotos) {
    const photoArea = document.createElement("div");
    photoArea.classList.add("photo-area");
    msgContext.appendChild(photoArea);
    for (let i = 0; i < photoNum; i++) {
      const photoCard = document.createElement("mdui-card");
      photoCard.classList.add("showPhoto");
      photoCard.setAttribute("variant", "filled");
      photoCard.setAttribute("clickable", "");
      photoCard.setAttribute("onclick", "openPhotoViewer()");

      const photoIcon = document.createElement("mdui-icon");
      photoIcon.setAttribute("name", "photo--outlined");
      photoIcon.style.color = "rgb(var(--mdui-color-primary))";
      photoIcon.style.fontSize = "2rem";
      photoCard.appendChild(photoIcon);
      photoArea.appendChild(photoCard);
    }
  }
  msgContainer.appendChild(msgContext);

  // 消息底部操作区域
  if (showLikeButton) {
    // 根据参数决定是否显示 likeButton
    const msgBottom = document.createElement("div");
    msgBottom.classList.add("msgBottom");

    const likeButton = document.createElement("mdui-button-icon");
    likeButton.setAttribute("icon", "thumb_up--outlined");
    likeButton.setAttribute("selectable", "");
    likeButton.setAttribute("selected-icon", "thumb_up");

    msgBottom.appendChild(likeButton); // 添加 likeButton 到 msgBottom
    msgContainer.appendChild(msgBottom); // 添加 msgBottom 到 msgContainer
  }

  // 其他按钮可以按需取消注释
  // const shareButton = document.createElement("mdui-button-icon");
  // shareButton.setAttribute("icon", "share--outlined");
  // shareButton.style.marginLeft = "0.5rem";
  // msgBottom.appendChild(shareButton);

  // const chatButton = document.createElement("mdui-button-icon");
  // chatButton.setAttribute("icon", "chat--outlined");
  // chatButton.style.marginLeft = "0.5rem";
  // msgBottom.appendChild(chatButton);

  // 更多信息按钮区域
  // const moreInfo = document.createElement("div");
  // moreInfo.classList.add("moreInfo");

  // const moreButton = document.createElement("mdui-button-icon");
  // moreButton.setAttribute("icon", "more_vert");
  // moreInfo.appendChild(moreButton);
  // msgContainer.appendChild(moreInfo);

  return msgContainer;
}

// 读取 JSON 文件
fetch("./data/data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    // 遍历数据数组，创建并添加消息卡片
    data.forEach((item) => {
      // 创建普通消息卡片
      const card = createMessageCard(
        item.title,
        item.time,
        item.message,
        item.hasPhotos,
        item.photoNum, // 从 item 对象中读取 photoNum
        true, // 显示头像区域
        false // 不显示 likeButton
      );

      // 获取所有的 div#message-container
      const containers = document.querySelectorAll("div#message-container");
      containers.forEach((container) => {
        container.appendChild(card.cloneNode(true));
      });

      // 创建详细消息卡片
      if (item.detail) {
        const detailCard = createMessageCard(
          item.title,
          item.time,
          item.detail, // 使用 item.detail 作为消息内容
          item.hasPhotos,
          item.photoNum, // 从 item 对象中读取 photoNum
          false, // 不显示头像区域
          true // 显示 likeButton
        );

        // 移除 clickable 属性
        detailCard.removeAttribute("clickable");

        // 获取所有的 div#message-container-detail
        const detailContainers = document.querySelectorAll(
          "div#message-container-detail"
        );
        detailContainers.forEach((detailContainer) => {
          detailContainer.appendChild(detailCard.cloneNode(true));
        });
      }
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });
