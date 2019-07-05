export default {
  data() {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList() {
      let res = await this.$http({
        url: 'goods',
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      // console.log(res)
      this.goodsList = res.data.data.goods
      this.total = res.data.data.total
    },
    changePage(currentPage) {
      this.pagenum = currentPage
      this.getGoodsList()
    }
  }
}
