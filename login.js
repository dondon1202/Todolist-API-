const email = document.querySelector("#email");
const pwd = document.querySelector("#pwd");
const sign_in = document.querySelector(".sign_in");
const p_account = document.querySelector(".alert-email");
const p_pwd = document.querySelector(".alert-pwd");

// 驗證空值
const vertify = () => {
  if (email.value.trim() == "") {
    p_account.innerHTML =
      "<div class='text-red-500 font-bold'>帳號尚未填寫</div>";
  }
  if (pwd.value.trim() == "") {
    p_pwd.innerHTML = "<div class='text-red-500 font-bold'>密碼尚未填寫</div>";
  }
};
// 登入功能
const signIn = () => {
  let obj = {
    user: {
      email: email.value,
      password: pwd.value,
    },
  };
  axios
    .post("https://todoo.5xcamp.us/users/sign_in", obj)
    .then((response) => {
      console.log(response.data);
      if (response.data.message == "登入成功") {
        token = response.headers.authorization;
        nickname = response.data.nickname;
        localStorage.setItem("authorization", token);
        localStorage.setItem("nickname", nickname);
        location.href = "/todo.html";
      }
    })
    .catch((error) => console.log(error));
};

// 登入監聽
sign_in.addEventListener("click", () => {
  vertify();
  signIn();
});
