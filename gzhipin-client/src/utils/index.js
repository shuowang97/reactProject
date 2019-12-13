/*
include multiple util functions
包含多个工具函数的模块
 */
/*
1.main page:
student: /student
recruiter: /boss

2.info completion page:
student: /studentinfo
recruiter: /bossinfo

判断是否已经完善信息： 判断user.header
判断用户类型： 判断user.type
 */
// 返回对应的路由路径
export function getRedirectTo(type, header) {
    let path
    if(type === 'student') {
        path = '/student'
    }else {
        path = '/boss'
    }
    if(!header) {
        path += 'info'
    }
    return path
}