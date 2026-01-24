import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
    api: {
        projectId: 'lke4t7vu', // 必须手动在这里也写一遍
        dataset: 'production'
    },
    deployment: {
        appId: 'bb6kpl5wg49516zyxnz3hxm7',
    }
})