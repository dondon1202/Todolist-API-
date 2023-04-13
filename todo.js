const text = document.querySelector(".text");
const save = document.querySelector(".save");
const list = document.querySelector(".list");
const user = document.querySelector(".user");
const list_box = document.querySelector(".list-box");
const empty = document.querySelector(".empty");
const input = document.querySelector(".input");
const logoutBtn = document.querySelector(".logoutBtn");
const edit = document.querySelector(".edit");
const checkBox = document.querySelector(".checkbox");
const countDataDom = document.querySelector(".countdata");

let current_tab = "allBtn"; // all, notDone, done
let data = [];

// const allBtn = document.querySelector(".allbtn");
// const notDoneBtn = document.querySelector(".notdonebtn");
// const doneBtn = document.querySelector(".donebtn");

const _url = "https://todoo.5xcamp.us";
const token = localStorage.getItem("authorization");
const nickname = localStorage.getItem("nickname");
console.log(token);

// 判斷0筆跟有資料的時候切換背景圖

const switch_statues = () => {
  if (data.length == 0) {
    list_box.classList.add("hidden");
    empty.classList.remove("hidden");
  } else if (data.length > 0) {
    list_box.classList.remove("hidden");
    empty.classList.add("hidden");
    const cleanBtn = document.querySelector(".cleanbtn");
    cleanBtn.addEventListener("click", () => {
      cleanDoneTodo();
    });
    document.getElementById("allBtn").addEventListener("click", (e) => {
      allBtn.classList.add(
        "border-b-4",
        "border-black",
        "text-[20px]",
        "font-black"
      );
      doneBtn.classList.remove(
        "border-b-4",
        "border-black",
        "text-[20px]",
        "font-black"
      );
      notDoneBtn.classList.remove(
        "border-b-4",
        "border-black",
        "text-[20px]",
        "font-black"
      );
      current_tab = "allBtn";
      renderData();
    });

    document.getElementById("notDoneBtn").addEventListener("click", (e) => {
      notDoneBtn.classList.add(
        "border-b-4",
        "border-black",
        "text-[20px]",
        "font-black"
      );
      allBtn.classList.remove(
        "border-b-4",
        "border-black",
        "text-[20px]",
        "font-black"
      );
      doneBtn.classList.remove(
        "border-b-4",
        "border-black",
        "text-[20px]",
        "font-black"
      );
      current_tab = "notDoneBtn";
      renderData();
    });

    document.getElementById("doneBtn").addEventListener("click", (e) => {
      doneBtn.classList.add(
        "border-b-4",
        "border-black",
        "text-[20px]",
        "font-black"
      );
      allBtn.classList.remove(
        "border-b-4",
        "border-black",
        "text-[20px]",
        "font-black"
      );
      notDoneBtn.classList.remove(
        "border-b-4",
        "border-black",
        "text-[20px]",
        "font-black"
      );
      current_tab = "doneBtn";
      renderData();
    });
  }
};

// 取得 todo
const getTodo = () => {
  axios
    .get(`${_url}/todos`, {
      headers: {
        authorization: token,
      },
    })
    .then((response) => {
      // console.log(response.data);
      data = response.data.todos;
      renderData(data);
      switch_statues();
      // console.log(data.length);
    });
};

// 在一進入網頁時就呼叫 getTodo()
axios
  .get(`${_url}/check`, {
    headers: {
      authorization: token,
    },
  })
  .then(() => {
    user.textContent = `${nickname}的待辦`;
    getTodo();
  })
  .catch(() => {
    location.href = "index.html";
  });

// 渲染TODO
const renderData = () => {
  const str = data
    .filter(filterDisplayData)
    .map((item, index) => {
      // console.log(item.id);
      return `
        <ul class="flex items-center justify-between border-b-2 py-4">
          <li class="flex">
            <img class="checkbox flex h-[22px] w-[22px] cursor-pointer " type="checkbox" data-num="${
              item.id
            }" src="${
        item.completed_at !== null
          ? "./images/check.svg"
          : "./images/checkbox.svg"
      }" />
            <p class="${
              item.completed_at !== null
                ? "ml-4 edit line-through"
                : "ml-4 edit"
            }">${item.content}</p>
          </li>
          <li>
            <img src="images/Vector.svg" alt="" data-num="${
              item.id
            }" id="delete" class=" cursor-pointer"/>
          </li>
        </ul>

      `;
    })
    .join("");
  let count = "";
  if (current_tab === "allBtn" || current_tab === "notDoneBtn") {
    count = `<p>${notDoneLength()}個待完成事項</p>`;
  } else {
    let doneLength = data.filter(
      (item) => item.completed_at !== null && item.completed_at !== undefined
    ).length;
    count = `<p>${doneLength}個已完成事項</p>`;
  }

  const countData_str = `          
          <div class="flex justify-between mt-4">
           ${count}
            <p class="cursor-pointer text-[#9F9A91] cleanbtn" name="cleanbtn">清除已完成項目</p>
          </div>`;
  // 計算有幾筆待完成事項

  list.innerHTML = str;
  countDataDom.innerHTML = countData_str;
};

// 新增todo
const addtodo = () => {
  if (text.value.trim() == "") {
    alert("請輸入內容");
    return;
  }
  const obj = {};
  obj.content = text.value;
  // console.log(obj);
  data.push(obj);
  renderData();
  switch_statues();

  let addObj = {
    todo: {
      content: text.value,
    },
  };

  //輸入後表單清空
  input.reset();

  axios
    .post(`${_url}/todos`, addObj, {
      headers: {
        authorization: token,
      },
    })
    .then((response) => {
      // console.log(response.data);
      // console.log(response);
      data.push(response.data);
      getTodo();
    })
    .catch((error) => {
      alert(error);
    });
};
save.addEventListener("click", addtodo);

// 刪除todo
list.addEventListener("click", (e) => {
  if (e.target.getAttribute("id") !== "delete") {
    return;
  }
  // 拿到todo列表的id
  const targetId = e.target.getAttribute("data-num");

  // 過濾出新陣列，刪除索引為 targetId 的元素
  data = data.filter((item, index) => index !== Number(targetId));

  // 根據 targetId 找到要刪除的元素
  const targetItem2 = data.find((item) => item.id === targetId);

  // 使用 axios 發送刪除請求
  axios
    .delete(`${_url}/todos/${targetId}`, {
      headers: {
        authorization: token,
      },
    })
    .then(() => {
      // 從陣列中刪除目標元素
      data.splice(data.indexOf(targetItem), 1);
      // 重新渲染列表
      renderData();

      switch_statues();
    });
});

// 刪除已完成todo
const cleanDoneTodo = () => {
  // 篩選需要被刪除的清單(已完成)
  let cleanList = data.filter(
    (item) => item.completed_at !== undefined && item.completed_at !== null
  );
  // console.log(data);

  Promise.all(
    cleanList.map((item) => {
      return axios.delete(`${_url}/todos/${item.id}`, {
        headers: {
          authorization: token,
        },
      });
    })
  ).then(() => {
    data = data.filter(
      (item) => item.completed_at === undefined || item.completed_at === null
    );
    renderData();
  });
};

// 登出功能
const logout = () => {
  axios
    .delete(`${_url}/users/sign_out`, {
      headers: {
        authorization: token,
      },
    })
    .then((response) => {
      localStorage.removeItem("authorization");
      localStorage.removeItem("nickname");
      alert(response.data.message);
      location.href = "index.html";
    })
    .catch((error) => {
      console.log(error);
      alert("登出失敗");
    });
};
// 當登出被點擊
logoutBtn.addEventListener("click", () => {
  logout();
});

// 切換狀態
list.addEventListener("click", (e) => {
  if (e.target.getAttribute("type") !== "checkbox") {
    return;
  }
  // 拿到todo列表的id
  const targetId = e.target.getAttribute("data-num");
  let targetObj = data.filter((item) => item.id === targetId)[0]; // 找出被勾選的整筆資料
  // data = data.filter((item, index) => index !== Number(targetId));
  // renderData();
  // switch_statues();
  // console.log(e.target.parentNode);

  // // console.log(targetId);
  // const targetItem = data.filter((item) => item.id === targetId)[0];
  // console.log(targetItem);

  axios
    .patch(`${_url}/todos/${targetId}/toggle`, "", {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      console.log("res", res);
      data.splice(data.indexOf(targetObj), 1, res.data); //從data中把被勾選的資料拿掉，把新的資料放進去
      console.log("data >>>", data);
      renderData();
      switch_statues();
      // console.log(data);
    });
});

// ENTER 新增todo
const enter = (e) => {
  if (e.keyCode !== 13) {
    return;
  }
  addtodo();
};

const notDoneLength = () => {
  return data.filter(
    (item) => item.completed_at === null || item.completed_at === undefined
  ).length;
};

const filterDisplayData = (item) => {
  switch (current_tab) {
    case "allBtn":
      return true;
    case "notDoneBtn":
      return item.completed_at === null || item.completed_at === undefined;
    case "doneBtn":
      return !(item.completed_at === null || item.completed_at === undefined);
  }
};

document.addEventListener("keydown", enter);
