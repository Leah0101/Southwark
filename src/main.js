import { createApp } from 'vue'
import App from './App.vue'
// 1. 引入你需要的组件
import { Button } from 'vant';
import { Dialog } from 'vant';
import { showDialog } from 'vant';
import 'vant/es/dialog/style';
// 2. 引入组件样式
import 'vant/lib/index.css';

createApp(App).mount('#app')
