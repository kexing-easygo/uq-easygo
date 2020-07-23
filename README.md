欢迎来到404小程序开发文档！这是一个随时会更新的文档，请留意文档变化。
# Github操作
## 复制该项目到你的本地文件夹
#### MacOS

1. 打开终端，切换到指定目录

2. 若初次使用git，请设置
```
git config --global user.name "Your Name"
git config --global user.email "Your githubemail address"
```
3. 输入指令，复制项目到本地
```
git clone https://github.com/wza15046319911/404.git
```

#### Windows电脑

1. 下载git bash
2. 重复MacOS第二步以后的操作

## 创建新分支
本地代码编辑，需创建分支，尽量不要在master分支上直接提交代码。UI设计师可以直接上传图片到web端github。

创建分支branchname并切换到branchname分支：
```
git checkout -b branchname
```

或者
```
git branch branchname
git checkout branchname
```

## 提交本地代码到固定分支
1. 将想添加的文件添加至版本更新：
```
git add filename
```
或者将目录下所有文件提交
```
git add *
```

2. 提交代码，并附上提交信息：

```
git commit -m "messgae"
```

3. 推送代码至固定的分支branchname
```
git push origin branchname
```

## 从远程仓库的指定分支branchname拉取到本地
```
git pull origin branchname
```

## 将本地分支和远程分支关联(optional)

如果你想每次git push / git pull都默认为固定分支branchname：

```
git push --set-upstream origin branchname
```
这样，以后只需要
```
git push 
git pull
```
即可。

# 小程序开发准备
## 下载开发工具
```
https://developers.weixin.qq.com/miniprogram/dev/devtools/stable.html
```

## 登陆
由于添加了各位为开发人员，之后可以直接登录自己的微信号即可。

## 环境信息
AppID:
```
wxc51fd512a103a723
```

云开发环境名称：uqeasygo
云开发环境ID: uqeasygo1


# UI设计
## 涉及链接
1.蓝湖链接🔗：https://lanhuapp.com/url/raGwO-1aNIK		


