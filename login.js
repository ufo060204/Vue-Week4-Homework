import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";

const site = "https://vue3-course-api.hexschool.io/v2/";

const app = createApp({
  data() {
    return {
      user: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    login() {
      const url = `${site}admin/signin`;
      axios.post(url, this.user)
        .then((res) => {
          // 將 token 取出
          // 解構的寫法
          const { expired, token } = res.data;
          console.log(expired, token);
          // 儲存 token
          document.cookie = `ufoToken=${token}; expires=${new Date(expired)};`;
          window.location = './products.html';
        })
        .catch(err => {
          console.log(err);
        })
    }
  },
  mounted() {
  },
});

app.mount('#app');

