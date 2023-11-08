import { processTypeEnum } from '@tarojs/helper'
import { IPluginContext } from '@tarojs/service'
import fs from 'fs-extra'
import path from 'path'
import { Paths } from './types'

export class Plugin {
  paths: Paths
  constructor(public readonly ctx: IPluginContext, public config) {
    this.initConfig()
  }

  /**
   * 初始化配置
   */
  initConfig() {
    const paths = {
      ...this.ctx.paths,
      corePath: path.resolve(this.ctx.paths.nodeModulesPath, 'tarojs-router-next/dist'),
      targetPath: path.resolve(this.ctx.paths.sourcePath, 'router-next'),
    }
    this.paths = paths
  }

  onBuildStart() {
    this.ctx.onBuildStart(() => {
      this.generateLibCore()
    })
    return this
  }

  registerCommand() {
    const { ctx } = this
    // ctx.registerCommand({
    //   name: 'router-gen',
    //   optionsMap: {
    //     '--watch': '监听页面信息变化自动生成 Router',
    //   },
    //   synopsisList: ['taro router-gen 生成 Router', 'taro router-gen --watch 监听页面信息变化自动生成 Router'],
    //   fn: () => {},
    // })
    return this
  }

  log(type: processTypeEnum, text: string) {
    this.ctx.helper.printLog(type, text)
  }

  /**
   * 向目标路径生成库源码
   */
  generateLibCore() {
    if (fs.pathExistsSync(this.paths.targetPath)) return
    fs.copySync(this.paths.corePath, this.paths.targetPath)
    this.log(processTypeEnum.GENERATE, `router-next 已生成至：${this.paths.targetPath}`)
  }
}
