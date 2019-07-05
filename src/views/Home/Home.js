export default {
  data() {
    return {
      menusList: []
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    async render() {
      let res = await this.$http({
        url: 'menus'
      })
      this.menusList = res.data.data
      // console.log(this.menusList)
    }
  },
  created() {
    this.render()
  }
}
