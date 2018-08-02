<template>
  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%'}" style="overflow: hidden">
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div style="line-height: 64px;float: left;margin-left: 10px">
            <strong style="font-family: PingFang SC;color: white;line-height: 64px;font-size: 24px">满级问答</strong>
          </div>
          <div class="layout-nav">
            <MenuItem name="1">
              <Icon type="ios-navigate"></Icon>
              JAVA
            </MenuItem>
            <MenuItem name="2">
              <Icon type="ios-keypad"></Icon>
              PHP
            </MenuItem>
            <MenuItem name="3">
              <Icon type="ios-analytics"></Icon>
              HTML5
            </MenuItem>
            <MenuItem name="4">
              <Icon type="ios-paper"></Icon>
              JAVASCRIPT
            </MenuItem>
            <MenuItem name="5">
              <Icon type="ios-sunny-outline" />早上好，admin &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="md-time" />{{ currentTime }}&nbsp;&nbsp;&nbsp;&nbsp;
              <Dropdown>
                <a href="javascript:void(0)">
                  <Avatar style="background-color: #87d068" icon="ios-person" />
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem>个人中心</DropdownItem>
                  <DropdownItem>我的订单</DropdownItem>
                  <DropdownItem>修改密码</DropdownItem>
                  <DropdownItem>帮助中心</DropdownItem>
                  <DropdownItem divided v-on:click.native="logout()">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content :style="{margin: '88px 20px 0', background: '#fff', minHeight: '500px'}">
        <Scroll :height="scrollHeight">
        <div v-for="(question, index) in questionList" :key="question.id" style="background:#ffffff;padding:20px;">
          <h3 slot="title"><strong>{{ index + 1 + '、' +  question.question }}</strong></h3>
          <RadioGroup v-model="answer[question.id]" :vertical="question.newline">
            <Radio :label="selectionValue(i)" v-model="answer[question.id]" v-for="(selection, i) in question.selections" :key="selection.id"> <strong>{{ selectionValue(i) + '、' }}</strong>{{ selection.text }}</Radio>
          </RadioGroup>
        </div>
        </Scroll>
      </Content>
      <Footer class="layout-footer-center">2011-2018 &copy; 上海满吉教育投资有限公司</Footer>
    </Layout>
  </div>
</template>

<script>
import {formatDate} from '../../utils/dateUtil.js'
export default {
  data () {
    return {
      currentTime: '',
      questionList: [
        {'id': '1', 'newline': false, 'multi': false, 'question': '哪门语言是世界上最好的开发语言？', selections: [{'id': '11', 'text': 'JAVA'}, {'id': '12', 'text': 'PHP'}, {'id': '13', 'text': 'C++'}, {'id': '14', 'text': 'PYTHON'}]},
        {'id': '2', 'newline': true, 'multi': false, 'question': '哪门语言是世界上最好的开发语言？', selections: [{'id': '21', 'text': 'JAVA'}, {'id': '22', 'text': 'PHP'}, {'id': '23', 'text': 'C++'}, {'id': '24', 'text': 'PYTHON'}]},
        {'id': '3', 'newline': true, 'multi': true, 'question': '哪门语言是世界上最好的开发语言？', selections: [{'id': '31', 'text': 'JAVA'}, {'id': '32', 'text': 'PHP'}, {'id': '33', 'text': 'C++'}, {'id': '34', 'text': 'PYTHON'}]},
        {'id': '4', 'newline': false, 'multi': true, 'question': '哪门语言是世界上最好的开发语言？', selections: [{'id': '41', 'text': 'JAVA'}, {'id': '42', 'text': 'PHP'}, {'id': '43', 'text': 'C++'}, {'id': '44', 'text': 'PYTHON'}]},
        {'id': '5', 'newline': true, 'multi': false, 'question': '哪门语言是世界上最好的开发语言？', selections: [{'id': '51', 'text': 'JAVA'}, {'id': '52', 'text': 'PHP'}, {'id': '53', 'text': 'C++'}, {'id': '54', 'text': 'PYTHON'}]}
      ],
      answer: {}
    }
  },
  mounted () {
    this.refreshTime()
  },
  computed: {
    scrollHeight () {
      return screen.height - 265
    }
  },
  methods: {
    refreshTime () {
      this.currentTime = formatDate(new Date(), 'yy-MM-dd hh:mm:ss')
      setInterval(() => {
        this.currentTime = formatDate(new Date(), 'yy-MM-dd hh:mm:ss')
      }, 990)
    },
    selectionValue (index) {
      return String.fromCharCode('A'.charCodeAt() + index)
    }
  }
}
</script>

<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-nav{
    width: 1000px;
    margin: 0 auto;
    margin-right: -220px;
  }
  .layout-footer-center{
    text-align: center;
  }
</style>
