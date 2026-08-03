import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
    api: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lke4t7vu',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
    },
    deployment: {
        appId: 'bb6kpl5wg49516zyxnz3hxm7',
        autoUpdates: true,
    }
})