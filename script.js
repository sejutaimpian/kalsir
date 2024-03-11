document.addEventListener("alpine:init", () => {
  Alpine.data("order", function () {
    return {
      init() {
        setInterval(() => {
          this.time = new Date().toLocaleString();
        }, 1000);
        this.noStruk = Math.floor(Math.random() * 100000000000) + 1;
      },

      cancelOrder() {
        this.orderedProducts = [];
        this.selectedProducts = [];
        this.pay = 0;
        this.isPay = false;
        this.filterByKeyword = "";
        this.noStruk = Math.floor(Math.random() * 100000000000) + 1;
        Alpine.store("global").setToast("info", "Orderan berhasil dibatalkan");
      },
      get change() {
        return this.pay - this.totalPrice;
      },
      changeRecomendation: [
        {
          name: "5k",
          amount: 5000,
        },
        {
          name: "10k",
          amount: 10000,
        },
        {
          name: "15k",
          amount: 15000,
        },
        {
          name: "20k",
          amount: 20000,
        },
        {
          name: "25k",
          amount: 25000,
        },
        {
          name: "30k",
          amount: 25000,
        },
        {
          name: "40k",
          amount: 40000,
        },
        {
          name: "50k",
          amount: 50000,
        },
        {
          name: "55k",
          amount: 55000,
        },
        {
          name: "60k",
          amount: 60000,
        },
        {
          name: "70k",
          amount: 70000,
        },
        {
          name: "100k",
          amount: 100000,
        },
      ],
      filterByKeyword: "",
      finishOrder() {
        this.orderedProducts = [];
        this.selectedProducts = [];
        this.pay = 0;
        this.isPay = false;
        this.filterByKeyword = "";
        this.noStruk = Math.floor(Math.random() * 100000000000) + 1;
        Alpine.store("global").setToast(
          "success",
          "Orderan berhasil diselesaikan"
        );
      },
      /* Fungsi formatRupiah */
      formatRupiah(angka, prefix) {
        // memanggil function yg mereturn data harus diawali return
        return Alpine.store("global").formatRupiah(angka, prefix);
      },
      isPay: false,
      get isShortcut() {
        return Alpine.store("global").isShortcut;
      },
      set isShortcut(param) {
        Alpine.store("global").isShortcut = param;
      },
      noStruk: 0,
      orderedProducts: [],
      pay: 0,
      get products() {
        let products = Alpine.store("global").products;
        if (this.filterByKeyword) {
          products = products.filter((product) =>
            product.name
              .toLowerCase()
              .includes(this.filterByKeyword.toLowerCase())
          );
        } else {
          return [];
        }
        products = products.toSorted((a, b) => {
          let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
        return products;
      },
      get profile() {
        return Alpine.store("global").profile;
      },
      selectedProducts: [],
      selectProduct(id) {
        // validasi jika memilih barang yg sama
        if (this.selectedProducts.includes(id)) {
          return;
        }
        let orderedProduct = this.products.find((product) => product.id == id);
        orderedProduct.quantity = 1;
        orderedProduct.unit = this.units.find(
          (unit) => unit.id == orderedProduct.unitId
        ).shortName;
        // Object.defineProperty berguna untuk mendefinisikan property baru kedalam object yg sudah terlanjur dibuat
        Object.defineProperty(orderedProduct, "totalPrice", {
          configurable: true,
          get() {
            return this.price * this.quantity;
          },
        });
        this.selectedProducts.push(id);
        this.orderedProducts.push(orderedProduct);
        this.isPay = true;
      },
      get setChangeRecomendation() {
        return this.changeRecomendation.filter(
          (change) => change.amount > this.totalPrice
        );
      },
      setPay(amount) {
        this.pay = amount;
        this.filterByKeyword = "";
        this.isPay = false;
      },
      setQuantity(id, operation) {
        if (operation === "+") {
          this.orderedProducts.find((product) => product.id == id).quantity++;
        } else if (operation === "-") {
          if (
            this.orderedProducts.find((product) => product.id == id).quantity >
            1
          ) {
            this.orderedProducts.find((product) => product.id == id).quantity--;
          } else {
            this.unSelectProduct(id);
          }
        } else {
          console.error("Operasi tidak dikenali");
        }
      },
      time: new Date(),
      // perbedaan menggunakan getter dan tidak adalah saat property ini dipanggil pada property change
      // jika tanpa get maka akan mereturn seluruh function
      // Jika dengan get maka akan mereturn hasilnya
      // Sebaiknya jika function mereturn data gunakan getter
      get totalPrice() {
        return this.orderedProducts.reduce(
          (acc, curr) => acc + curr.totalPrice,
          0
        );
      },
      unSelectProduct(id) {
        this.selectedProducts = this.selectedProducts.filter(
          (pId) => pId != id
        );
        this.orderedProducts = this.orderedProducts.filter(
          (product) => product.id != id
        );
        // this.$magic digunakan untuk memanggil magic property
        this.$nextTick(() => this.$focus.focus(searchOrder));
      },
      get types() {
        return Alpine.store("global").types;
      },
      get units() {
        return Alpine.store("global").units;
      },
    };
  });
  Alpine.data("product", function () {
    return {
      createProduct() {
        this.formCreateProduct.id = Date.now();
        Alpine.store("global").createProduct(this.formCreateProduct);
        Alpine.store("global").setToast(
          "success",
          "Produk berhasil ditambahkan"
        );
        this.resetFormCreateProduct();
      },
      createType() {
        this.formCreateType.id = Date.now();
        if (this.formCreateType.icon == undefined) {
          this.formCreateType.icon = "undefined.png";
        }
        Alpine.store("global").createType(this.formCreateType);
        Alpine.store("global").setToast("success", "Type berhasil ditambahkan");
        this.resetFormCreateType();
      },
      createUnit() {
        this.formCreateUnit.id = Date.now();
        Alpine.store("global").createUnit(this.formCreateUnit);
        Alpine.store("global").setToast("success", "Unit berhasil ditambahkan");
        this.resetFormCreateUnit();
      },
      deleteProduct(id) {
        Alpine.store("global").deleteProduct(id);
        Alpine.store("global").setToast("success", "Berhasil menghapus produk");
      },
      deleteType(id) {
        Alpine.store("global").deleteType(id);
        Alpine.store("global").setToast("success", "Berhasil menghapus type");
      },
      deleteUnit(id) {
        Alpine.store("global").deleteUnit(id);
        Alpine.store("global").setToast("success", "Berhasil menghapus unit");
      },
      filterProductByKeyword: undefined,
      filterTypeByKeyword: undefined,
      filterUnitByKeyword: undefined,
      filterByType: undefined,
      formatRupiah(angka, prefix) {
        // memanggil function yg mereturn data harus diawali return
        return Alpine.store("global").formatRupiah(angka, prefix);
      },
      formCreateProduct: {
        id: undefined,
        name: undefined,
        description: undefined,
        typeId: undefined,
        unitId: undefined,
        price: undefined,
      },
      formCreateType: {
        id: undefined,
        name: undefined,
        description: undefined,
        icon: undefined,
      },
      formCreateUnit: {
        id: undefined,
        name: undefined,
        shortName: undefined,
      },
      icons: [
        "attack.png",
        "bangunan.png",
        "barbershop.png",
        "battery.png",
        "binocular.png",
        "bonds.png",
        "cangkir.png",
        "climbing-wall.png",
        "diamond.png",
        "dumbbell.png",
        "earbud.png",
        "eid-mubarok.png",
        "energy-drink.png",
        "french-fries.png",
        "game-controller.png",
        "gear.png",
        "hand-holding-heart.png",
        "hockey-skates.png",
        "iphone-se.png",
        "jajanan.png",
        "jet.png",
        "keranjang.png",
        "kopi.png",
        "love.png",
        "machete.png",
        "magnetic-card.png",
        "medal.png",
        "micro-sd.png",
        "minuman.png",
        "nfc.png",
        "paint-roller.png",
        "pakaian.png",
        "petani.png",
        "pill.png",
        "playstation-buttons.png",
        "puzzle.png",
        "rokok.png",
        "roller-skates.png",
        "ruma.png",
        "salon.png",
        "sekola.png",
        "sembako.png",
        "shield.png",
        "shotgun.png",
        "sim-card.png",
        "skull.png",
        "smartphone.png",
        "sofa.png",
        "sparkling.png",
        "star.png",
        "stethoscope.png",
        "support.png",
        "tank.png",
        "trainers.png",
        "tricycle.png",
        "trophy.png",
        "undefined.png",
        "us-dollar.png",
        "volleyball.png",
        "watches.png",
        "water-polo-ball.png",
      ],
      isActionFilter: false,
      isActionOrder: false,
      isCreateProduct: false,
      isCreateType: false,
      isCreateUnit: false,
      isModalEditProduct: false,
      isModalEditType: false,
      isModalEditUnit: false,
      get isProduct() {
        return Alpine.store("global").isProduct;
      },
      set isProduct(param) {
        Alpine.store("global").isProduct = param;
      },
      otherPages() {
        return this.pages.filter((page) => page != this.page);
      },
      get products() {
        let products = Alpine.store("global").products;
        if (this.filterByType) {
          products = products.filter(
            (product) => product.typeId == this.filterByType
          );
        }
        if (this.filterProductByKeyword) {
          products = products.filter((product) =>
            product.name
              .toLowerCase()
              .includes(this.filterProductByKeyword.toLowerCase())
          );
        }
        if (this.sortBy) {
          if (this.sortBy == "name") {
            products = products.toSorted((a, b) => {
              let fa = a.name.toLowerCase(),
                fb = b.name.toLowerCase();
              if (fa < fb) {
                return -1;
              }
              if (fa > fb) {
                return 1;
              }
              return 0;
            });
          }
          if (this.sortBy == "typeId") {
            products = products.toSorted((a, b) => a.typeId - b.typeId);
          }
          if (this.sortBy == "unitId") {
            products = products.toSorted((a, b) => a.unitId - b.unitId);
          }
          if (this.sortBy == "price") {
            products = products.toSorted((a, b) => a.price - b.price);
          }
        }
        return products;
      },
      page: "product",
      pages: ["product", "type", "unit"],
      resetFormCreateProduct() {
        this.formCreateProduct = {
          id: undefined,
          name: undefined,
          description: undefined,
          typeId: undefined,
          unitId: undefined,
          price: undefined,
        };
      },
      resetFormCreateType() {
        this.formCreateType = {
          id: undefined,
          name: undefined,
          description: undefined,
          icon: undefined,
        };
      },
      resetFormCreateUnit() {
        this.formCreateUnit = {
          id: undefined,
          name: undefined,
          shortName: undefined,
        };
      },
      selectedProduct: {},
      selectedType: {},
      selectedUnit: {},
      selectProduct(id) {
        if (this.selectedProduct.id == id) {
          this.selectedProduct = {};
          return;
        }
        this.selectedProduct = this.products.find(
          (product) => product.id == id
        );
      },
      selectType(id) {
        if (this.selectedType.id == id) {
          this.selectedType = {};
          return;
        }
        this.selectedType = this.types.find((type) => type.id == id);
      },
      selectUnit(id) {
        if (this.selectedUnit.id == id) {
          this.selectedUnit = {};
          return;
        }
        this.selectedUnit = this.units.find((unit) => unit.id == id);
      },
      sortBy: Alpine.$persist("").as("sortBy"), // name or typeId or unitId or price
      get types() {
        let types = Alpine.store("global").types;
        if (this.filterTypeByKeyword) {
          types = types.filter((type) =>
            type.name
              .toLowerCase()
              .includes(this.filterTypeByKeyword.toLowerCase())
          );
        }
        types = types.toSorted((a, b) => {
          let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
        return types;
      },
      get units() {
        let units = Alpine.store("global").units;
        if (this.filterUnitByKeyword) {
          units = units.filter((unit) =>
            unit.name
              .toLowerCase()
              .includes(this.filterUnitByKeyword.toLowerCase())
          );
        }
        units = units.toSorted((a, b) => {
          let fa = a.name.toLowerCase(),
            fb = b.name.toLowerCase();
          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        });
        return units;
      },
    };
  });
  Alpine.data("profile", function () {
    return {
      avatars: [
        "Buddy.png",
        "Chester.png",
        "Cleo.png",
        "Lilly.png",
        "Lucky.png",
        "Luna.png",
        "Mittens.png",
        "Oreo.png",
        "Sammy.png",
        "Snuggles.png",
      ],
      isAction: false,
      get isShortcut() {
        return Alpine.store("global").isShortcut;
      },
      set isShortcut(param) {
        Alpine.store("global").isShortcut = param;
      },
      isModal: false,
      // Ternyata setter & getter sangat bermanfaat saat dikombinasikan dengan Alpine.Store
      get profile() {
        return Alpine.store("global").profile;
      },
      set profile(param) {
        Alpine.store("global").profile = param;
      },
      toggleIsModal() {
        this.isModal = !this.isModal;
      },
    };
  });
  // Alpine.data yg isinya hanya merefer ke Alpine.store dimaksudkan agar pemanggilan data tidak terlalu panjang seperti $store.global.dataToast.message.
  Alpine.data("storage", function () {
    return {
      exportData() {
        Alpine.store("global").exportData();
      },
      importData() {
        Alpine.store("global").importData();
      },
      get isStorage() {
        return Alpine.store("global").isStorage;
      },
      set isStorage(param) {
        Alpine.store("global").isStorage = param;
      },
      get localData() {
        return Alpine.store("global").localData;
      },
      set localData(param) {
        Alpine.store("global").localData = param;
      },
    };
  });
  Alpine.data("toast", function () {
    return {
      get data() {
        return Alpine.store("global").dataToast;
      },
      get isShow() {
        return Alpine.store("global").isShow;
      },
    };
  });

  Alpine.store("global", {
    // LocalStorage
    exportData() {
      navigator.clipboard
        .writeText(JSON.stringify(localStorage))
        .then(this.setToast("success", "Berhasil Copy Data"), function (err) {
          console.error("Async: Could not copy text: ", err);
        });
      this.isStorage = false;
      this.localData = "";
    },
    importData() {
      // Proses import masih manual karena mengutamakan reaktivity AlpineJS.
      // Jadi setiap kali ada state $persist baru, ia harus ditambahkan manual ke importData()
      // Tolong dibantu
      try {
        data = JSON.parse(this.localData);
        this.isShortcut = JSON.parse(data.isShortcut);
        this.profile = JSON.parse(data.profile);
        this.products = JSON.parse(data.products);
        this.sortBy = JSON.parse(data.sortBy);
        this.types = JSON.parse(data.types);
        this.units = JSON.parse(data.units);
        this.setToast("success", "Berhasil Import Data");
      } catch (e) {
        this.setToast("danger", "Data tidak sesuai format");
      } finally {
        this.isStorage = false;
        this.localData = "";
      }
    },
    isShortcut: Alpine.$persist(true).as("isShortcut"),
    isStorage: false,
    localData: "",

    // Tadinya mau pakai popstate agar routenya ala-ala SPA
    // Popstate
    // page: 1,
    // setPage(number) {
    //   this.page = number;

    //   window.history.pushState(number, null, "product");
    // },

    // Product
    createProduct(product) {
      this.products.push(product);
    },
    createType(type) {
      this.types.push(type);
    },
    createUnit(unit) {
      this.units.push(unit);
    },
    deleteProduct(id) {
      this.products = this.products.filter((product) => product.id != id);
    },
    deleteType(id) {
      this.types = this.types.filter((type) => type.id != id);
    },
    deleteUnit(id) {
      this.units = this.units.filter((unit) => unit.id != id);
    },
    /* Fungsi formatRupiah */
    formatRupiah(angka, prefix) {
      var number_string = angka
          .toString()
          .replace(/[^,\d]/g, "")
          .toString(),
        split = number_string.split(","),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);

      // tambahkan titik jika yang di input sudah menjadi angka ribuan
      if (ribuan) {
        separator = sisa ? "." : "";
        rupiah += separator + ribuan.join(".");
      }

      rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
      return prefix == undefined ? rupiah : rupiah ? "Rp. " + rupiah : "";
    },
    isProduct: false,
    products: Alpine.$persist([
      {
        id: 1,
        name: "Beras",
        description: "Beras",
        typeId: 1,
        unitId: 2,
        price: 17000,
      },
      {
        id: 2,
        name: "Minyak Sayur",
        description: "Minyak Sayur Kiloan",
        typeId: 1,
        unitId: 2,
        price: 17500,
      },
      {
        id: 3,
        name: "Minyak Sayur",
        description: "Minyak Sayur Kiloan",
        typeId: 1,
        unitId: 3,
        price: 9000,
      },
      {
        id: 4,
        name: "Minyak Sayur",
        description: "Minyak Sayur Kiloan",
        typeId: 1,
        unitId: 4,
        price: 5000,
      },
      {
        id: 5,
        name: "Djarum Coklat",
        description: "Rokok Djarum Coklat",
        typeId: 2,
        unitId: 6,
        price: 17000,
      },
      {
        id: 6,
        name: "Djarum Coklat",
        description: "Rokok Djarum Coklat",
        typeId: 2,
        unitId: 5,
        price: 2000,
      },
      {
        id: 7,
        name: "Djarum Super",
        description: "Rokok Djarum Super",
        typeId: 2,
        unitId: 6,
        price: 26000,
      },
      {
        id: 8,
        name: "Djarum Super",
        description: "Rokok Djarum Super",
        typeId: 2,
        unitId: 5,
        price: 2500,
      },
      {
        id: 9,
        name: "Power F",
        description: "Minuman Gelas Power F",
        typeId: 3,
        unitId: 1,
        price: 1000,
      },
      {
        id: 10,
        name: "Ale-ale",
        description: "Minuman Gelas Ale-ale",
        typeId: 3,
        unitId: 1,
        price: 1000,
      },
      {
        id: 11,
        name: "Qtela",
        description: "Chiki qtela singkong",
        typeId: 3,
        unitId: 1,
        price: 2500,
      },
      {
        id: 12,
        name: "Milkuat Beku",
        description: "Milkuat Beku",
        typeId: 3,
        unitId: 1,
        price: 2000,
      },
      {
        id: 13,
        name: "Real Good Beku",
        description: "Real Good Beku",
        typeId: 3,
        unitId: 1,
        price: 2000,
      },
    ]).as("products"),
    types: Alpine.$persist([
      {
        id: 1,
        name: "Sembako",
        description: "Bahan/Kebutuhan Dapur",
        icon: "sembako.png",
      },
      {
        id: 2,
        name: "Rokok",
        description: "Rokok",
        icon: "rokok.png",
      },
      {
        id: 3,
        name: "Jajanan",
        description: "Jajanan Makanan & Minuman",
        icon: "jajanan.png",
      },
      {
        id: 4,
        name: "Bahan Bangunan",
        description: "Bahan Bangunan",
        icon: "bangunan.png",
      },
    ]).as("types"),
    units: Alpine.$persist([
      {
        id: 1,
        name: "1 Pieces",
        shortName: "pcs",
      },
      {
        id: 2,
        name: "1 Kilogram",
        shortName: "kg",
      },
      {
        id: 3,
        name: "½ Kilogram",
        shortName: "½kg",
      },
      {
        id: 4,
        name: "¼ Kilogram",
        shortName: "¼kg",
      },
      {
        id: 5,
        name: "1 Batang",
        shortName: "btg",
      },
      {
        id: 6,
        name: "1 Bungkus",
        shortName: "bks",
      },
    ]).as("units"),

    // Profile
    profile: Alpine.$persist({
      address: "JL. Tangerang Selatan",
      cashierName: "Irma Tri Yuana",
      emailAddress: "irma@gmail.com",
      message: "Terima Kasih Sudah Berbelanja",
      phoneNumber: "0899999999",
      profilePicture: "https://s6.imgcdn.dev/rE0Ee.md.png",
      shopName: "Warung Programmer Unpas",
    }).as("profile"),

    // Toast
    dataToast: {
      bgStyle: "",
      message: "",
      status: "",
      textStyle: "",
    },
    isShow: false,
    setToast(status, message) {
      this.dataToast.status = status;
      this.dataToast.message = message;
      if (status == "danger") {
        this.dataToast.bgStyle = "bg-red-500";
        this.dataToast.textStyle = "text-red-500";
      }
      if (status == "warning") {
        this.dataToast.bgStyle = "bg-yellow-500";
        this.dataToast.textStyle = "text-yellow-500";
      }
      if (status == "info") {
        this.dataToast.bgStyle = "bg-blue-500";
        this.dataToast.textStyle = "text-blue-500";
      }
      if (status == "success") {
        this.dataToast.bgStyle = "bg-green-500";
        this.dataToast.textStyle = "text-green-500";
      }

      this.isShow = true;
      setTimeout(() => (this.isShow = false), 2000);
    },
  });
});

// Tadinya mau pakai popstate agar routenya ala-ala SPA
// window.addEventListener("popstate", (e) => {
//   if (e.state >= 1) {
//     Alpine.store("global").page = e.state;
//     return;
//   }
//   Alpine.store("global").page = 1;
// });
