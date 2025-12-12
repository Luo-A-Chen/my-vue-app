import { defineStore } from 'pinia';

// 安全的 localStorage 操作
const safeGetItem = (key: string): string | null => {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        console.error(`获取 ${key} 失败:`, error);
        return null;
    }
};

const safeSetItem = (key: string, value: string): void => {
    try {
        localStorage.setItem(key, value);
        console.log(`${key} 已保存到 localStorage`);
    } catch (error) {
        console.error(`保存 ${key} 失败:`, error);
    }
};

const safeRemoveItem = (key: string): void => {
    try {
        localStorage.removeItem(key);
        console.log(`${key} 已从 localStorage 移除`);
    } catch (error) {
        console.error(`移除 ${key} 失败:`, error);
    }
};

// 初始化用户信息
const initUserInfo = (): any | null => {
    try {
        const userInfoStr = safeGetItem('UserInfo');
        console.log('初始化用户信息，localStorage 中的值:', userInfoStr);
        
        if (!userInfoStr || userInfoStr === 'null' || userInfoStr === 'undefined') {
            console.log('localStorage 中没有有效的用户信息');
            return null;
        }
        
        const userInfo = JSON.parse(userInfoStr);
        console.log('解析后的用户信息:', userInfo);
        return userInfo;
    } catch (error) {
        console.error('解析用户信息失败:', error);
        safeRemoveItem('UserInfo'); // 清除无效数据
        return null;
    }
};

//用户状态管理
export const useUserStore = defineStore('user', {
    state: () => ({
        token: safeGetItem('UserToken') || '',
        userInfo: initUserInfo(),
    }),
    getters: {
        isLoggedIn: (state) => !!state.token,
    },
    actions: {
        setToken(token: string) {
            console.log('设置 token:', token);
            this.token = token;
            safeSetItem('UserToken', token);
        },
        setUserInfo(info: any) {
            console.log('setUserInfo 被调用，参数:', info);
            
            if (info && typeof info === 'object') {
                // 保留现有用户信息，只更新传入的字段
                const currentUserInfo = this.userInfo || {};
                
                // 合并用户信息，新信息覆盖旧信息
                const userInfo = {
                    id: info.id || currentUserInfo.id || '',
                    name: info.name || currentUserInfo.name || '',
                    avatar: info.avatar || currentUserInfo.avatar || '',
                    email: info.email || currentUserInfo.email || '',
                    profile: info.profile || currentUserInfo.profile || '',
                    account: info.account || currentUserInfo.account || '',
                    token: info.token || currentUserInfo.token || this.token
                };
                
                // 清理空值
                Object.keys(userInfo).forEach(key => {
                    if (userInfo[key as keyof typeof userInfo] === null || userInfo[key as keyof typeof userInfo] === undefined) {
                        (userInfo as any)[key] = '';
                    }
                });
                
                console.log('处理后的用户信息:', userInfo);
                
                this.userInfo = userInfo;
                localStorage.setItem('UserInfo', JSON.stringify(userInfo));
                
                console.log('用户信息已保存到 localStorage');
                
                // 触发存储事件，通知其他页面更新
                window.dispatchEvent(new StorageEvent('storage', {
                    key: 'UserInfo',
                    newValue: JSON.stringify(userInfo),
                    storageArea: localStorage
                }));
            } else {
                console.log('清空用户信息');
                this.userInfo = null;
                localStorage.removeItem('UserInfo');
            }
        },
        logout() {
            console.log('用户退出登录');
            this.token = '';
            this.userInfo = null;
            safeRemoveItem('UserToken');
            safeRemoveItem('UserInfo');
            
            // 触发存储事件通知其他页面
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'UserInfo',
                newValue: null,
                storageArea: localStorage
            }));
        },
        
        // 强制刷新用户信息（从 localStorage 重新加载）
        refreshUserInfo() {
            console.log('刷新用户信息');
            const userInfo = initUserInfo();
            const token = safeGetItem('UserToken') || '';
            
            this.userInfo = userInfo;
            this.token = token;
            
            console.log('刷新后的用户信息:', this.userInfo);
            console.log('刷新后的 token:', this.token);
        }
    }
});