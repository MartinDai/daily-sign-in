# daily-sign-in
使用 Github Actions 实现每日签到获取奖励并发送通知

# 如何使用
1. fork本项目到自己的仓库中，切换到的Actions tab页 点击"I understand my workflows, go ahead and enable them"按钮，保证workflows也一起fork过去
2. 根据自己的需求在项目的Settings -> Secrets and variables -> Actions页面配置相应的secrets即可
3. 如果需要修改每日定时签到的时间，可以修改`.github/workflows/daily_action.yml`文件内的cron表达式

# 支持的签到网站
- [heapdump](https://heapdump.cn/)，需配置secrets key：HEAPDUMP_COOKIE

# 支持的通知方式
- [Server酱](https://sct.ftqq.com/)，需配置secrets key：SERVER_CHAN_SEND_KEY
- [钉钉机器人](https://open.dingtalk.com/document/orgapp/robot-overview)，需配置secrets key：DINGTALK_URL

# 参与贡献
欢迎提交PR丰富支持的网站和通知方式