import { defineStore } from 'pinia';

//用户状态管理
export const useUserStore = defineStore('user', {
    state:()=>({
        token: localStorage.getItem('UserToken') as string || '',
        userInfo: null as any | null,
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
    },
    actions:{
        setToken(token: string) {
            this.token = token
            localStorage.setItem('UserToken', token)
        },
        setUserInfo(info: any) {
            this.userInfo = info
        },
        logout() {
            this.token = ''
            this.userInfo = null
            localStorage.removeItem('UserToken')
        }
    }
});