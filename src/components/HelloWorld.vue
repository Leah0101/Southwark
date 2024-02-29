<script setup>
import {
  ref,
  onMounted,
  nextTick
} from 'vue'
import {showDialog} from 'vant';
import {Button, Dialog, Field, CellGroup,Toast,showSuccessToast } from 'vant';
import 'vant/es/dialog/style';
import {createMark, getMarkList, delMark, editMark} from '../api/mark'

const pointList = ref([])
const currentMark = ref(null)
const imgRef = ref(null)
const fieldRef = ref(null)

function handelTap(event) {
  // console.log(event);
  let absoluteX = event.pageX; // 获取点击位置相对于文档左上角的水平坐标
  let absoluteY = event.pageY; // 获取点击位置相对于文档左上角的垂直坐标
  // 获取图片的宽高
  console.log(imgRef.value.width, imgRef.value.height);

  console.log("Absolute position", absoluteX, absoluteY);
  showCreateDialog.value = true;
  currentMark.value = {
    x: absoluteX / imgRef.value.width * 100,
    y: absoluteY / imgRef.value.height * 100,
    message: ''
  }
  setTimeout(() => {
    fieldRef.value.focus()
    console.log(fieldRef.value)
  },10)
  console.log(absoluteX, absoluteY, imgRef.value.width, imgRef.value.height, pointList.value);
}

const showCreateDialog = ref(false);
const currentMarkIndex = ref(0);
const createMessage = ref('');

function markClick(index) {
  showEditDialog.value = true;
  setTimeout(() => {
    console.log(editFieldRef.value)
    editFieldRef.value.focus()
  },10)
  currentMarkIndex.value = index;
  currentMark.value = pointList.value[index]
  editMessage.value = pointList.value[index].message;
  console.log("markClick", index, createMessage.value, currentMarkIndex.value, pointList.value);
}

function createDialogClick() {
  // console.log("message", createMessage.value);
  if (createMessage.value) {
    currentMark.value.message = createMessage.value;
    pointList.value.push(currentMark.value)
    createMessage.value = ''
    createMark(currentMark.value)
        .then(res => {
          console.log("创建成功",res);
          showSuccessToast({
            message:'Created successfully',
            wordBreak: 'break-word',
          });
          getMarkList()
              .then(res => {
                console.log(res);
                pointList.value = res.data;
              })
              .catch(err => {
                console.log(err);
              })
        })
        .catch(err => {
          console.log(err);
        })
  }
}

const showEditDialog = ref(false)
const editMessage = ref('')
const editFieldRef=ref(null)
function editDialogClick() {
  console.log("editDialogClick", currentMark.value)
  currentMark.value.message = editMessage.value
  const id = currentMark.value.id
  editMark({
    id,
    ...currentMark.value
  })
      .then(res => {
        console.log(res)
        showSuccessToast({
          message:'Edit successfully',
          wordBreak: 'break-word',
        });
        getMarkList()
            .then(res => {
              console.log(res);
              pointList.value = res.data;
            })
            .catch(err => {
              console.log(err);
            })
      })
      .catch(err => {
        console.log(err)
      })
}

let timeOutEvent

//长按事件（起始）
function gtouchstart(id) {
  var self = this;
  timeOutEvent = setTimeout(function () {
    longPress(id);
  }, 500); //这里设置定时器，定义长按500毫秒触发长按事件
  return false;
}

//手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
function showDeleteButton() {
  clearTimeout(timeOutEvent); //清除定时器
  if (timeOutEvent != 0) {
    //这里写要执行的内容（如onclick事件）
    console.log("点击但未长按");
  }
  return false;
}

//如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
function gtouchmove() {
  clearTimeout(timeOutEvent); //清除定时器
  timeOutEvent = 0;
}

//真正长按后应该执行的内容
function longPress(id) {
  timeOutEvent = 0;
  //执行长按要执行的内容，如弹出菜单
  console.log("长按");
  delMark({id})
      .then(res => {
        console.log("删除",res)
        showSuccessToast({
          message:'Deleted successfully',
          wordBreak: 'break-word',
        });
        getMarkList()
            .then(res => {
              console.log(res);
              pointList.value = res.data;
            })
            .catch(err => {
              console.log(err);
            })
      })
      .catch(err => {
        console.log(err)
      })
}

// 获取所有的mark
getMarkList()
    .then(res => {
      console.log(res);
      pointList.value = res.data;
    })
    .catch(err => {
      console.log(err);
    })
onMounted(() => {
  console.log("onMounted");
})
</script>

<template>
  <div class="map">
    <img class="bg-img" src="../assets/bao.jpg" alt="" @click="handelTap" ref="imgRef"/>
    <div class="mark" v-for="(mark,index) in pointList" :style="{left:mark.x+'%',top:mark.y+'%'}"
         @click="markClick(index)" @touchstart="gtouchstart(mark.id)"
         @touchmove="gtouchmove()"
         @touchend="showDeleteButton(mark.id)"
    ></div>
    <Dialog v-model:show="showCreateDialog" title="Input information" show-cancel-button confirmButtonText="create"
            cancelButtonText="cancel" @confirm="createDialogClick()">
      <Field
          v-model="createMessage"
          autosize
          type="textarea"
          maxlength="150"
          placeholder="Please enter a message"
          :autofocus="true"
          ref="fieldRef"
      />
    </Dialog>
    <Dialog v-model:show="showEditDialog" title="Edit information" show-cancel-button @confirm="editDialogClick()"
            confirmButtonText="edit" cancelButtonText="cancel">
      <Field
          v-model="editMessage"
          autosize
          type="textarea"
          maxlength="150"
          placeholder="Edit your message"
          ref="editFieldRef"
      />
    </Dialog>
  </div>
</template>

<style scoped>
.map {
  position: relative;
}

.bg-img {
  width: 100%;
  background-color: #fff;
}

.mark {
  position: absolute;
  /*top: 0px;*/
  /*left: 0px;*/
  width: 30px;
  height: 30px;
  background-image: url("../assets/mark.png"); /* 替换为您的透明PNG图像路径 */
  background-repeat: no-repeat;
  background-size: cover;
  background-color: rgba(255, 255, 255, 0); /* 将白色部分的透明度设置为0 */
  transform: translate(-50%, -60%);
  z-index: 10;
}

.mark img {
  width: 100%;
  height: 100%;
}
</style>
