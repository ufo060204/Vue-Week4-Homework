import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";
import pagination from "./pagination.js";

const site = "https://vue3-course-api.hexschool.io/v2/";
const api_path = "ufo060204";

let productModal = {};
let delProductModal = {};

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false, // 確認是編輯或是新增所使用的
      page: {

      },
    };
  },
  methods: {
    // 確認登入
    checkLogin() {
      const url = `${site}api/user/check`;
      axios
        .post(url)
        .then((res) => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          window.location = "./login.html";
        });
    },
    // 取得產品列表
    getProducts(page = 1) { // 參數預設值，沒有的話會是 undefined
      const url = `${site}api/${api_path}/admin/products/?page=${page}`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
          this.page = res.data.pagination;
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    openModal(status, product) {
      if (status === "create") {
        productModal.show();
        this.isNew = true;
        // 會帶入初始化資料
        this.tempProduct = {
          // 會傳入多張圖片，所以要帶上 imagesUrl，以防陣列結構出錯
          imagesUrl: [],
        };
      } else if (status === "edit") {
        productModal.show();
        this.isNew = false;
        // 會帶入當前要編輯的資料
        // 展開語法，不會去動到原本的資料
        this.tempProduct = { ...product };
      } else if (status === "delete") {
        delProductModal.show();
        this.tempProduct = { ...product }; // 等等取 id 使用
      }
    },
    updateProduct() {
      // const url = `${site}api/${api_path}/admin/product`;
      let url = `${site}api/${api_path}/admin/product`;
      // 用 this.isNew 判斷 API 要怎麼運行
      let method = "post";
      if (!this.isNew) {
        url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;
        method = "put";
      }

      // 資料在 data 裡面
      // 用變數 method 來帶入 post
      axios[method](url, { data: this.tempProduct })
        .then((res) => {
          // 重新取得產品列表
          this.getProducts();
          // 建立新產品後關閉 modal
          productModal.hide();
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
    deleteProduct() {
      const url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then((res) => {
          this.getProducts();
          delProductModal.hide();
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
  },
  // 區域元件一次可以這側許多子元件，這邊要加上 s
  components: {
    pagination,
  },
  mounted() {
    // 取出 token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)ufoToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    // axios headers 將 token 加入到 headers
    axios.defaults.headers.common["Authorization"] = token;
    this.checkLogin();

    //Bootstrap 方法
    // console.log(bootstrap);
    // 1. 初始化 new
    // 2. 呼叫方法 .show, hide
    productModal = new bootstrap.Modal("#productModal");
    // productModal.show(); // 確保他會動
    delProductModal = new bootstrap.Modal("#delProductModal");
  },
});

app.component("product-modal", {
  props: ["tempProduct", "updateProduct", "deleteProduct"],
  template: "#product-modal-template",
});
// import 滿多都會使用區域註冊
// 全域註冊的寫法
// app.component('pagination', pagination);
app.mount("#app");
