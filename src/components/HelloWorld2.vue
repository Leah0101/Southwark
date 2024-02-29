<script setup>
import {
  ref,
  onMounted
} from 'vue'
import {showDialog} from 'vant';
import {Button, Dialog, Field, CellGroup} from 'vant';
import 'vant/es/dialog/style';
import {createMark,getMarkList} from '../api/mark'

const pointList = ref([])
const currentMark = ref(null)
const imgRef = ref(null)
function handelTap(event) {
  // console.log(event);
  let absoluteX = event.pageX; // 获取点击位置相对于文档左上角的水平坐标
  let absoluteY = event.pageY; // 获取点击位置相对于文档左上角的垂直坐标
  // 获取图片的宽高
  console.log(imgRef.value.width, imgRef.value.height);

  console.log("Absolute position", absoluteX, absoluteY);
  const point = {
    x: absoluteX / imgRef.value.width * 100,
    y: absoluteY / imgRef.value.height * 100,
    message: ''
  }
  // pointList.value.push(point)
  show.value = true;
  currentMark.value = point;
  console.log(absoluteX,absoluteY,imgRef.value.width,imgRef.value.height,pointList.value);
}

const show = ref(false);
const currentMarkIndex = ref(0);
const message = ref('');

function markClick(index) {
  show.value = true;
  currentMarkIndex.value = index;
  currentMark.value = pointList.value[index]
  if (pointList.value[index].message) {
    message.value = pointList.value[index].message;
  }
  console.log("markClick", index,message.value,currentMarkIndex.value,pointList.value);
}

function dialogClick() {
  console.log("message", message.value);
  // 当创建mark
  if (!currentMark.value.message){
    currentMark.value.message = message.value;
    pointList.value.push(currentMark.value)
    createMark(currentMark.value)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
  }else {
    // 当修改查看mark
    pointList.value[currentMarkIndex.value].message = message.value;

    // message.value = currentMark.value.message
  }

}
onMounted(() => {
  console.log("onMounted");
  // 获取所有的mark
  getMarkList()
    .then(res => {
      console.log(res);
      pointList.value = res.data;
    })
    .catch(err => {
      console.log(err);
    })
})
</script>

<template>
  <div class="map">
    <img class="bg-img" src="../assets/bao.jpg" alt="" @click="handelTap" ref="imgRef"/>
    <div class="mark" v-for="(mark,index) in pointList" :style="{left:mark.x+'%',top:mark.y+'%'}"
         @click="markClick(index)"></div>
    <Dialog v-model:show="show" title="Input information" show-cancel-button @confirm="dialogClick()">
      <Field
          v-model="message"
          autosize
          type="textarea"
          maxlength="150"
          placeholder="Please enter a message"
      />
    </Dialog>
  </div>
</template>

<style scoped>
.map{
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
  width: 40px;
  height: 40px;
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
