<template>
  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%'}" style="z-index: 1">
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div style="line-height: 64px;float: left;margin-left: 10px">
            <strong style="font-family: PingFang SC;color: white;line-height: 64px;font-size: 24px">悟空问答</strong>
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
              <Icon type="ios-sunny-outline" /> {{ username }} &nbsp;&nbsp;&nbsp;&nbsp;<Icon type="md-time" />{{ currentTime }}&nbsp;&nbsp;&nbsp;&nbsp;
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
      <Content :style="{margin: '88px 20px 0', minHeight: '500px'}">
        <div>
          <div style="padding: 5px" v-for="(question, index) in questionList" :key="question.id">
            <Card :bordered="bordered" :dis-hover="true" style="z-index: 0">
              <p slot="title">{{ index + 1 + '、' +  question.question }}</p>
              <RadioGroup v-if="!question.multi" v-model="answer[question.id]" :vertical="question.newLine">
                <Radio :label="selectionValue(i)" v-for="(selection, i) in question.selections" :key="selection.id"> <strong>{{ selectionValue(i) + '、' }}</strong>{{ selection.text }}</Radio>
              </RadioGroup>
              <CheckboxGroup v-else :class="{ checkboxInlineBlock: !question.newLine }" v-model="answer[question.id]" v-for="(selection, i) in question.selections" :key="selection.id">
                <Checkbox :label="selectionValue(i)"><strong>{{ selectionValue(i) + '、' }}</strong>{{ selection.text }}</Checkbox>
              </CheckboxGroup>
            </Card>
          </div>
          <div style="text-align: center;margin-top: 10px">
            <Button type="info" size="large" class="button-width" @click="handleSubmit()">提交</Button>
            <Button type="success" size="large" class="button-width" @click="saveAnwser()">保存</Button>
          </div>
        </div>
      </Content>
      <Footer class="layout-footer-center">2011-2018 &copy; 上海满吉教育投资有限公司</Footer>
    </Layout>
    <Modal
      :ok-text="modalText"
      :loading="modalLoading"
      @on-ok="submitAnswer"
      v-model="answerModal"
      title="答案预览"
      width="420">
      <Alert show-icon>
        <template slot="desc">请仔细检查答案，确认无误后点击确定按钮提交答案，如需继续作请点击取消按钮！</template>
      </Alert>
      <Divider>您填写的答案</Divider>
      <p v-for="(text,index) in submitAnswers" :key="index"><strong>{{ index }}、</strong> {{ text }}</p>
    </Modal>
  </div>
</template>

<script>
import {formatDate} from '../../utils/dateUtil.js'
export default {
  data () {
    return {
      currentTime: '',
      questionList: [
        {'id': '1', 'newLine': false, 'multi': false, 'question': '（单选）哪门语言是世界上最好的开发语言？', selections: [{'id': '11', 'text': 'JAVA'}, {'id': '12', 'text': 'PHP'}, {'id': '13', 'text': 'C++'}, {'id': '14', 'text': 'PYTHON'}]},
        {'id': '2', 'newLine': false, 'multi': false, 'question': '（单选）在Java中，负责对字节代码解释执行的是？', selections: [{'id': '21', 'text': '应用服务器'}, {'id': '22', 'text': '虚拟机'}, {'id': '23', 'text': '垃圾回收机制'}, {'id': '24', 'text': '编译器'}]},
        {'id': '3', 'newLine': true, 'multi': false, 'question': '（单选）下列哪一个选项按照顺序包括了OSI模型的七个层次？', selections: [{'id': '31', 'text': '物理层 数据链路层 传输层 网络层 会话层 表示层 应用层'}, {'id': '32', 'text': '物理层 数据链路层 会话层 网络层 传输层 表示层 应用层'}, {'id': '33', 'text': ' 物理层 数据链路层 网络层 传输层 会话层 表示层 应用层'}, {'id': '34', 'text': ' 网络层 传输层 物理层 数据链路层 会话层 表示层 应用层'}]},
        {'id': '4', 'newLine': false, 'multi': true, 'question': '（多选）下面哪些不是java的简单数据类型？', selections: [{'id': '41', 'text': 'java'}, {'id': '42', 'text': 'Double'}, {'id': '43', 'text': 'Boolean'}, {'id': '44', 'text': 'float'}]},
        {'id': '5', 'newLine': true, 'multi': true, 'question': '（多选）在接口中以下哪条定义是正确的？', selections: [{'id': '51', 'text': 'void methoda();'}, {'id': '52', 'text': 'public double methoda();'}, {'id': '53', 'text': 'public final double methoda();'}, {'id': '54', 'text': 'static void methoda(double d1);'}]}
      ],
      answer: {},
      bordered: false,
      modalText: '确定',
      modalLoading: true,
      answerModal: false,
      submitAnswers: {}
    }
  },
  mounted () {
    this.refreshTime()
  },
  computed: {
    username () {
      const user = JSON.parse(window.sessionStorage.getItem('result'))
      if (!user) return ''
      let hours = new Date().getHours()
      if (hours > 6 && hours <= 9) {
        hours = '早上好'
      } else if (hours >= 9 && hours < 12) {
        hours = '上午好'
      } else if (hours >= 12 && hours < 14) {
        hours = '中午好'
      } else if (hours >= 14 && hours < 18) {
        hours = '下午好'
      } else if (hours >= 18 && hours < 24) {
        hours = '晚上好'
      } else {
        hours = '凌晨好'
      }
      return hours + '，' + user.nickname
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
    },
    handleSubmit () {
      let flag = this.chechAnswer()
      if (flag) {
        this.convertAnswer()
        this.modalText = '确定'
        this.answerModal = true
      }
    },
    chechAnswer () {
      if (JSON.stringify(this.answer) === '{}') {
        this.$Message.warning({
          content: '您还没有开始答题，请勿提交试卷！',
          duration: 6,
          closable: true
        })
        return false
      }
      let answerIds = []
      for (let answerId in this.answer) {
        answerIds.push(answerId)
      }
      let unansweredQuestionList = []
      for (let i = 0; i < this.questionList.length; i++) {
        let questionId = this.questionList[i].id
        let flag = this.inArray(questionId, answerIds)
        if (flag) {
          let answer = JSON.stringify(this.answer[questionId])
          if (answer === null || answer === undefined || answer === '' || answer === '[]') {
            unansweredQuestionList.push(questionId)
          }
        } else {
          unansweredQuestionList.push(questionId)
        }
      }
      if (unansweredQuestionList.length > 0) {
        let message = '第' + unansweredQuestionList.join('，') + '题您还没有作答，请先将题做完，再提交试卷！'
        this.$Message.warning({
          content: message,
          duration: 6,
          closable: true
        })
        return false
      }
      return true
    },
    inArray (str, arr) {
      if (!Array.isArray(arr)) return false
      let flag = false
      for (let obj of arr) {
        if (str === obj) {
          flag = true
          break
        }
      }
      return flag
    },
    submitAnswer () {
      this.modalText = '正在提交'
      setTimeout(() => {
        this.answer = {}
        this.answerModal = false
        this.$Notice.success({
          title: '操作提示',
          desc: '恭喜您完成了答题，您稍后可以在我的答题中查看得分及答案，如有疑问请联系管理员！',
          duration: 10
        })
        this.$nextTick(() => {
          this.modalLoading = true
        })
      }, 1000)
    },
    convertAnswer () {
      let temp = {}
      for (let text in this.answer) {
        if (Array.isArray(this.answer[text])) {
          let tempArr = this.answer[text]
          temp[text] = tempArr.sort().join('，')
        } else {
          temp[text] = this.answer[text]
        }
      }
      this.submitAnswers = temp
    },
    saveAnwser () {
      this.$Notice.success({
        title: '操作提示',
        desc: '您的试卷已经保存，你可以稍作休息后在我的试卷中查看并继续答题，也可以继续答题，如有疑问请联系管理员！',
        duration: 10
      })
    },
    logout () {
      window.sessionStorage.setItem('result', null)
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style scoped>
  .layout{
    position: relative;
    overflow-y: hidden;
    background: #b4dff0;
  }
  .layout-nav{
    width: 1000px;
    margin: 0 auto;
    margin-right: -220px;
  }
  .layout-footer-center{
    text-align: center;
  }
  .button-width{
    width: 100px;
  }
  .checkboxInlineBlock {
    display: inline-block;
  }
</style>
