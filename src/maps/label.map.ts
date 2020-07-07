import dotenv from 'dotenv'
dotenv.config()

export const labelMap = new Map()
labelMap.set('reoccuring', process.env.reoccuringLabelId)
labelMap.set('pd', process.env.personalDevelopmentLabelId)
