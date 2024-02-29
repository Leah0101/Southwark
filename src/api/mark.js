import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8000'
// 获取标注列表
export const getMarkList = (params) => {
  return axios.get('/mark', { params })
}
// 创建标注
export const createMark = (data) => {
  return axios.post('/mark', data)
}

// 修改
export const editMark = (data) => {
  return axios.post(`/mark/${data.id}`, data)
}
// 删除
export const delMark = (data) => {
  return axios.delete(`/mark/${data.id}`)
}
