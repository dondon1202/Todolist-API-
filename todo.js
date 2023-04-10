const text = document.querySelector(".text");
const save = document.querySelector(".save");
const list = document.querySelector(".list");
const user = document.querySelector(".user");
const list_box = document.querySelector(".list-box");
const empty = document.querySelector(".empty");
const input = document.querySelector(".input");
const logoutBtn = document.querySelector(".logoutBtn");
let data = [];

const _url = "https://todoo.5xcamp.us";
const token = localStorage.getItem("authorization");
const nickname = localStorage.getItem("nickname");

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

// 右上角帶入LocalStorage username
user.innerHTML = nickname;

// 0筆跟有資料切換背景
const switch_statues = () => {
  if (data.length == 0) {
    list_box.classList.add("hidden");
    empty.classList.remove("hidden");
  } else if (data.length > 0) {
    list_box.classList.remove("hidden");
    empty.classList.add("hidden");
  }
};

// 組字串
const renderData = () => {
  const str = data
    .map((item, index) => {
      return `
        <ul class="flex items-center justify-between border-b-2 py-4">
          <li class="flex">
            <input class="flex h-[22px] w-[22px] cursor-pointer" type="checkbox"  />
            <p class="ml-4">${item.content}</p>
          </li>
          <li>
            <img src="images/Vector.svg" alt="" data-num="${index}" id="delete" class=" cursor-pointer"/>
          </li>
        </ul>
      `;
    })
    .join("");
  list.innerHTML = str;
};

//新增代辦功能
save.addEventListener("click", (e) => {
  if (text.value.trim() == "") {
    alert("請輸入內容");
    return;
  }
  const obj = {};
  obj.content = text.value;
  data.push(obj);
  renderData();
  switch_statues();
  input.reset();
});

//刪除代辦功能
list.addEventListener("click", (e) => {
  if (e.target.getAttribute("id") !== "delete") {
    return;
  }
  const num = e.target.getAttribute("data-num");
  console.log(num);
  data = data.filter((item, index) => index !== Number(num));
  renderData();
  switch_statues();
});
