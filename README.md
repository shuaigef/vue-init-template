# Vue3 + ts 前端初始化模版

该项目用于 Vue3 + ts 的前端项目初始化，整合了目前主流的常用技术栈



## 技术栈

| 技术 | 说明 | 官网 |
| --- | --- | --- |
| vue3 | 前端框架 | https://vuejs.org/ | 
| pinia | 全局状态管理框架 | https://pinia.vuejs.org/ |
| ant-design-vue | 组件库 | https://www.antdv.com/ |
| vue-router | 路由框架 | https://router.vuejs.org/ |
| axios | 前端 Http 框架 | https://axios-http.com/ |
| vueuse | vue 工具库 | https://vueuse.org/ |
| biome | Web 工具链，替代 ESLint 和 Prettier | https://biomejs.dev/ |
| sass | CSS 强化 | https://www.sass.hk/ |



## 使用方式

1. 安装依赖

   ```node
   npm install
   ```

2. 运行项目

   ```node
   npm run dev
   ```

3. 打包

   ```node
   npm run build
   ```



### Boime 使用

- 格式化代码

  ```node
  npm run format
  ```

- 代码检查，检查代码中潜在的错误、代码风格问题等

  ```node
  npm run lint
  ```

- 同时执行格式化代码、代码检查、导入排序

  ```node
  npm run check
  ```

- 同时执行格式化代码、代码检查并进行安全修复、导入排序

  ```node 
  npm run fix
  ```



tips：

- 可使用编辑器插件快速格式化代码，
  - vscode，官方提供了详细的配置说明，https://biomejs.dev/zh-cn/reference/vscode/
  - webstorm，https://biomejs.dev/zh-cn/guides/editors/first-party-extensions/
- 项目默认不将 biome 与git 集成，若需要与 git 集成，可参考官方文档，https://biomejs.dev/zh-cn/guides/integrate-in-vcs/
- 若需要使用 Git Hooks，可参考官方文档，https://biomejs.dev/zh-cn/recipes/git-hooks/
