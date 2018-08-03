<template>
  <div style="position: relative;width: 100%">
    <Upload
    :before-upload="handleUpload"
    action=""
    type="drag">
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52"></Icon>
        <p>点击或将文件拖拽到此处进行上传</p>
      </div>
    </Upload>
    <Alert show-icon>图片检索服务测试，目前仅支持上传png和jpg类型文件</Alert>
    <Card v-if="file">
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        文件预览
      </p>
      <a href="#" slot="extra" @click.prevent="upload">
        <Icon type="arrow-up-a"></Icon>
        上传
      </a>
      <div style="text-align:center">
        <img :src="preImg" style="height: 200px"/>
        <h5>{{ file.name }}</h5>
      </div>
    </Card>
    <br>
    <Card v-if="imageList.length !== 0">
      <p slot="title">
        <Icon type="ios-film-outline"></Icon>
        检索结果
      </p>
      <a href="javascript:void(0)" style="text-align:center;display: inline-block;" v-for="img in imageList" :key="img.url" v-on:click="searchByName(img.tag)">
        <img :src="imageUrl(img.url)" style="width: 200px;">
        <h5 style="color: #495060"> {{ img.tag }}</h5>
      </a>
    </Card>
    <Modal
      v-model="modal"
      title="图片检索结果"
    @on-cancel="closeScroll"
      width="1000px"
    heigth="700px">
      <Scroll v-if="scrollShow">
        <Card v-for="img in searchList" :key="img.url" id="scroll" style="display: inline-block">
          <div style="text-align:center;">
            <img :src="imageUrl(img.url)" style="width: 200px;">
            <h5> {{ img.tag }}</h5>
          </div>
        </Card>
      </Scroll>
    </Modal>
    <Spin fix size="large" v-if="spin"></Spin>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
  data () {
    return {
      file: null,
      loadingStatus: false,
      base64Code: '',
      spin: false,
      suffixName: '',
      preImg: '',
      imageList: [],
      modal: false,
      searchList: [],
      scrollShow: false
    }
  },
  methods: {
    closeScroll () {
      this.scrollShow = false
    },
    handleUpload (file) {
      this.suffixName = this.getSuffixName(file.name)
      if (this.suffixName === '.jpg' || this.suffixName === '.png') {
        let r = new FileReader()
        r.readAsDataURL(file)
        r.onload = () => {
          this.preImg = r.result
          this.getBase64Code()
        }
        this.file = file
      } else {
        this.$Message.warning('上传的文件必须是图片类型，仅支持png和jpg类型')
      }
      return false
    },
    imageUrl (url) {
      return axios.defaults.baseURL + url
    },
    searchByName (name) {
      if (name) {
        axios.get('/ImageRetrival/?name=' + name)
          .then(response => {
            this.loadingStatus = false
            this.spin = false
            let data = response.data
            if (data.body.msg === 'success') {
              this.$Message.success('图片检索成功！')
              this.scrollShow = true
              this.searchList = data.body.list
              this.modal = true
            } else {
              this.$Message.warning('请求服务器出错，原因：' + data.body.msg)
            }
          })
          .catch(reason => {
            this.$Message.error('服务器繁忙，请稍后再试！')
            this.loadingStatus = false
            this.spin = false
          })
      } else {
        this.$Message.warning('文件名为空，禁止搜索！')
      }
    },
    upload () {
      if (this.suffixName === '') {
        this.$Message.warn('文件后缀名不正确，禁止上传文件')
      }
      this.loadingStatus = true
      this.spin = true
      const param = {
        format: 'json',
        pic: this.base64Code,
        type: this.suffixName
      }
      const headers = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }
      axios.post('/ImageSearch', qs.stringify(param), headers)
        .then(response => {
          let data = response.data
          if (data.body.msg === 'success') {
            this.$Message.success('文件上传成功')
            this.imageList = data.body.list
          } else {
            this.$Message.warning('请求服务出错，原因：' + data.body.msg)
          }
          this.loadingStatus = false
          this.spin = false
        })
        .catch(reason => {
          this.$Message.error('服务当前不可用，请稍后再试！')
          this.loadingStatus = false
          this.spin = false
        })
    },
    getSuffixName (fileName) {
      let arr = fileName.split('')
      let i = arr.reverse().join('').indexOf('.')
      if (i > -1) {
        return fileName.substring(fileName.length - i - 1)
      }
      return ''
    },
    getBase64Code () {
      this.base64Code = this.preImg.substring(22)
    }
  }
}
</script>

<style scoped>

</style>
