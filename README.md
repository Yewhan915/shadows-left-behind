# 余影 · Shadows Left Behind

相机手势驱动的 Opportunity 互动数字皮影戏原型。

## 启动
双击 START.bat（需要 Python 3），浏览器自动打开本机网站。保持启动窗口打开。按 Ctrl+C 停止。不要直接双击 index.html：相机和模型需要通过本机服务器加载。

## 操作
- 开始故事后，移动鼠标操控角色，点击下一句或按空格推进。
- 点击启用相机并允许权限：第一幕张开手掌，第二幕握拳，第三幕拇指食指捏合。看每段提示，保持约 1.3 秒。每次触发后松开手势再继续。
- 1、2、3 跳至对应幕；重置重新开始；旁白开关启用系统中文语音。
- 不需要麦克风；本版本使用预写故事，不包含观众语音转写或 AI 即兴编剧。
- 相机不录制、不上传。MediaPipe 模型及运行库保存在 vendor；首次使用也无需下载模型。可选 Google 字体需要网络，无网络时使用系统字体。

## 故事与依据
主角：NASA Opportunity。第一人称台词为拟人化创作，手势唤醒为舞台隐喻，不代表实际重启。
NASA 任务档案：https://science.nasa.gov/mission/mer-opportunity/
NASA 任务结束公告：https://www.nasa.gov/news-release/nasas-record-setting-opportunity-rover-mission-on-mars-comes-to-end/

## 实现
原生 HTML / CSS / Canvas / JavaScript；MediaPipe Tasks Vision 0.10.21，Hand Landmarker（Google）。皮影和地形由 Canvas 绘制，无需美术资源。运行库来源：https://www.jsdelivr.com/package/npm/@mediapipe/tasks-vision ，模型：https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task 。MediaPipe 代码采用 Apache-2.0，见 vendor/LICENSE。模型使用受其发布方条款约束。浏览器推荐 Chrome 或 Edge。

## 中英文切换 / Language
左上角 EN / 中文按钮切换界面、完整故事、帮助说明与旁白语言。切换保留当前故事进度，并在本机记住语言选择。英文旁白使用系统可用的英文语音。


## 1.1 互动记忆剧场
开场需先点击接通信号以启用浏览器声音。挥手连接：在舞台内左右移动四次，或使用相机张开手掌左右挥动。第一幕按住岩石 0.8 秒扫描（三块）；第二幕按住舞台 / 张开手掌聚光（8 秒，无失败）；第三幕拖动三个光点到右上方地球，或捏合抓取、移动、张手释放。完整中文英文故事与提示。声音包含本机合成连接提示音、扫描音、记忆旋律及沙尘风声；角色旁白仍使用系统语音，优先选择可用自然音色，尚未加入录制配音。数字 1 / 2 / 3 可跳幕。1.0 备份保持在 versions/1.0。

## 1.1 角色配音更新
中英文角色对白已改为本地 MP3 神经语音片段，共 66 段，存放 audio/oppy。中文音色 Xiaoyi，英文音色 Ana；分句语速、音高和句间停顿按段落调整。使用 edge-tts 调用 Microsoft Edge 在线合成服务生成（生成时发送作品对白；播放时仅访问本机文件）。这不是演员录音。文件不可用时回退系统语音。声音开关控制角色对白，音效开关控制环境与交互音。代码工具来源：https://github.com/rany2/edge-tts 。1.0 基线未修改。

对白由观众按空格或点击继续推进。张手用于挥手、聚光和放下记忆，聚光计时为 8 秒。

## 1.3 视觉打磨与展示材料
游戏逻辑与 1.2 相同（test-v11 全部通过），只改画面与声音反馈：
- 舞台：幕后灯光随 Oppy 移动并轻微闪动、漂浮光圈与光尘、四角星闪烁、第二幕流星、纸纹与暗角；页面背景隐藏全景图刻度，舞台外框改为灯笼幕样式。
- 图案统一为剪纸皮影风：立体岩层岩石（扫描后出现水纹）、带光芒与波纹的信标、带操偶杆的剪纸地球；第三幕三颗记忆改为剪纸信物——带水纹的岩石（探索）、小太阳（坚持）、张开的小手（相遇）。提示文字由「光点」改为「记忆」。
- 庆祝：扫描岩石、送达记忆、到达信标时飞出暖金色发光星星，Oppy 跳一下并有上扬音效；完成最后一个时效果更大。
- 新增 intro.html：英文项目介绍页，8 个部分，含 3 个鼠标小游戏。← → 翻页，H 隐藏导航（录屏用），F 全屏。
- 新增 demo-video.html：2 分 54 秒自动播放的英文旁白演示片（16:9，8 个章节）。马来西亚非物质文化遗产皮影戏 Wayang Kulit → 文化遗产 × 叙事科技 → 「皮影 + 摄像头 AR」的想法 → 片名 → 真实的 Opportunity → **LIVE DEMO（真人游玩，一整段 88 秒）** → 技术原理 → 结尾。真人片段命名为 clips/demo.mp4 放进去会自动播放，拍摄计划见 clips/README.md；按 K 可把 Demo 段变成纯黑，方便在剪辑软件里替换。旁白为 edge-tts 神经语音（en-US-AndrewMultilingualNeural，语速 +10%），稿子在 audio/narration/script.json，重新生成用 wo/work/generate_narration.py，生成后把新长度填进 demo-video.html 里的 ND。点播放后录屏即可；空格暂停、← → 快进快退、[ ] 上下章节、H 隐藏控制条、C 字幕开关。需通过 START.bat 打开（http），才能任意跳转并保持声画同步。
- NASA 图片：PIA05625（NASA/JPL/Cornell/ARC）、PIA06739（NASA/JPL）、PIA22929（NASA/JPL-Caltech/Cornell/ASU）、页面背景 PIA05859（NASA/JPL）。
- 1.2 原文件备份在 versions/1.2-before-polish。
