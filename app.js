const $=s=>document.querySelector(s), canvas=$('#stage');
let ctx=canvas.getContext('2d');
const zhScript=[
['序幕 / 等待一双手','如果你能听见，请借我一点光。','从一双手开始。','张开手掌，保持片刻，唤醒幕布上的机遇号。'],
['第一幕 / 我曾被需要','我叫机遇号。2004 年，我抵达了这片红色的土地。','张开手掌，让记忆继续。','左右移动手掌，让机遇号走过火星。张开手掌推进对白。'],
['第一幕 / 我曾被需要','他们为我准备了 90 个火星日。我却走过了十四年。','每一次移动，都是一次探索。','张开手掌继续；也可以点击下一句。'],
['第一幕 / 我曾被需要','我读过岩石里的水的痕迹，也把遥远的风景送回地球。','把手握起，让时间走入长夜。','握拳并保持，进入第二幕。'],
['第二幕 / 后来，声音停止了','2018 年，一场沙尘暴遮住了太阳。我的太阳能板等不到足够的光。','握拳，听完这段长夜。','握拳继续对白。手势触发后请先松开。'],
['第二幕 / 后来，声音停止了','6 月 10 日，是我最后一次与地球通信。此后，地球仍一次次呼唤我。','我沉默了，但他们没有立刻离开。','握拳继续对白。'],
['第二幕 / 后来，声音停止了','2019 年，任务结束了。我留下的发现，却仍在人们手中。','捏合指尖，为记忆点一束光。','用拇指和食指捏合，进入第三幕。'],
['第三幕 / 你还记得我','现在，你的手成了我的操偶杆。不是新的任务，是一次重逢。','捏合指尖，让故事被听见。','捏合继续。你点亮的是故事中的记忆，并非真正重启探测车。'],
['第三幕 / 你还记得我','原来，远方不一定要有回答。有人记得，也是一种抵达。','再点亮一次，送它回到星光里。','松开后再次捏合，完成故事。']];
let step=0,started=false,ended=false,voice=false,target=.5,x=.5,lift=0,gesture='',held='',holdSince=0,latched=false,lastAction=0,stream=null,landmarker=null,camActive=false,lastVideoTime=-1,lastDetect=0;
let language='en';
try { language=localStorage.getItem('shadow-language-v2')==='zh'?'zh':'en'; } catch {}
const translations={"交互皮影实验 / 001": "INTERACTIVE SHADOW THEATER", "作品与史实 ↗": "Story & facts ↗", "余影": "Shadows", "借你的手，": "Help Oppy", "让记忆再动一次。": "tell its story.", "一束光，一双手，一个留在火星上的探测者。": "A Mars rover has been waiting in the dark.", "走近幕布，成为机遇号故事的操偶人。": "Use your hands to bring its story to life.", "数字皮影 × 手势叙事": "Shadow puppetry × Gesture storytelling", "✦ 火星 · 子午线高原": "✦ MARS · MERIDIANI PLANUM", "OPPORTUNITY / 机遇号": "OPPORTUNITY / MARS EXPLORATION ROVER", "00 序幕": "00 Prologue", "01 初见": "01 Arrival", "02 长夜": "02 Long night", "03 回响": "03 Echoes", "YOUR HANDS, THEIR VOICE / 你的手，它的声音": "YOUR HANDS, THEIR VOICE", "张开手掌": "Open palm", "唤醒 / 第一幕": "Awaken / Act I", "握拳": "Closed fist", "进入长夜 / 第二幕": "Long night / Act II", "拇指食指捏合": "Pinch fingers", "点亮信号 / 第三幕": "Light a signal / Act III", "不是让它重新工作，而是让它再次被记住。": "The mission ended. The story lives on.", "概念原型 · 非 NASA 官方项目": "Concept prototype · Not an official NASA project", "我留在了火星。": "I stayed on Mars.", "我的故事，抵达了你。": "My story reached you.", "谢谢你，成为这一次的操偶人。": "Thank you for bringing this story to life.", "再讲一次 ↺": "Play again ↺", "重置": "Reset", "关闭 ×": "Close ×", "留在远方的，仍有回响。": "About Opportunity", "史实与虚构": "Fact & fiction", "操作与隐私": "Controls & privacy", "NASA · Opportunity 任务档案 ↗": "NASA · Opportunity mission archive ↗", "《余影》把传统皮影戏的幕布、关节与操偶杆转化为数字舞台。观众的手连接一件任务已经结束的太空设备，让“记住”成为一个亲自完成的动作。": "Shadows Left Behind transforms the screen, joints and rods of traditional shadow puppetry into a digital stage. Your hands connect with a spacecraft whose mission has ended, turning remembrance into a physical act.", "机遇号于 2004 年登陆火星，原定主要任务为 90 个火星日，实际在火星工作超过 14 年，行驶约 45.16 公里。2018 年全球性沙尘暴期间失联，最后通信日期为 2018 年 6 月 10 日；NASA 于 2019 年 2 月 13 日宣布任务结束。": "Opportunity landed on Mars in 2004 for a planned primary mission of 90 Martian days. It operated on Mars for more than 14 years and traveled about 45.16 kilometers. Its last communication was on June 10, 2018, during a planet-wide dust storm. NASA declared the mission complete on February 13, 2019.", "本作品的第一人称台词、记忆信物及手势“唤醒”均为艺术创作，不是真实通信，也不表示探测车被实际重启。“遗弃”是对比赛主题的情感回应，不代表任务团队停止关心它。": "The first-person dialogue, memory keepsakes and gesture-based awakening are artistic interpretations, not actual transmissions or a real restart of the rover. “Abandoned” is an emotional response to the competition theme; it does not mean the mission team stopped caring.", "手掌左右移动操控角色；依照每幕提示，保持手势约 1.3 秒推进。每个手势触发后先松开再做下一次。鼠标与键盘也可体验：移动鼠标操偶，空格键推进，数字 1 / 2 / 3 切换三幕。旁白使用浏览器内置语音，音色取决于系统。相机只在本机识别，不录制、不上传；模型文件已随作品保存。": "Move your palm left or right to guide the puppet. Follow each scene’s cue and hold a gesture for about 1.3 seconds. Release it before repeating. You can also move the mouse, press Space to continue, or press 1 / 2 / 3 to jump between acts. Narration uses your browser’s speech synthesis; voices depend on your system. Camera frames are processed locally, never recorded or uploaded. The recognition model is included with the project.", "跟随下方提示 · 手势保持约 1.3 秒": "Follow the cues below · Hold each gesture for ~1.3 seconds", "移动鼠标操偶 · 空格键 / 点击按钮推进": "Move the mouse to guide · Space / Next line to continue", "等待开场": "Waiting for the story", "下一句 →": "Next line →", "开始故事 →": "Begin story →", "故事已被记住": "Story complete", "当前浏览器不支持全屏。": "Fullscreen is unavailable in this browser.", "全屏舞台 ⛶": "Fullscreen ⛶", "启用相机": "Enable camera", "关闭相机": "Turn camera off", "鼠标模式 · 移动鼠标操偶": "Mouse controls", "手势模式 · 本机识别": "Hand controls", "相机尚未启用 · 画面仅在本机处理": "Camera off · Frames are processed locally", "相机已关闭 · 可以继续使用鼠标": "Camera off · You can continue with the mouse", "正在载入本地手势模型…": "Loading the local hand-tracking model…", "相机已启用 · 将整只手放入画面，依照提示保持手势": "Camera on. Keep your whole hand in view.", "相机权限被拒绝。请在浏览器地址栏允许相机，或继续鼠标体验。": "Camera permission denied. Allow access in your browser’s address bar, or continue with the mouse.", "识别中断，请重新启用相机；鼠标模式仍可使用。": "Tracking stopped. Enable the camera again, or continue with the mouse.", "请通过 localhost 打开网页，使用文件夹中的启动程序。": "Open this page through localhost using START.bat in the project folder.", "指尖捏合": "Finger pinch", "调整手势": "Adjust your gesture", "未检测到手": "No hand detected", "旁白：开": "Narration: on", "旁白：关": "Narration: off"};
const enScript=[["Prologue / Waiting for a hand", "If you can hear me, lend me a little light.", "It begins with your hands.", "Open your palm and hold it steady to awaken Opportunity on the screen."], ["Act I / When I was needed", "My name is Opportunity. In 2004, I arrived on this red world.", "Open your palm. Let memory move.", "Move your hand left and right to guide Opportunity across Mars. Open your palm to continue."], ["Act I / When I was needed", "They planned for 90 Martian days. I kept exploring for fourteen years.", "Every movement is an exploration.", "Open your palm to continue, or click Next line."], ["Act I / When I was needed", "I read traces of ancient water in the rocks, and sent distant landscapes back to Earth.", "Close your hand. Enter the long night.", "Make a fist and hold it to enter Act II."], ["Act II / Then the voices fell silent", "In 2018, a dust storm hid the Sun. My solar panels could no longer find enough light.", "Make a fist. Listen through the night.", "Make a fist to continue. Release your gesture after each line."], ["Act II / Then the voices fell silent", "June 10 was the last time I spoke to Earth. After that, they kept calling.", "I fell silent. They did not leave at once.", "Make a fist to continue."], ["Act II / Then the voices fell silent", "In 2019, my mission ended. But the discoveries I left behind stayed in human hands.", "Pinch your fingers. Light a memory.", "Bring your thumb and index finger together to enter Act III."], ["Act III / You remember me", "Now your hand is my puppet rod. This is a reunion, a moment of remembering.", "Pinch your fingers. Give the story a voice.", "Pinch to continue. You are lighting a memory in the story, not restarting the real rover."], ["Act III / You remember me", "Perhaps the distance needs no answer. To be remembered is another way of arriving.", "One more light. Send me back to the stars.", "Release, then pinch again to finish the story."]];
const t=text=>language==='en'?(translations[text]||text):text;
Object.assign(translations,{"挥手连接 / 聚光": "Wave / Hold light", "捏合扫描": "Pinch to scan", "岩石上的水的记忆": "Water in the rocks", "抓取 / 张手释放": "Grab / Open to release", "1.1 记忆剧场：开场左右挥手连接；第一幕对准岩石捏合 0.4 秒扫描；第二幕张手聚光，4 秒后自然进入长夜；第三幕捏合抓取记忆，移向地球，张手释放。鼠标可完成相同任务：左右移动、按住扫描、按住聚光、拖放记忆。空格推进对白，1 / 2 / 3 跳幕。旁白使用系统语音，音效由本机合成。相机仅本机处理，不录制、不上传。所有任务为艺术演绎，不是实际重启或真实通信。": "1.1 Memory Theater: wave left and right to connect. Aim and pinch for 0.4 seconds to scan rocks. Open your palm to hold the light; night arrives after 4 seconds. Pinch to grab memories, move to Earth, then open to release. With a mouse: wave, hold to scan, hold for light, and drag memories. Space advances dialogue; 1 / 2 / 3 jumps between acts. Narration uses system voices; effects are synthesized locally. Camera frames stay on your device and are never recorded or uploaded. These tasks are artistic interpretations, not a real restart or actual transmissions."});
Object.assign(translations,{'左右移动':'Move side to side','开到亮点继续':'Drive to the light to continue','挥手连接 · 聚光 · 释放':'Wave · Hold light · Release','拇指与食指捏合':'Pinch thumb and index finger','扫描岩石 · 抓取记忆':'Scan rocks · Grab memories','比 V 保持约 1 秒':'Hold a V sign for about 1 second','听完后继续故事':'Continue after the line'});
Object.assign(translations,{"机遇号的真实故事": "The real story of Opportunity", "一趟原计划只有 90 个火星日的旅程，走了十四年多。": "A mission planned for 90 Martian days kept going for more than fourteen years.", "2004 · 出发": "2004 · A new world", "2004 年 1 月，机遇号降落在火星。它的任务是观察岩石和土壤，寻找古代水活动的线索。在一块叫「最后机会」的岩石上，它拍下了细小的交错岩层，为曾有水流经过提供了证据。": "Opportunity landed on Mars in January 2004 to study rocks and soil for clues about ancient water. On a rock called Last Chance, it photographed fine layers at different angles, a clue that water once flowed there.", "2018 · 最后的信号": "2018 · The last signal", "2018 年，一场席卷火星的沙尘暴遮住阳光，机遇号的太阳能板能获得的能量随之下降。6 月 10 日，地球收到了它的最后一次通信。团队继续尝试联络，NASA 于 2019 年 2 月 13 日宣布任务结束。": "In 2018, a planet-wide dust storm blocked sunlight and cut the power available to Opportunity’s solar panels. Its last signal reached Earth on June 10. The team kept trying to reach it, and NASA declared the mission over on February 13, 2019.", "《余影》里的 Oppy": "Oppy in Shadows Left Behind", "在我们的皮影故事里，你可以挥开石堆、带 Oppy 寻找岩石，再把它的记忆送回地球。这些相遇是虚构的。舞台上出现的火星照片来自机遇号的真实任务档案。": "In our shadow play, you sweep away rocks, guide Oppy to clues, and carry its memories back to Earth. We imagined those encounters. The Mars photos onstage come from the real mission archive.", "NASA 机遇号任务档案 ↗": "NASA’s Opportunity mission archive ↗", "查看「最后机会」岩石的真实影像 ↗": "See the real Last Chance rock image ↗"});
const staticBindings=[];
const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
while(walker.nextNode()){const node=walker.currentNode;const key=node.nodeValue.trim();if(translations[key])staticBindings.push({node,key,before:node.nodeValue.match(/^\s*/)[0],after:node.nodeValue.match(/\s*$/)[0]});}
let script=language==='en'?enScript:zhScript;
function refreshLanguage(){
 document.documentElement.lang=language==='en'?'en':'zh-CN';
 document.title=language==='en'?'Shadows Left Behind · Interactive Shadow Theater':'余影 · Shadows Left Behind';
 staticBindings.forEach(({node,key,before,after})=>{node.nodeValue=before+t(key)+after});
 $('#language').textContent=language==='en'?'中文 / English ✓':'中文 ✓ / English';
 $('#language').setAttribute('aria-label',language==='en'?'切换到中文':'Switch to English');
 canvas.setAttribute('aria-label',language==='en'?'Opportunity interactive shadow puppet stage':'机遇号互动皮影舞台');
 $('#voice').textContent=t(voice?'旁白：开':'旁白：关');
 $('#camera').textContent=t(camActive?'关闭相机':'启用相机');
 $('#mode').textContent=t(camActive?'手势模式 · 本机识别':'鼠标模式 · 移动鼠标操偶');
 const current=$('#status').textContent;
 const statusKey=Object.keys(translations).find(key=>key===current||translations[key]===current);
 if(statusKey)$('#status').textContent=t(statusKey);
 if(camActive)$('#hand-status').textContent=t(({open:'张开手掌',fist:'握拳',pinch:'指尖捏合',other:'调整手势','':'未检测到手'})[held]||'未检测到手');
 script=language==='en'?enScript:zhScript;
 renderText();
 if(ended){$('#progress').textContent=t('故事已被记住');if('speechSynthesis'in window)speechSynthesis.cancel();}
}
$('#language').onclick=()=>{language=language==='en'?'zh':'en';try{localStorage.setItem('shadow-language-v2',language)}catch{}refreshLanguage()};
function act(){return step===0?0:step<4?1:step<7?2:3}function expected(){return step<3?'open':step<6?'fist':step===6?'pinch':step===3?'fist':'pinch'}
function speak(){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();if(voice){let u=new SpeechSynthesisUtterance(script[step][1]);u.lang=language==='en'?'en-US':'zh-CN';u.rate=.85;speechSynthesis.speak(u)}}
function renderText(){const s=script[step];$('#act-label').textContent=s[0];$('#line').textContent=s[1];$('#instruction').textContent=s[2];$('#help').textContent=s[3];$('#stage-hint').textContent=camActive?t("跟随下方提示 · 手势保持约 1.3 秒"):t("移动鼠标操偶 · 空格键 / 点击按钮推进");document.querySelectorAll('.acts span').forEach((e,i)=>e.classList.toggle('active',i===act()));$('#progress').textContent=step===0?t("等待开场"):`${String(step).padStart(2,'0')} / 09 ${language==='en'?'memory fragments':'记忆片段'}`;$('#start').textContent=started?t("下一句 →"):t("开始故事 →");speak()}
function advance(){if(ended)return;if(!started){started=true;step=1}else if(step<script.length-1)step++;else{ended=true;$('#ending').hidden=false;$('#progress').textContent=t("故事已被记住");if('speechSynthesis'in window)speechSynthesis.cancel();return}lastAction=performance.now();renderText()}
function reset(){step=0;started=false;ended=false;$('#ending').hidden=true;held='';latched=false;holdSince=0;renderText()}
$('#start').onclick=()=>{if(ended)reset();else advance()};$('#reset').onclick=reset;$('#again').onclick=reset;$('#voice').onclick=()=>{voice=!voice;$('#voice').textContent=t(voice?'旁白：开':'旁白：关');$('#voice').setAttribute('aria-pressed',voice);speak()};$('#about').onclick=()=>$('#info').showModal();$('#close').onclick=()=>$('#info').close();$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('.theater').requestFullscreen()}catch{$('#status').textContent=t("当前浏览器不支持全屏。")}};
$('#screen').addEventListener('pointermove',e=>{if(!camActive){let r=canvas.getBoundingClientRect();target=Math.max(.12,Math.min(.88,(e.clientX-r.left)/r.width));lift=Math.max(0,(.65-(e.clientY-r.top)/r.height)*.3)}});window.addEventListener('keydown',e=>{if($('#info').open||['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;if(e.code==='Space'){if(document.activeElement.tagName==='BUTTON')return;e.preventDefault();advance()}if(['1','2','3'].includes(e.key)){started=true;ended=false;$('#ending').hidden=true;step=({1:4,2:6,3:10})[e.key];renderText()}});
function poly(points,fill){ctx.fillStyle=fill;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill()}
function line(a,b,width,color){ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.lineWidth=width;ctx.strokeStyle=color;ctx.stroke()}
function circle(x,y,r,color){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()}
function rover(t,w,h,px=x*w,py=h*.64-lift*h,portrait=false){const unit=Math.min(w/1100,h/470);ctx.save();ctx.translate(px,py);ctx.scale(unit,unit);let bob=Math.sin(t*.0014)*2;ctx.translate(0,bob);const ink='#35291f',gold='#b98b4d';ctx.globalAlpha=act()===2?.7:1;
// 操偶杆和关节让机械角色保留皮影语言。
if(!portrait){line([-52,14],[-120,360],2,'#59432b88');line([31,-48],[90,360],2,'#59432b88')}
poly([[-92,-15],[65,-15],[96,12],[62,38],[-67,38],[-98,10]],ink);poly([[-86,-24],[-9,-48],[83,-22],[15,5]],ink);for(let i=0;i<5;i++)line([-70+i*28,-23-i*1],[i*22-5,-2-i*2],1,gold);line([-53,-33],[39,-6],1,gold);
for(let panel=0;panel<4;panel++){
 const offset=panel*27;
 poly([[-76+offset,-22],[-54+offset,-26],[-36+offset,-17],[-58+offset,-12]],'#55443c');
 line([-72+offset,-21],[-54+offset,-15],.75,'#d5a569');
}
line([-86,11],[58,28],1.6,'#c79557');
for(let rivet=0;rivet<5;rivet++)circle(-65+rivet*25,15+rivet*2,2,'#e0ab69');
line([2,-21],[2,-102],9,ink);line([2,-78],[25,-99],5,ink);poly([[-26,-119],[31,-119],[38,-89],[-25,-89]],ink);circle(-12,-104,7,gold);circle(19,-104,7,gold);circle(-12,-104,3,ink);circle(19,-104,3,ink);
line([50,-24],[61,-66],3,ink);ctx.beginPath();ctx.ellipse(61,-70,17,6,-.35,0,Math.PI*2);ctx.fillStyle=ink;ctx.fill();line([61,-70],[69,-83],2,ink);
for(let i=0;i<3;i++){let wx=-70+i*70;line([wx*.75,23],[wx,49],6,ink);circle(wx,53,20,ink);circle(wx,53,12,gold);circle(wx,53,6,ink);for(let j=0;j<6;j++){let a=j*Math.PI/3+t*.0003;line([wx+Math.cos(a)*7,53+Math.sin(a)*7],[wx+Math.cos(a)*16,53+Math.sin(a)*16],2,ink)}}
let armY=step===1?-50+Math.sin(t*.009)*25:4+Math.sin(t*.002)*10;line([64,22],[110,armY],6,ink);circle(63,22,5,gold);circle(110,armY,5,ink);if(step<4){circle(-12,-104,3,"#ffe9a1");circle(19,-104,3,"#ffe9a1")}ctx.restore()}
const stagePalettes=[
 ['#f0d7a2','#d7b17a','#997248','#8b674238','#74533844','#e4c48b'],
 ['#f4c397','#cf8d64','#8b5142','#a24e3d64','#713b3061','#f1ce99'],
 ['#b8a48a','#8e7a6a','#65544f','#5b555773','#4a3d406e','#b8aa99'],
 ['#c5d6cc','#8ea9a2','#586f76','#3a596660','#334b566d','#d2e4cf']
];
const backdrop=document.createElement('canvas');
const backdropContext=backdrop.getContext('2d');
const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)');
const ridges=[
 [.65,.56,.62,.51,.62,.56,.61,.49],
 [.51,.54,.57,.71,.72,.57,.53,.55],
 [.69,.61,.63,.59,.62,.58,.64,.62],
 [.71,.67,.72,.64,.68,.72,.62,.68]
];
const horizon=[0,.13,.22,.37,.54,.67,.85,1];
let backdropKey='',previousFrame=0;
function paintBackdrop(w,h,d,actIndex){
 const key=[w,h,d,actIndex].join(':');
 if(backdropKey===key){ctx.drawImage(backdrop,0,0,w,h);return}
 const [sky,mid,edge,farRidge,nearRidge,disc]=stagePalettes[actIndex];
 const glow=ctx.createRadialGradient(w*.66,h*.25,8,w*.56,h*.42,w*.78);
 glow.addColorStop(0,sky);glow.addColorStop(.52,mid);glow.addColorStop(1,edge);
 ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 const sunX=w*.81,sunY=h*.27,radius=Math.min(w,h)*.061;
 const halo=ctx.createRadialGradient(sunX,sunY,radius*.65,sunX,sunY,radius*3.1);
 halo.addColorStop(0,disc);halo.addColorStop(1,'#ffe1b000');
 ctx.fillStyle=halo;ctx.fillRect(sunX-radius*3.2,sunY-radius*3.2,radius*6.4,radius*6.4);
 // Act III draws the paper-cut Earth here instead of a sky disc.
 if(actIndex!==3)circle(sunX,sunY,radius,disc);
 for(let i=0;i<(actIndex===3?68:20);i++){
  circle(Math.abs(Math.sin(i*48.3))*w,Math.abs(Math.sin(i*26.3))*h*.48,.65+(i%5)*.2,'#fff6d380');
 }
 const far=horizon.map((fraction,index)=>[fraction*w,ridges[actIndex][index]*h]);
 poly([...far,[w,h],[0,h]],farRidge);
 const near=[[0,h*.72],[w*.19,h*.68],[w*.31,h*.73],[w*.56,h*.65],[w*.76,h*.73],[w,h*.66]];
 poly([...near,[w,h],[0,h]],nearRidge);
 ctx.save();
 ctx.beginPath();
 near.forEach(([xx,yy],i)=>i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy));
 ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.clip();
 for(let row=0;row<9;row++){
  ctx.beginPath();
  for(let col=0;col<=36;col++){
   const y=h*(.68+row*.038)+Math.sin(col*.31+row*.51)*h*.022;
   if(col===0)ctx.moveTo(0,y);else ctx.lineTo(col*w/36,y);
  }
  ctx.strokeStyle=row%2?'#ffe1ae28':'#392d2c22';
  ctx.lineWidth=1+row*.17;ctx.stroke();
 }
 ctx.restore();
 ctx.globalAlpha=.11;
 for(let i=0;i<2400;i++){
  const x=Math.abs((Math.sin(i*127.1)*43758.5453)%1)*w;
  const y=Math.abs((Math.sin(i*311.7)*951.135)%1)*h;
  ctx.fillStyle=i%2?'#fff2cb':'#322920';ctx.fillRect(x,y,1+(i%9===0?1:0),1);
 }
 ctx.globalAlpha=1;
 backdrop.width=canvas.width;backdrop.height=canvas.height;
 backdropContext.drawImage(canvas,0,0);
 backdropKey=key;
}
function draw(t){
 const r=canvas.getBoundingClientRect();
 const w=r.width,h=r.height;
 if(!w||!h){requestAnimationFrame(draw);return}
 const d=Math.min(window.devicePixelRatio||1,2.5,Math.sqrt(6000000/(w*h)));
 if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){
  canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);backdropKey='';
 }
 ctx.setTransform(d,0,0,d,0,0);
 const elapsed=previousFrame?Math.min(50,t-previousFrame):16.7;
 previousFrame=t;
 x+=((step<2?.5:target)-x)*(1-Math.exp(-elapsed/135));
 const a=act();
 paintBackdrop(w,h,d,a);
paintLamp(t,w,h,a);
paintWonder(t,w,h,a);
if(a===3&&step!==11)drawEarth(w*.85,h*.23,earthRadius(h),t,false,false);
ctx.save();ctx.translate(x*w,h*.78);ctx.scale(1,.18);circle(0,0,Math.min(w*.13,150),'#3c2d2033');ctx.restore();if(step>=2)rover(t,w,h,undefined,h*.64-lift*h-hopOffset(t)*Math.min(w/1100,h/470));
for(let i=0;i<(reduceMotion?.matches?0:a===2?82:22);i++){let px=((i*137+t*(a===2?.07:.008))%(w+100))-50,py=(i*73)%h;line([px,py],[px+(a===2?25:3),py-1],1,a===2?'#3f302124':'#fff3cc55')}
if(a===3&&!reduceMotion?.matches){for(let i=0;i<14;i++){let px=x*w+Math.sin(i*2.4+t*.0004)*w*.22,py=h*.55-((t*.025+i*29)%(h*.5));circle(px,py,2+Math.sin(t*.003+i),'#ffedaa')}ctx.strokeStyle='#fff1ac88';ctx.lineWidth=1;for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(x*w,h*.64-105,((t*.025+i*35)%110)+10,-2.3,-.6);ctx.stroke()}}
paintAtmosphere(t,w,h,a);
drawMission(t,w,h);drawOpeningRocks(t,w,h);drawBursts(t,w,h);requestAnimationFrame(draw)}requestAnimationFrame(draw);
// Celebration: paper-cut stars and confetti burst from a finished task, and Oppy hops for joy.
// Purely visual; called right after the existing success logic, never instead of it.
const bursts=[];let hopStart=-1e9;
function celebrate(nx,ny,big=false){
 const now=performance.now(),still=reduceMotion?.matches,count=still?6:big?34:18;
 const pieces=[];
 for(let k=0;k<count;k++){
  const ang=-Math.PI/2+(Math.random()-.5)*Math.PI*1.7,speed=(big?260:190)*(.55+Math.random()*.6);
  pieces.push({vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed,spin:(Math.random()-.5)*4,size:(big?9:7)*(.6+Math.random()*.7),twinkle:Math.random()*6});
 }
 bursts.push({nx,ny,start:now,pieces,big});
 if(bursts.length>8)bursts.shift();
 if(!still)hopStart=now;
 [784,988,1175,1568].slice(0,big?4:3).forEach((n,i)=>tone(n,.35,'triangle',.08+i*.07,.035));
}
function hopOffset(t){
 const k=(t-hopStart)/650;
 return k<0||k>1?0:Math.sin(k*Math.PI)*34*(1-k*.3);
}
function starPath(r){
 ctx.beginPath();
 for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr=k%2?r*.45:r;k?ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr)}
 ctx.closePath();
}
function drawBursts(t,w,h){
 for(let b=bursts.length-1;b>=0;b--){
  const burst=bursts[b],age=(t-burst.start)/1000,life=burst.big?1.6:1.2;
  if(age>life){bursts.splice(b,1);continue}
  if(age<0)continue;
  const ox=burst.nx*w,oy=burst.ny*h,fade=1-age/life;
  ctx.save();
  ctx.strokeStyle=`rgba(255,244,210,${.7*fade})`;ctx.lineWidth=3*fade+1;
  ctx.beginPath();ctx.arc(ox,oy,20+age*(burst.big?200:140),0,Math.PI*2);ctx.stroke();
  if(age<.25)glowDot(ox,oy,70*(1-age*2),'255,240,200',.6*(1-age*4));
  for(const p of burst.pieces){
   const px=ox+p.vx*age,py=oy+p.vy*age+260*age*age;
   const shine=Math.min(1,fade*1.4)*(.75+.25*Math.sin(age*18+p.twinkle));
   glowDot(px,py,p.size*3.2,'255,226,140',.55*shine);
   ctx.save();ctx.translate(px,py);ctx.rotate(p.spin*age);ctx.globalAlpha=shine;
   starPath(p.size);ctx.fillStyle='#ffe9a8';ctx.fill();
   starPath(p.size*.45);ctx.fillStyle='#fffbea';ctx.fill();
   ctx.restore();
  }
  ctx.restore();
 }
}
// 1.3 visual polish: a lamp behind the screen that follows the puppet, floating motes and a soft vignette.
// Draw-only layers; they never read or change story state.
const lampTints=['255,226,160','255,196,150','214,196,170','205,236,226'];
function paintLamp(t,w,h,a){
 const still=reduceMotion?.matches;
 const flicker=still?1:1+Math.sin(t*.0031)*.035+Math.sin(t*.0117)*.02;
 const strength=(a===2?.16:.26)*flicker;
 const cx=w*(.35+x*.3),cy=h*.42,R=Math.max(w,h)*.62;
 const g=ctx.createRadialGradient(cx,cy,0,cx,cy,R);
 g.addColorStop(0,`rgba(${lampTints[a]},${strength})`);g.addColorStop(.55,`rgba(${lampTints[a]},${strength*.35})`);g.addColorStop(1,`rgba(${lampTints[a]},0)`);
 ctx.save();ctx.globalCompositeOperation='soft-light';ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.restore();
}
// Sky decoration behind the puppet: drifting light orbs that lean toward Oppy, twinkling glints and
// shooting stars in the darker acts. Kept in the upper sky and softer than Act III's memory lights.
const orbTints=['255,236,180','255,214,170','238,214,180','190,236,240'];
function glowDot(px,py,r,rgb,alpha){
 const g=ctx.createRadialGradient(px,py,0,px,py,r);
 g.addColorStop(0,`rgba(${rgb},${alpha})`);g.addColorStop(.3,`rgba(${rgb},${alpha*.55})`);g.addColorStop(1,`rgba(${rgb},0)`);
 ctx.fillStyle=g;ctx.fillRect(px-r,py-r,r*2,r*2);
}
function paintWonder(t,w,h,a){
 if(reduceMotion?.matches)return;
 const u=Math.min(w/1100,h/470),rgb=orbTints[a],pull=x*w;
 ctx.save();ctx.globalCompositeOperation='screen';
 const count=a===3?1:a===2?4:5;
 for(let i=0;i<count;i++){
  const pos=k=>{const tt=t-k*70;
   let px=w*(.12+.76*(.5+.5*Math.sin(tt*.00011*(1+i*.23)+i*1.9)));
   const py=h*(.12+.26*(.5+.5*Math.sin(tt*.00017*(1+i*.31)+i*2.7)));
   px+=(pull-px)*.12;return [px,py]};
  const pulse=.75+.25*Math.sin(t*.0024+i*1.3),core=(a===3?14:19)*u*(1+(i%3)*.25);
  const base=a===2?.42:a===3?.45:.62;
  for(let k=6;k>=1;k--){const [px,py]=pos(k);glowDot(px,py,core*(1.6-k*.12),rgb,base*.16*(1-k/7))}
  const [px,py]=pos(0);
  glowDot(px,py,core*3.2,rgb,base*.35*pulse);
  glowDot(px,py,core*1.1,rgb,base*pulse);
  circle(px,py,Math.max(1.5,core*.18),`rgba(255,250,235,${.8*pulse})`);
 }
 for(let i=0;i<7;i++){
  const phase=(t*.00045+i*.37)%1;if(phase>.35)continue;
  const s=Math.sin(phase/.35*Math.PI),gx=w*((i*.618+.07)%1),gy=h*(.06+((i*.29)%1)*.34),len=(7+(i%3)*4)*u*s;
  ctx.strokeStyle=`rgba(255,248,225,${.85*s})`;ctx.lineWidth=1.3;
  ctx.beginPath();ctx.moveTo(gx-len,gy);ctx.lineTo(gx+len,gy);ctx.moveTo(gx,gy-len);ctx.lineTo(gx,gy+len);ctx.stroke();
  circle(gx,gy,1.6*s+.4,`rgba(255,252,240,${s})`);
 }
 if(a>=2){
  const cycle=6400,n=Math.floor(t/cycle),p=(t%cycle)/1000;
  if(p<1.1){
   const sx=w*(.2+((n*.37)%1)*.6),sy=h*(.05+((n*.53)%1)*.15),dx=w*.22,dy=h*.12,k=p/1.1;
   const hx=sx+dx*k,hy=sy+dy*k,tail=Math.min(k,.35);
   const g=ctx.createLinearGradient(hx-dx*tail,hy-dy*tail,hx,hy);
   g.addColorStop(0,'rgba(255,245,220,0)');g.addColorStop(1,`rgba(255,245,220,${.9*(1-k)})`);
   ctx.strokeStyle=g;ctx.lineWidth=2;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(hx-dx*tail,hy-dy*tail);ctx.lineTo(hx,hy);ctx.stroke();
   glowDot(hx,hy,8*u+4,'255,245,220',.9*(1-k));
  }
 }
 ctx.restore();
}
function paintAtmosphere(t,w,h,a){
 if(!reduceMotion?.matches){
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<12;i++){
   const depth=.4+(i%4)*.2,r=(6+(i*7)%14)*depth;
   const px=((i*211+t*.006*depth)%(w+80))-40,py=h*(.12+((i*53)%60)/100)+Math.sin(t*.0006+i)*12;
   const alpha=(a===2?.05:.1)*(.6+.4*Math.sin(t*.0012+i*1.7));
   const g=ctx.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,`rgba(${lampTints[a]},${alpha})`);g.addColorStop(1,`rgba(${lampTints[a]},0)`);
   ctx.fillStyle=g;ctx.fillRect(px-r,py-r,r*2,r*2);
  }
  ctx.restore();
 }
 const v=ctx.createRadialGradient(w*.5,h*.48,Math.min(w,h)*.38,w*.5,h*.5,Math.hypot(w,h)*.58);
 v.addColorStop(0,'rgba(28,18,12,0)');v.addColorStop(1,a===2?'rgba(24,16,12,.5)':'rgba(40,24,14,.38)');
 ctx.fillStyle=v;ctx.fillRect(0,0,w,h);
}
function classify(landmarks){
 const distance=(a,b)=>Math.hypot(landmarks[a].x-landmarks[b].x,landmarks[a].y-landmarks[b].y);
 const palm=distance(0,9);
 const [index,middle,ring,pinky]=[[8,6],[12,10],[16,14],[20,18]].map(([tip,joint])=>distance(tip,0)>distance(joint,0)*1.18);
 if(index&&middle&&!ring&&!pinky&&distance(8,12)>palm*.25)return 'yeah';
 const extended=[index,middle,ring,pinky].filter(Boolean).length;
 // A closed fist can bring the thumb close to the index tip too.
 // Check whether the index tip is tucked against its knuckle first.
 if(extended===0&&distance(8,5)<palm*.42)return 'fist';
 if(distance(4,8)<palm*.38)return 'pinch';
 return extended>=3?'open':extended===0?'fist':'other';
}
function handleGesture(g,now){$('#hand-status').textContent=({open:t('张开手掌'),fist:t('握拳'),pinch:t("指尖捏合"),other:t("调整手势"),'':t("未检测到手")})[g];if(g!==held){held=g;holdSince=now;latched=false}let amount=g===expected()&&!latched?Math.min((now-holdSince)/1300,1):0;$('#hold').style.width=amount*100+'%';if(amount===1&&now-lastAction>1600&&!ended){latched=true;advance()}}
let handTrackerLoading=null;
async function loadHandTracker(){
 if(landmarker)return;
 handTrackerLoading??=(async()=>{
  const {HandLandmarker,FilesetResolver}=await import('./vendor/vision_bundle.mjs');
  const files=await FilesetResolver.forVisionTasks('./vendor/wasm');
  landmarker=await HandLandmarker.createFromOptions(files,{
   baseOptions:{modelAssetPath:'./vendor/hand_landmarker.task',delegate:'CPU'},
   runningMode:'VIDEO',numHands:1,minHandDetectionConfidence:.6,minHandPresenceConfidence:.6,minTrackingConfidence:.6
  });
 })().finally(()=>{handTrackerLoading=null});
 await handTrackerLoading;
}
let handCameraX=.5,handCameraY=.5;
function detect(now){if(!camActive)return;if(photoDialog.open){requestAnimationFrame(detect);return}try{if($('#video').readyState>=2&&lastVideoTime!==$('#video').currentTime&&now-lastDetect>65){lastDetect=now;lastVideoTime=$('#video').currentTime;const result=landmarker.detectForVideo($('#video'),now);if(result.landmarks.length){let l=result.landmarks[0];handCameraX=1-l[9].x;handCameraY=l[9].y;target=Math.max(.12,Math.min(.88,1-l[9].x));lift=Math.max(0,(.65-l[9].y)*.35);handleGesture(classify(l),now)}else handleGesture('',now)}}catch(e){stopCamera();$('#status').textContent=t("识别中断，请重新启用相机；鼠标模式仍可使用。");return}requestAnimationFrame(detect)}
function stopCamera(){camActive=false;if(stream)stream.getTracks().forEach(t=>t.stop());stream=null;$('#video').srcObject=null;$('#camera').textContent=t("启用相机");$('#mode').textContent=t("鼠标模式 · 移动鼠标操偶");$('#hand-status').textContent='CAMERA OFF';$('#hold').style.width='0%';held='';latched=false;renderText()}
$('#camera').onclick=async()=>{if(camActive){stopCamera();$('#status').textContent=t("相机已关闭 · 可以继续使用鼠标");return}const button=$('#camera');button.disabled=true;$('#status').textContent=L("请在浏览器提示中允许相机，或用鼠标开始。","Allow camera access in the browser prompt, or start with the mouse.");try{if(!navigator.mediaDevices?.getUserMedia)throw Error(t("请通过 localhost 打开网页，使用文件夹中的启动程序。"));stream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:'user'},audio:false});$('#status').textContent=t("正在载入本地手势模型…");await loadHandTracker();$('#video').srcObject=stream;await $('#video').play();camActive=true;lastVideoTime=-1;lastAction=performance.now();button.textContent=t("关闭相机");$('#mode').textContent=t("手势模式 · 本机识别");$('#status').textContent=t("相机已启用 · 将整只手放入画面，依照提示保持手势");renderText();requestAnimationFrame(detect)}catch(e){if(stream)stopCamera();$('#status').textContent=e.name==='NotAllowedError'?t("相机权限被拒绝。请在浏览器地址栏允许相机，或继续鼠标体验。"):(language==='en'?`Camera unavailable: ${e.message} You can continue with the mouse.`:`相机未启动：${e.message} 可以继续使用鼠标。`)}finally{button.disabled=false}};window.addEventListener('pagehide',()=>{if(stream)stream.getTracks().forEach(t=>t.stop())});// 1.1 — interactive memory theater. The archived 1.0 remains untouched.
const L=(zh,en)=>language==='en'?en:zh;
const scenes=[
 ['序幕 / 石堆后面有什么','Prologue / Behind the rocks','挥挥手，扫开石堆！','Wave to clear the rocks!','用手影扫开石堆。','Use your hand shadow to clear the rocks.'],
 ['序幕 / 扫开石堆','Prologue / Sweep away the rocks','左右挥动，把石头扫开。','Sweep your hand from side to side.','扫开石堆，看看里面是谁。','Clear the rocks to see what’s underneath.'],
 ['序幕 / Oppy 醒来了','Prologue / Oppy wakes up','唔……我睡了好久。欸，那边有人吗？啊，你好呀！我是机遇号，叫我 Oppy 就好。',"Mmm... I've been asleep for ages. Wait, is someone there? Oh, hello! I'm Opportunity. You can call me Oppy.",'移动手掌，看看 Oppy 会不会跟着你。','Move your hand and see if Oppy follows.'],
 ['序幕 / 跟着信标','Prologue / Follow the light','把我带到亮起来的地方，我们一起去看看！',"See that glow? Take me over there. Let's have a look!",'把 Oppy 带到发光的信标。','Guide Oppy to the glowing light.'],
 ['第一幕 / 石头里的水','Act I / Clues in the Rocks','把我带到石头旁边。用拇指和食指捏住一小会儿，就能扫描啦！',"Move me next to a rock. Pinch your thumb and index finger together and hold for a moment to scan it.",'扫描三块岩石，寻找水的线索。','Scan three rocks for traces of water.'],
 ['第一幕 / 找到了','Act I / A Discovery','找到了！这里，曾经有水。他们为我准备了 90 个火星日，我却探索了十四年。',"You found it! Water once flowed here. I was supposed to work for 90 Martian days. I kept going for more than fourteen years.",'你找到了第一份记忆。','You found the first memory.'],
 ['第二幕 / 太阳还在那里吗','Act II / Is the Sun still there?','后来，2018 年，沙尘遮住了太阳。太阳还在那里，对吗？帮我留住一点光吧。',"In 2018, a dust storm blocked out the Sun. Can you help me hold on to a little light?",'张开手掌，陪它留住光。','Open your hand to keep the light on.'],
 ['第二幕 / 留住最后一点光','Act II / Hold the last light','再一点点……让我再看看这片土地。',"Just a little longer. I want one last look.",'保持光照。长夜会在 4 秒后到来。','Keep the light on for four seconds.'],
 ['第二幕 / 沉默','Act II / Silence','……','…','这一刻，陪它安静一会儿。','Stay with Oppy for a moment.'],
 ['第二幕 / 地球仍在呼唤','Act II / The Last Signal','2018 年 6 月 10 日，是我最后一次通信。2019 年，任务结束了。',"My last message reached Earth on June 10, 2018. NASA ended my mission the following year.",'声音停止，故事仍在。','The signal fell silent.'],
 ['第三幕 / 把记忆带回家','Act III / Bring the memories home','不过，你还在这里。可以帮我把这些记忆，带回地球吗？',"You're still here. Will you take my memories back to Earth?",'把三颗记忆送进右上方的地球。','Carry all three memories to Earth.'],
 ['第三幕 / 三束回响','Act III / The Memories','那是探索，那是坚持……还有，我们刚刚相遇的这一刻。',"I remember exploring, keeping going when it got hard, and meeting you.",'捏合抓起，移向地球，张手放开。','Pinch to pick up a memory. Open your hand over Earth to let it go.'],
 ['尾声 / 抵达','Epilogue / Home','我留在了火星。但这一次，我的故事，抵达了你。谢谢你，记得我。',"I'm still here on Mars. But my story made it all the way to you. Thanks for remembering me.",'让它回到星光里。','Say goodbye to Oppy.']
];
const LIGHT_DURATION_SECONDS=4;
let beaconX=.8,beaconArrival=null;
let sceneSince=performance.now(),rocks=new Set(),memories=new Set(),carrying=-1,px=.5,py=.5,mouseDown=false,waveTurns=0,waveDir=0,waveAnchor=.5,waveTime=0,pendingTimer=0,fx=true,audio=null,wind=null,windGain=null,light=1,scanSince=0,scanRock=-1,lastTick=0,silentUntil=0;
voice=true;
const hud=document.createElement('div');hud.id='mission-hud';$('#screen').append(hud);
const fxButton=document.createElement('button');fxButton.id='fx';fxButton.textContent='音效：开';$('.buttons').append(fxButton);
function unlock(){try{audio??=new AudioContext();if(audio.state==='suspended')audio.resume()}catch{}}
function tone(freq=440,duration=.15,type='sine',delay=0,gain=.07){if(!fx||!audio)return;const o=audio.createOscillator(),g=audio.createGain(),at=audio.currentTime+delay;o.type=type;o.frequency.setValueAtTime(freq,at);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(gain,at+.015);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(g).connect(audio.destination);o.start(at);o.stop(at+duration+.02)}
function chime(){[392,523.25,659.25].forEach((n,i)=>tone(n,.7,'sine',i*.15,.05))}
function windSound(){if(!audio||wind)return;let buffer=audio.createBuffer(1,audio.sampleRate*2,audio.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;wind=audio.createBufferSource();wind.buffer=buffer;wind.loop=true;const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=550;windGain=audio.createGain();windGain.gain.value=0;wind.connect(filter).connect(windGain).connect(audio.destination);wind.start()}
fxButton.onclick=()=>{unlock();fx=!fx;fxButton.textContent=L('音效：','Sound: ')+(fx?L('开','on'):L('关','off'));if(!fx&&windGain)windGain.gain.value=0;if(fx)tone(523)};
act=()=>step<4?0:step<6?1:step<10?2:3;
expected=()=>step===1?'wave':step===4||step===11?'pinch':step===7?'open':'open';
speak=()=>{if(!('speechSynthesis'in window))return;speechSynthesis.cancel();if(!voice||!started||step===1||step===8||ended)return;const text=L(scenes[step][2],scenes[step][3]);const chunks=text.match(/[^。！？.!?]+[。！？.!?]*/g)||[text];chunks.forEach((part,i)=>{const u=new SpeechSynthesisUtterance(part);u.lang=language==='en'?'en-US':'zh-CN';const voices=speechSynthesis.getVoices();const candidates=voices.filter(v=>v.lang.toLowerCase().startsWith(language==='en'?'en':'zh'));u.voice=candidates.find(v=>/natural|xiaoxiao|jenny|aria|online/i.test(v.name))||candidates[0]||null;u.rate=step<3?1.16:step>=6?1.02:1.1;u.pitch=step<3?1.22:step>=6?1.02:1.12;u.volume=.95;speechSynthesis.speak(u)})};
renderText=()=>{const s=scenes[step];$('#act-label').textContent=L(s[0],s[1]);$('#line').textContent=L(s[2],s[3]);$('#instruction').textContent=L(s[4],s[5]);$('#help').textContent=step===0?L('允许相机后左右挥手。用鼠标玩时，先点「接通信号」。','Allow camera access, then wave. For mouse controls, click Start.'):step===1?(camActive?L('相机已开启：把整只手放入画面，轻轻左右挥手。','Keep your whole hand in view and wave from side to side.'):L('真人挥手前，请先点击「启用相机」。也可在幕布里左右移动鼠标。','Turn on the camera to wave, or sweep the mouse across the stage.')):step===3?L('左右移动手掌或鼠标，把 Oppy 带到亮点，停一下。','Move your hand or mouse left or right. Stop briefly when Oppy reaches the light.'):step===4?L('对准岩石，捏合保持 0.4 秒扫描。鼠标：在岩石上按住。','Aim at a rock and hold a pinch to scan it. With a mouse, click and hold.'):step===7?L('张开手掌聚光；鼠标按住幕布聚光。无论结果如何，故事都会继续。','Open your hand to keep the light on, or click and hold on the stage.'):step===11?L('相机：捏合抓取，移向地球，再张手释放。鼠标：拖动记忆到地球。','Pinch a memory to pick it up, then open your hand over Earth. With a mouse, drag and drop.'):step===8?L('没有任务，也不需要回答。','Take a moment with Oppy.'):L('等 Oppy 说完，开到亮点继续。也可点击「继续」或按空格。','When Oppy finishes speaking, drive to the light. You can also click Continue or press Space.');$('#stage-hint').textContent=L('记忆剧场 · 互动演绎  /  1.2','MEMORY THEATER · INTERACTIVE INTERPRETATION / 1.2');document.querySelectorAll('.acts span').forEach((e,i)=>e.classList.toggle('active',i===act()));$('#progress').textContent=ended?L('故事已被记住','Story complete'):`${String(step).padStart(2,'0')} / 12`;$('#start').textContent=step===0?L('接通信号 · 开始 →','Start →'):ended?L('再讲一次 ↺','Play again ↺'):[1,3,4,7,8,11].includes(step)?L('完成舞台上的任务','Finish this activity'):L('继续 →','Continue →');$('#start').disabled=[1,3,4,7,8,11].includes(step)&&!ended;$('#voice').textContent=t(voice?'旁白：开':'旁白：关');$('#voice').setAttribute('aria-pressed',voice);fxButton.textContent=L('音效：','Sound: ')+(fx?L('开','on'):L('关','off'));speak()};
function enter(n){clearTimeout(pendingTimer);step=n;sceneSince=performance.now();scanSince=0;scanRock=-1;held='';latched=false;holdSince=sceneSince;lastAction=sceneSince;if(step===1){waveAnchor=target;waveDir=0;waveTime=sceneSince}if(step===2)chime();if(step===3){beaconX=target>.5?.2:.8;beaconArrival=null}if(step===4)rocks.clear();if(step===7){light=1;windSound()}if(step===8){silentUntil=sceneSince+2500;if(windGain)windGain.gain.value=0}if(step===11){memories.clear();carrying=-1}if(step===12)chime();renderText()}
advance=()=>{unlock();if(ended){reset();return}if([1,3,4,7,8,11].includes(step))return;if(step===12){ended=true;$('#ending').hidden=false;renderText();chime();return}started=true;enter(step+1);tone(260,.1,'triangle')};
reset=()=>{clearTimeout(pendingTimer);started=false;ended=false;$('#ending').hidden=true;rocks.clear();memories.clear();carrying=-1;mouseDown=false;light=1;if(windGain)windGain.gain.value=0;enter(0)};
$('#reset').onclick=reset;$('#again').onclick=reset;
const sweepTimes=[null,null,null];
const openingRocks=Array.from({length:21},(_,i)=>{
 const row=Math.floor(i/7),column=i%7;
 return {row,column,batch:(column+row)%3,seed:i};
});
function drawOpeningRocks(now,width,height){
 if(step>2||(step===2&&sweepTimes[2]===null))return;
 const scale=Math.max(.58,Math.min(1.35,width/820));
 for(const rock of openingRocks){
  const {row,column,batch,seed}=rock;
  const clearedAt=sweepTimes[batch];
  const time=clearedAt===null?0:Math.max(0,(now-clearedAt)/900);
  if(time>=1)continue;
  const side=column<3?-1:1;
  const rx=width*.5+(column-3)*(39-row*7)*scale+side*time*width*.24;
  const ry=height*.68-row*27*scale+time*time*height*.42-Math.sin(time*Math.PI)*18;
  const size=(19+(seed%4)*3)*scale;
  ctx.save();
  ctx.globalAlpha=1-time;
  ctx.translate(rx,ry);
  ctx.rotate(seed*.19+side*time*2);
  poly([[-size,2],[-size*.7,-size*.72],[size*.36,-size*.94],[size,-size*.15],[size*.69,size*.61],[-size*.42,size*.77]],['#644936','#785740','#8d674b'][row]);
  poly([[-size,2],[size,-size*.15],[size*.69,size*.61],[-size*.42,size*.77]],'rgba(32,20,12,.3)');
  line([-size*.7,-size*.72],[size*.36,-size*.94],1.6,'rgba(214,170,120,.75)');
  line([size*.36,-size*.94],[size,-size*.15],1.2,'rgba(214,170,120,.4)');
  line([-size*.25,-size*.35],[size*.1,size*.05],1,'rgba(40,26,16,.45)');
  ctx.restore();
 }
 if(step<2&&(!camActive||held)){
  const hx=target*width,hy=(camActive?Math.min(.8,Math.max(.24,handCameraY)):.55)*height;
  glowDot(hx,hy-12*scale,70*scale,'255,240,200',.28);
  ctx.save();
  ctx.globalAlpha=.62;
  ctx.translate(hx,hy);
  ctx.scale(scale,scale);
  ctx.rotate(waveDir*.14);
  ctx.strokeStyle='#fff3cf';ctx.lineCap='round';
  ctx.lineWidth=8;
  const fingers=[[-12,-13,-17,-32],[-5,-16,-7,-41],[3,-17,4,-44],[10,-15,15,-37]];
  for(const [x0,y0,x1,y1] of fingers){
   ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();
  }
  ctx.beginPath();ctx.moveTo(-10,1);ctx.lineTo(-25,-13);ctx.stroke();
  ctx.beginPath();ctx.ellipse(0,-3,16,19,0,0,Math.PI*2);
  ctx.fillStyle='#fff3cf';ctx.fill();
  ctx.restore();
 }
}

let rockNoise=null;
function playRockSlide(direction){
 if(!fx)return;
 if(!audio||audio.state==='suspended')unlock();
 if(!audio||audio.state!=='running')return;
 if(!rockNoise){
  rockNoise=audio.createBuffer(1,Math.ceil(audio.sampleRate*.84),audio.sampleRate);
  const samples=rockNoise.getChannelData(0);
  for(let i=0;i<samples.length;i++)samples[i]=Math.random()*2-1;
 }
 const now=audio.currentTime;
 const grit=audio.createBufferSource();
 grit.buffer=rockNoise;
 const filter=audio.createBiquadFilter();
 filter.type='bandpass';filter.frequency.value=650;filter.Q.value=.65;
 const gritGain=audio.createGain();
 gritGain.gain.setValueAtTime(.001,now);
 gritGain.gain.linearRampToValueAtTime(.18,now+.05);
 gritGain.gain.exponentialRampToValueAtTime(.001,now+.82);
 grit.connect(filter).connect(gritGain);
 if(audio.createStereoPanner){
  const pan=audio.createStereoPanner();
  pan.pan.setValueAtTime(direction*.12,now);
  pan.pan.linearRampToValueAtTime(direction*.64,now+.72);
  gritGain.connect(pan).connect(audio.destination);
 }else gritGain.connect(audio.destination);
 grit.start(now);
 for(const [delay,freq,volume] of [[.16,92,.105],[.31,66,.13],[.48,54,.11],[.64,74,.055]]){
  const impact=audio.createOscillator();
  const envelope=audio.createGain();
  const time=now+delay;
  impact.type='triangle';
  impact.frequency.setValueAtTime(freq,time);
  impact.frequency.exponentialRampToValueAtTime(freq*.62,time+.12);
  envelope.gain.setValueAtTime(.001,time);
  envelope.gain.linearRampToValueAtTime(volume,time+.008);
  envelope.gain.exponentialRampToValueAtTime(.001,time+.15);
  impact.connect(envelope).connect(audio.destination);
  impact.start(time);impact.stop(time+.16);
 }
}

function movement(pos,now){
 if(step!==1&&(step!==0||!camActive))return;
 if(now-waveTime>5000){waveDir=0;waveAnchor=pos;waveTime=now;return}
 const delta=pos-waveAnchor;
 if(Math.abs(delta)>.065){const dir=Math.sign(delta);if(dir!==waveDir){sweepTimes[waveTurns]=now;waveTurns++;waveDir=dir;waveTime=now;playRockSlide(dir)}waveAnchor=pos;if(waveTurns>=3){started=true;enter(2)}}
}
function actionPoint(down){if(step===11){if(down&&carrying<0){for(let i=0;i<3;i++)if(!memories.has(i)&&Math.hypot(px-(.23+i*.23),py-.43)<.11){carrying=i;tone(600);break}}else if(!down&&carrying>=0){if(Math.hypot(px-.85,py-.23)<.14){memories.add(carrying);chime();celebrate(.85,.23,memories.size===3)}carrying=-1;if(memories.size===3)enter(12)}}}
$('#screen').addEventListener('pointermove',e=>{if(camActive)return;const r=canvas.getBoundingClientRect();px=(e.clientX-r.left)/r.width;py=(e.clientY-r.top)/r.height;movement(px,performance.now())});
$('#screen').addEventListener('pointerdown',e=>{if(e.target.closest('button,a')||camActive)return;unlock();mouseDown=true;const r=canvas.getBoundingClientRect();px=(e.clientX-r.left)/r.width;py=(e.clientY-r.top)/r.height;$('#screen').setPointerCapture(e.pointerId);actionPoint(true)});
$('#screen').addEventListener('pointerup',()=>{if(!camActive){mouseDown=false;actionPoint(false)}});$('#screen').addEventListener('pointercancel',()=>{mouseDown=false;carrying=-1});
function dialogueCanAdvance(){
 return started&&!ended&&[2,5,6,9,10,12].includes(step);
}
function dialogueIsSpeaking(){
 return voice&&(voiceLinePlaying||Boolean(window.speechSynthesis?.speaking));
}
let routeScene=-1,routePoints=0;
function drawDialogueRoute(now,width,height){
 if(!dialogueCanAdvance()||dialogueIsSpeaking()||now-sceneSince<1300)return;
 if(routeScene!==step){
  routeScene=step;
  routePoints=step===5||step===10?2:1;
  beaconX=target>.5?.2:.8;
  beaconArrival=null;
  if(step===2&&!glowLineSaid)sayGlowLine();
 }
 drawBeacon(now,width,height);
}
handleGesture=(g,now)=>{
 px=target;py=.65-lift/.35;
 const labels={open:L('张开手掌','Open palm'),fist:L('握拳','Fist'),pinch:L('捏合','Pinch'),yeah:L('检测到手','Hand detected'),other:L('调整手势','Adjust hand'),'':L('未检测到手','No hand')};
 $('#hand-status').textContent=labels[g];
 if(ended){updateEndingHand(g,now);return}
 if(handleEvidenceGesture(g,now))return;
 if(g!==held){
  if(step===11){
   if(g==='pinch')actionPoint(true);
   else if(g==='open')actionPoint(false);
   else if(g==='')carrying=-1;
  }
  held=g;holdSince=now;latched=false;
 }
 if((step===0||step===1)&&g!==''&&g!=='fist'&&g!=='yeah')movement(target,now);
 $('#hold').style.width=step===7&&g==='open'?'100%':'0%';
};
function drawBeacon(now,width,height){
 const bx=beaconX*width,by=.64*height;
 const reached=(!camActive||Boolean(held))&&Math.abs(target-beaconX)<.075&&Math.abs(x-beaconX)<.075;
 if(!reached)beaconArrival=null;
 else beaconArrival??=now;
 const progress=beaconArrival===null?0:Math.min(1,(now-beaconArrival)/500);
 const pulse=1+Math.sin(now*.005)*.13;
 ctx.save();
 ctx.fillStyle='rgba(255,236,170,.22)';ctx.beginPath();ctx.ellipse(bx,by+30,46*pulse,9,0,0,Math.PI*2);ctx.fill();
 glowDot(bx,by,70*pulse,'255,236,170',.42);
 for(let r=0;r<8;r++){const ang=r*Math.PI/4+now*.0009,inner=17,outer=(r%2?30:40)*pulse;
  line([bx+Math.cos(ang)*inner,by+Math.sin(ang)*inner],[bx+Math.cos(ang)*outer,by+Math.sin(ang)*outer],r%2?1.5:2.5,'rgba(255,246,206,.7)')}
 for(let k=0;k<2;k++){const ph=((now*.0006)+k*.5)%1;ctx.strokeStyle=`rgba(255,240,190,${.55*(1-ph)})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(bx,by,16+ph*48,0,Math.PI*2);ctx.stroke()}
 circle(bx,by,13,'#fff1b5');circle(bx,by,7,'#fffdf2');
 ctx.strokeStyle='#fff6ce';
 ctx.lineWidth=4;ctx.lineCap='round';
 ctx.beginPath();
 ctx.arc(bx,by,28,-Math.PI/2,-Math.PI/2+Math.PI*2*(progress||1));
 ctx.stroke();
 ctx.restore();
 // a little speech bubble over every glow, so the very first one already says what to do
 // (placed beside the glow, on the side facing the middle of the stage, so the NASA photo card never covers it)
 if(!progress){const tip=L('把 Oppy 开到这里！','Take Oppy to the glow!'),tw=tip.length*(language==='en'?7.6:14)+26,side=bx>width/2?-1:1;
  const cx=bx+side*(tw/2+48)+Math.sin(now*.004)*3,cy=by;
  ctx.save();ctx.fillStyle='rgba(36,26,20,.9)';ctx.beginPath();
  if(ctx.roundRect)ctx.roundRect(cx-tw/2,cy-15,tw,30,15);else ctx.rect(cx-tw/2,cy-15,tw,30);
  ctx.fill();const ex=cx-side*tw/2;ctx.beginPath();ctx.moveTo(ex,cy-7);ctx.lineTo(ex,cy+7);ctx.lineTo(ex-side*9,cy);ctx.closePath();ctx.fill();
  ctx.font='600 13px Arial,"Microsoft YaHei",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff1cf';ctx.fillText(tip,cx,cy+1);ctx.restore()}
 const isRoute=step!==3;
 hud.textContent=isRoute
  ?(routePoints>1?L('沿着亮点前进 · 还剩 '+routePoints+' 个','FOLLOW THE LIGHTS · '+routePoints+' LEFT'):L('把 Oppy 开到亮点继续','DRIVE OPPY TO THE LIGHT'))
  :L('把 Oppy 带到信标','GUIDE OPPY TO THE LIGHT');
 if(progress===1){
  chime();celebrate(beaconX,.64,false);
  if(!isRoute){enter(4);return}
  routePoints--;
  if(routePoints===0){advance();return}
  beaconX=beaconX>.5?.2:.8;
  beaconArrival=null;
 }
}

function drawWaterTraces(x,y,now){
 ctx.save();
 glowDot(x,y-6,46,'142,234,255',.45);
 for(const [width,color] of [[5,'rgba(142,234,255,.35)'],[2,'#c9f6ff']]){
  ctx.lineWidth=width;ctx.strokeStyle=color;ctx.lineCap='round';
  for(let row=0;row<3;row++){
   ctx.beginPath();
   for(let offset=-21;offset<=21;offset++){
    const ripple=y-11+row*8+Math.sin(offset*.25-now*.007+row)*2;
    if(offset===-21)ctx.moveTo(x+offset,ripple);
    else ctx.lineTo(x+offset,ripple);
   }
   ctx.stroke();
  }
 }
 for(let d=0;d<4;d++){const ph=((now*.0007)+d*.25)%1;circle(x-15+d*10,y-14-ph*26,2.4*(1-ph)+.5,`rgba(201,246,255,${1-ph})`)}
 ctx.restore();
}
// Act I rock: faceted, layered like the real Last Chance outcrop. Hit area is unchanged.
function drawRock(rx,ry,i,done,now){
 ctx.save();
 ctx.fillStyle='rgba(40,24,14,.28)';ctx.beginPath();ctx.ellipse(rx,ry+14,38,7,0,0,Math.PI*2);ctx.fill();
 if(done)glowDot(rx,ry-4,62,'142,234,255',.38);
 const v=[[-2,1],[2,-2],[0,2]][i];
 poly([[rx-25,ry+12],[rx-31+v[0],ry-8],[rx-8,ry-25+v[1]],[rx+22,ry-16],[rx+31,ry+12]],done?'#4f6f6c':'#5e4330');
 poly([[rx-31+v[0],ry-8],[rx-8,ry-25+v[1]],[rx+22,ry-16],[rx+6,ry-5],[rx-17,ry-2]],done?'#6f9993':'#86613f');
 poly([[rx+22,ry-16],[rx+31,ry+12],[rx+8,ry+12],[rx+6,ry-5]],done?'#3d5654':'#4a3424');
 for(let s=0;s<3;s++)line([rx-26,ry+1+s*4],[rx+27,ry-3+s*5],1,done?'rgba(201,246,255,.35)':'rgba(190,150,105,.45)');
 line([rx-31+v[0],ry-8],[rx-8,ry-25+v[1]],1.6,done?'rgba(220,250,255,.8)':'rgba(230,186,130,.85)');
 line([rx-8,ry-25+v[1]],[rx+22,ry-16],1.2,done?'rgba(220,250,255,.5)':'rgba(230,186,130,.5)');
 if(!done){
  const tw=(Math.sin(now*.004+i*2.1)+1)/2,sx=rx+20,sy=ry-30,len=4+tw*6;
  line([sx-len,sy],[sx+len,sy],1.4,`rgba(255,248,220,${.3+tw*.7})`);line([sx,sy-len],[sx,sy+len],1.4,`rgba(255,248,220,${.3+tw*.7})`);
 }
 circle(rx,ry+32,10,done?'#2f8f9d':'#2a1d15d9');
 ctx.fillStyle=done?'#ffffff':'#f6e2b8';ctx.font='bold 11px Arial';ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.fillText(done?'✓':String(i+1),rx,ry+32.5);ctx.textBaseline='alphabetic';
 ctx.restore();
}
function drawScanRing(cx,cy,progress,now){
 glowDot(cx,cy,52,'252,240,194',.28);
 ctx.save();ctx.lineCap='round';
 ctx.strokeStyle='rgba(252,240,194,.35)';ctx.lineWidth=1.5;ctx.setLineDash([4,7]);ctx.lineDashOffset=-now*.03;
 ctx.beginPath();ctx.arc(cx,cy,44,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
 ctx.strokeStyle='#fcf0c2';ctx.lineWidth=4;
 ctx.beginPath();ctx.arc(cx,cy,37,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(progress,1));ctx.stroke();
 ctx.restore();
}
// Act III Earth as a paper-cut shadow puppet: flat colour layers, ink outline and its own rod.
const earthRadius=h=>Math.max(24,Math.min(40,h*.065));
const earthLand=[
 [[-.55,-.55],[-.2,-.62],[-.05,-.38],[-.22,-.18],[-.12,.05],[-.38,.12],[-.5,-.12],[-.68,-.25]],
 [[.15,-.2],[.42,-.3],[.55,-.05],[.4,.25],[.22,.55],[.08,.3],[.12,.02]],
 [[-.45,.4],[-.15,.35],[-.05,.55],[-.3,.68]]
];
function drawEarth(cx,cy,R,now,active,ring=true){
 glowDot(cx,cy,R*2,'236,244,226',active?.4:.26);
 ctx.save();
 line([cx+R*.15,cy+R*.95],[cx+R*1.1,cy+R*7],1.6,'#3a4a4a66');
 circle(cx+R*.15,cy+R*.95,2.5,'#c9a46a');
 ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.clip();
 ctx.fillStyle='#35667c';ctx.fillRect(cx-R,cy-R,R*2,R*2);
 circle(cx-R*.12,cy-R*.12,R*.92,'#5d9ab0');
 const span=R*2.6,shift=(now*R*.00012)%span;
 for(const copy of [-span,0,span]){
  for(const shape of earthLand)poly(shape.map(([px,py])=>[cx+px*R+shift+copy,cy+py*R]),'#b5c99a');
 }
 const cshift=(now*R*.0002)%span;
 for(const copy of [-span,0,span]){
  for(const [ox,oy,len] of [[-.7,-.75,.55],[.05,-.42,.5],[-.35,.2,.45],[.3,.72,.5]]){
   const x0=cx+ox*R+cshift+copy,y0=cy+oy*R;
   poly([[x0,y0],[x0+len*R*.3,y0-R*.07],[x0+len*R,y0-R*.03],[x0+len*R*.85,y0+R*.05],[x0+len*R*.15,y0+R*.05]],'rgba(243,236,218,.85)');
  }
 }
 poly([[cx+R*.35,cy-R],[cx+R,cy-R],[cx+R,cy+R],[cx-R*.2,cy+R],[cx+R*.55,cy+R*.25]],'rgba(28,48,62,.32)');
 ctx.restore();
 ctx.save();
 ctx.strokeStyle='#2b2620';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();
 ctx.strokeStyle='rgba(233,207,152,.85)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,R+3,0,Math.PI*2);ctx.stroke();
 if(ring){
  ctx.strokeStyle=active?'rgba(251,226,170,.95)':'rgba(251,226,170,.6)';ctx.lineWidth=active?2:1.4;ctx.setLineDash([6,8]);ctx.lineDashOffset=-now*.02;
  ctx.beginPath();ctx.arc(cx,cy,R*1.5+(active?Math.sin(now*.008)*3:0),0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
 }
 ctx.restore();
}
const memoryTints=['255,214,120','255,176,110','255,160,170'];
function drawMemory(mx,my,i,now,held,label){
 const tint=memoryTints[i],grow=(held?1.2:1)*(1+Math.sin(now*.003+i*2)*.05);
 glowDot(mx,my,38*grow,tint,.5);
 ctx.save();
 drawMemoryIcon(mx,my-2,i,now,grow*1.25);
 const width=label.length*6.4+16;
 ctx.fillStyle='rgba(42,29,21,.82)';ctx.beginPath();
 if(ctx.roundRect)ctx.roundRect(mx-width/2,my+25,width,17,8);else ctx.rect(mx-width/2,my+25,width,17);
 ctx.fill();
 ctx.font='bold 10px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff1cf';ctx.fillText(label,mx,my+34);ctx.textBaseline='alphabetic';
 ctx.restore();
}
// Paper-cut keepsakes for the three memories: a water-marked rock (explore), the sun held through the
// storm (persist) and an open hand (meeting you). Ink outline first, then the cut-paper fill.
function drawMemoryIcon(mx,my,i,now,s){
 const ink='#2b2620';
 ctx.save();ctx.translate(mx,my);ctx.scale(s,s);ctx.rotate(Math.sin(now*.0018+i)*.08);ctx.lineJoin='round';ctx.lineCap='round';
 if(i===0){
  const rock=[[-15,8],[-17,-3],[-6,-13],[10,-10],[17,1],[13,9]];
  ctx.beginPath();rock.forEach(([px,py],k)=>k?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();
  ctx.lineWidth=4;ctx.strokeStyle=ink;ctx.stroke();ctx.fillStyle='#c79a68';ctx.fill();
  poly([[-17,-3],[-6,-13],[10,-10],[2,-4],[-9,-2]],'#e0b884');
  for(let r=0;r<2;r++){ctx.beginPath();for(let k=-11;k<=12;k++){const yy=1+r*4+Math.sin(k*.45-now*.006+r)*1.2;k===-11?ctx.moveTo(k,yy):ctx.lineTo(k,yy)}ctx.lineWidth=1.8;ctx.strokeStyle='#7fe0f5';ctx.stroke()}
 }else if(i===1){
  ctx.rotate(now*.0006);
  const rays=[];for(let k=0;k<16;k++){const a=k*Math.PI/8,r=k%2?9:17;rays.push([Math.cos(a)*r,Math.sin(a)*r])}
  ctx.beginPath();rays.forEach(([px,py],k)=>k?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();
  ctx.lineWidth=3.5;ctx.strokeStyle=ink;ctx.stroke();ctx.fillStyle='#f3b25e';ctx.fill();
  ctx.beginPath();ctx.arc(0,0,8,0,Math.PI*2);ctx.fillStyle='#ffe3a3';ctx.fill();ctx.lineWidth=1.5;ctx.stroke();
  circle(-2.5,-2.5,2.2,'#fff7e2');
 }else{
  const fingers=[[-7,-4,-10,-15],[-2,-6,-3,-18],[3,-6,4,-18],[8,-4,10,-14]];
  for(const [width,color] of [[7.5,ink],[4.5,'#ffd9cf']]){
   ctx.strokeStyle=color;ctx.lineWidth=width;
   for(const [x0,y0,x1,y1] of fingers){ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke()}
   ctx.beginPath();ctx.moveTo(-8,4);ctx.lineTo(-16,-3);ctx.stroke();
   ctx.beginPath();ctx.ellipse(0,3,width===7.5?11.5:10,width===7.5?10.5:9,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
  }
  ctx.fillStyle='#f28b9a';ctx.beginPath();ctx.moveTo(0,8);ctx.bezierCurveTo(-6,3,-4,-2,0,1);ctx.bezierCurveTo(4,-2,6,3,0,8);ctx.fill();
 }
 ctx.restore();
}
function drawCursor(cx,cy,pressed,now){
 glowDot(cx,cy,pressed?26:34,'255,246,208',.35);
 ctx.save();ctx.strokeStyle='#fff6d0';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,pressed?11:18+Math.sin(now*.006)*1.5,0,Math.PI*2);ctx.stroke();
 circle(cx,cy,3,'#fff6d0');ctx.restore();
}
function drawMission(now,w,h){let dt=Math.min((now-lastTick)/1000,.1);lastTick=now;const input=camActive?held==='pinch':mouseDown;
 ctx.save();
 if(step===0||step===1){hud.textContent=(camActive?(held?L('已看到你的手 · ','Hand detected · '):L('👋 举手左右挥动 · ','👋 Wave side to side · ')):L('相机未开启 · 鼠标模式 · ','Camera off · Mouse mode · '))+`${Math.min(waveTurns,3)} / 3`;}
 else if(step===3)drawBeacon(now,w,h);
 else if(step===4){for(let i=0;i<3;i++){let rx=(.23+i*.23)*w,ry=h*.48;drawRock(rx,ry,i,rocks.has(i),now);if(rocks.has(i)&&i===1)drawWaterTraces(rx,ry,now)}let hit=[0,1,2].find(i=>!rocks.has(i)&&Math.hypot(px-(.23+i*.23),py-.48)<.105);if(input&&hit!==undefined){if(scanRock!==hit){scanRock=hit;scanSince=now;tone(240,.1,'triangle')}let progress=(now-scanSince)/800;drawScanRing((.23+hit*.23)*w,h*.48,progress,now);if(progress>=1){rocks.add(hit);tone(750,.6);celebrate(.23+hit*.23,.45,rocks.size===3);scanSince=0;scanRock=-1;if(rocks.size===3)showEvidence()}}else{scanSince=0;scanRock=-1}hud.textContent=L(`寻找水的记忆 · ${rocks.size} / 3`,`ROCKS SCANNED · ${rocks.size} / 3`)}
 else if(step===7){let elapsed=(now-sceneSince)/1000,lit=camActive?held==='open':mouseDown;light=Math.max(.03,1-elapsed/(LIGHT_DURATION_SECONDS+1)+(lit?.13:0));ctx.fillStyle=`rgba(31,25,23,${Math.min(.72,elapsed/(LIGHT_DURATION_SECONDS+3))})`;ctx.fillRect(0,0,w,h);if(lit){const glow=ctx.createRadialGradient(w*.5,h*.32,0,w*.5,h*.32,h*.55);glow.addColorStop(0,'#ffeab455');glow.addColorStop(1,'#ffeab400');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h)}if(windGain)windGain.gain.setTargetAtTime(fx?Math.min(.13,elapsed*.018):0,audio.currentTime,.3);hud.textContent=L(`留住光 · ${Math.max(0,LIGHT_DURATION_SECONDS-Math.floor(elapsed))} 秒`,`HOLD THE LIGHT · ${Math.max(0,LIGHT_DURATION_SECONDS-Math.floor(elapsed))} s`);if(elapsed>=LIGHT_DURATION_SECONDS)enter(8)}
 else if(step===8){hud.textContent=L('信号静默','SIGNAL SILENT');ctx.fillStyle='#221d1966';ctx.fillRect(0,0,w,h);if(now>=silentUntil)enter(9)}
 else if(step===11){drawEarth(w*.85,h*.23,earthRadius(h),now,carrying>=0);for(let i=0;i<3;i++)if(!memories.has(i)){let sx=carrying===i?px:.23+i*.23,sy=carrying===i?py:.43;drawMemory(sx*w,sy*h,i,now,carrying===i,L(['探索','坚持','相遇'][i],['Explore','Persist','Meet'][i]))}hud.textContent=L(`送往地球 · ${memories.size} / 3`,`MEMORIES TO EARTH · ${memories.size} / 3`)}
 else hud.textContent=step===0?L('👋 左右挥手，扫开石堆','👋 WAVE SIDE TO SIDE TO CLEAR THE ROCKS'):L('与你连接中','CONNECTED TO OPPY');
 if([4,11].includes(step))drawCursor(px*w,py*h,input,now);
 ctx.restore();}
// A small servo response; reduced-motion users retain all mission controls.
window.addEventListener('pagehide',()=>{if(audio)audio.close();clearTimeout(pendingTimer)});
document.addEventListener('visibilitychange',()=>{if(document.hidden){mouseDown=false;if(windGain)windGain.gain.value=0;if('speechSynthesis'in window)speechSynthesis.cancel()}else if(step===7){sceneSince=performance.now();}});

// Local neural voice clips replace browser reading; system speech remains a fallback.
const voicePlayer=new Audio();
voicePlayer.preload='auto';
let voiceEpoch=0,voiceDelay=0,voiceLinePlaying=false,glowLineSaid=false;
// When the very first glow appears (after Oppy wakes up), Oppy says the "See that glow?" line right away.
// It plays on its own player so the glow stays visible while Oppy talks.
const glowPlayer=new Audio();
async function sayGlowLine(){glowLineSaid=true;
 $('#line').textContent=L(scenes[3][2],scenes[3][3]);
 if(!voice)return;const data=await recordedVoice;const clip=data?.[language]?.['3']?.[0];if(!clip)return;
 glowPlayer.src=clip.src;glowPlayer.volume=.95;glowPlayer.playbackRate=1.16;glowPlayer.preservesPitch=true;glowPlayer.play().catch(()=>{})}
const recordedVoice=fetch('./audio/oppy/manifest.json?v=rock-sound').then(r=>{if(!r.ok)throw Error('Voice manifest unavailable');return r.json()}).catch(()=>null);
function stopVoice(){voiceLinePlaying=false;voiceEpoch++;clearTimeout(voiceDelay);voicePlayer.pause();voicePlayer.onended=null;voicePlayer.onerror=null;if('speechSynthesis'in window)speechSynthesis.cancel()}
speak=async()=>{
 stopVoice();
 if(step<2)glowLineSaid=false;
 if(!voice||!started||ended||step===1||step===8)return;
 if(step===3&&glowLineSaid)return;   // Oppy already said "See that glow?" when the first glow appeared
 voiceLinePlaying=true;
 const epoch=voiceEpoch,scene=step,lang=language;
 const data=await recordedVoice;
 if(epoch!==voiceEpoch)return;
 const clips=data?.[lang]?.[String(scene)];
 if(!clips?.length){voiceLinePlaying=false;return}
 let index=0;
 function playNext(){
  if(epoch!==voiceEpoch||!voice||ended)return;
  const clip=clips[index];if(!clip)return;
  voicePlayer.src=clip.src;voicePlayer.volume=.95;voicePlayer.playbackRate=1.16;
  voicePlayer.preservesPitch=true;
  voicePlayer.onended=()=>{if(epoch!==voiceEpoch)return;index++;if(index===clips.length){voiceLinePlaying=false;return}voiceDelay=setTimeout(playNext,clip.pause*.55)};
  voicePlayer.onerror=()=>{if(epoch===voiceEpoch&&voiceLinePlaying){voiceLinePlaying=false;}};
  voicePlayer.play().catch(()=>{if(epoch===voiceEpoch&&voiceLinePlaying){voiceLinePlaying=false;}});
 }
 if(scene===2&&sweepTimes[2]!==null){
  const remaining=Math.max(0,900-(performance.now()-sweepTimes[2]));
  voiceDelay=setTimeout(playNext,remaining);
 }else playNext();
};
$('#voice').onclick=()=>{voice=!voice;$('#voice').textContent=L('角色配音：','Character voice: ')+(voice?L('开','on'):L('关','off'));$('#voice').setAttribute('aria-pressed',voice);speak()};
const renderWithVoice=renderText;
renderText=()=>{renderWithVoice();$('#voice').textContent=L('角色配音：','Character voice: ')+(voice?L('开','on'):L('关','off'))};
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopVoice()});
window.addEventListener('pagehide',stopVoice);
refreshLanguage();
const photoDialog=$('#photo-dialog');
const photoVideo=$('#photo-video');
const photoResult=$('#photo-result');
const photoEnvelope=$('#photo-envelope');
const oppyLetter=$('#oppy-letter');
let photoPreviewFrame=0;
const photoHandCursor=$('#photo-hand-cursor');
const takePhotoButton=$('#photo-take');
let photoLastFrame=-1,photoLastDetect=0;
const photoOpenButton=$('#photo-open');
const endingHandHint=$('#ending-hand-hint');
const PHOTO_DWELL_MS=1000;
const photoAim={cursor:photoHandCursor,button:takePhotoButton,since:null};
const endingAim={cursor:$('#ending-hand-cursor'),button:photoOpenButton,since:null,activated:false};
function hideDwell(aim){
 aim.cursor.hidden=true;
 aim.button.classList.remove('hand-aim');
 aim.since=null;
}
function aimAtPhotoButton(aim,container,x,y,now){
 const area=container.getBoundingClientRect();
 const map=value=>Math.max(.01,Math.min(.99,(value-.12)/.76));
 const left=area.left+map(x)*area.width;
 const top=area.top+map(y)*area.height;
 aim.cursor.hidden=false;
 aim.cursor.style.left=left+'px';
 aim.cursor.style.top=top+'px';
 const button=aim.button.getBoundingClientRect();
 const aimed=!aim.button.hidden&&!aim.button.disabled&&left>=button.left&&left<=button.right&&top>=button.top&&top<=button.bottom;
 aim.button.classList.toggle('hand-aim',aimed);
 if(!aimed){aim.since=null;aim.activated=false}
 else if(!aim.activated)aim.since??=now;
 const progress=aim.since===null?0:Math.min(1,(now-aim.since)/PHOTO_DWELL_MS);
 aim.cursor.style.background='conic-gradient(#a3efff '+Math.round(progress*360)+'deg,#166280bb 0deg)';
 if(progress===1&&!aim.activated){
  aim.activated=true;
  aim.button.click();
 }
}
function updateEndingHand(gesture,now){
 if(!gesture||photoDialog.open){hideDwell(endingAim);return}
 aimAtPhotoButton(endingAim,$('#ending'),handCameraX,handCameraY,now);
}
function hidePhotoHand(){
 hideDwell(photoAim);
 photoAim.activated=false;
}
function updatePhotoHand(now){
 if(!landmarker||photoVideo.readyState<2||now-photoLastDetect<65||photoLastFrame===photoVideo.currentTime)return;
 photoLastDetect=now;
 photoLastFrame=photoVideo.currentTime;
 let hand;
 try{hand=landmarker.detectForVideo(photoVideo,now).landmarks[0]}
 catch{hidePhotoHand();return}
 if(!hand){hidePhotoHand();return}
 aimAtPhotoButton(photoAim,photoDialog,1-hand[9].x,hand[9].y,now);
}
let photoTaken=false;
function clearPhotoLetter(){
 photoTaken=false;
 photoEnvelope.hidden=true;
 photoEnvelope.setAttribute('aria-expanded','false');
 oppyLetter.hidden=true;
 photoResult.hidden=true;
 $('#photo-save').hidden=true;
}
let photoStream=null;
let photoRequest=0;

function labelPhoto(){
 const title=L('和 Oppy 合照','Take a photo with Oppy');
 $('#photo-open').textContent=title;
 $('#photo-title').textContent=title;
 $('#photo-note').textContent=L('照片只在本机生成，点「下载照片」才会保存。','The photo stays on this device. Click Download photo to keep a copy.');
 $('#photo-camera').textContent=L('开启相机','Enable camera');
 $('#photo-take').textContent=photoTaken?L('重拍','Retake'):L('拍照','Take photo');
 $('#photo-save').textContent=L('下载照片','Download photo');
 $('#photo-close').textContent=L('关闭','Close');
 endingHandHint.textContent=L('把手停在合照按钮上 1 秒。','Hold your hand over the photo button for one second.');
 $('#envelope-label').textContent=L('打开 Oppy 寄来的信','Open your letter from Oppy');
 $('#letter-greeting').textContent=L('给陪我走过火星的你：','Dear friend,');
 $('#letter-body').textContent=L(
  '谢谢你陪我走了这一段。你帮我在石头里找到水留下的痕迹，也在天暗下来时陪我等了一会儿。我的轮子留在火星，但今天，你把我的故事带回了地球。下次抬头看星星的时候，记得我们一起走过的这段路。',
  'Thank you for spending a little time on Mars with me. You helped me find the traces water left in the rocks, and you stayed with me when the sky went dark. My wheels are still here on Mars, but today you carried my story back to Earth. Next time you look up at the stars, remember our little drive together.'
 );
 $('#letter-signature').textContent=L('来自火星的朋友，Oppy','Your friend on Mars, Oppy');
}

function drawPhotoPanel(context,source,sw,sh,left,top,width,height,mirror=false){
 const ratio=Math.max(width/sw,height/sh);
 const cropWidth=width/ratio,cropHeight=height/ratio;
 context.save();
 if(mirror){context.translate(left*2+width,0);context.scale(-1,1)}
 context.drawImage(source,(sw-cropWidth)/2,(sh-cropHeight)/2,cropWidth,cropHeight,left,top,width,height);
 context.restore();
}

function paintTogether(destination,now){
 if(photoVideo.readyState<2||!photoVideo.videoWidth||!photoVideo.videoHeight)return false;
 const context=destination.getContext('2d');
 const {width,height}=destination;
 const frame=Math.round(width*.025);
 const photoHeight=height-frame*2;
 context.fillStyle='#ead8ad';context.fillRect(0,0,width,height);
 drawPhotoPanel(context,photoVideo,photoVideo.videoWidth,photoVideo.videoHeight,frame,frame,width-frame*2,photoHeight,true);
 const before=ctx;
 ctx=context;
 try{
  const roverX=width*.8,roverY=height*.74;
  const shadow=context.createRadialGradient(roverX,height*.85,0,roverX,height*.85,width*.13);
  shadow.addColorStop(0,'#130b0770');shadow.addColorStop(1,'#130b0700');
  context.fillStyle=shadow;context.fillRect(width*.65,height*.79,width*.3,height*.16);
  rover(now,width*1.15,height*1.05,roverX,roverY,true);
 }finally{ctx=before}
 context.fillStyle='#2d2219';
 context.font='bold '+Math.round(width*.016)+'px Georgia, serif';
 context.fillText(L('余影 · 我和 Oppy','SHADOWS LEFT BEHIND · OPPY & ME'),frame,height-frame*.24);
 return true;
}
function showPhotoPreview(){
 cancelAnimationFrame(photoPreviewFrame);
 hidePhotoHand();
 photoLastFrame=-1;
 $('#photo-live').hidden=false;
 $('#photo-camera').hidden=true;
 $('#photo-take').hidden=false;
 $('#photo-status').textContent=L('站在左边给 Oppy 留位置。把手停在「拍照」上 1 秒。','Stand on the left to leave room for Oppy. Hold your hand over Take photo for one second.');
 const portrait=$('#photo-stage');
 function frame(now){
  if(!photoDialog.open||$('#photo-live').hidden)return;
  paintTogether(portrait,now);
  updatePhotoHand(now);
  if(!$('#photo-live').hidden)photoPreviewFrame=requestAnimationFrame(frame);
 }
 photoPreviewFrame=requestAnimationFrame(frame);
}

async function startPhotoCamera(useStoryCamera){
 const request=++photoRequest;
 const button=$('#photo-camera');
 button.disabled=true;
 $('#photo-status').textContent=L('正在开启相机…','Starting camera…');
 try{
  const input=useStoryCamera?stream:await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
  if(request!==photoRequest||!photoDialog.open){
   if(!useStoryCamera)input.getTracks().forEach(track=>track.stop());
   return;
  }
  if(!useStoryCamera)photoStream=input;
  photoVideo.srcObject=input;
  await photoVideo.play();
  if(request===photoRequest&&photoDialog.open){
   showPhotoPreview();
   loadHandTracker().catch(()=>{
    if(request===photoRequest&&photoDialog.open&&!photoTaken){
     $('#photo-status').textContent=L('手势暂不可用，可以点击「拍照」。','Hand tracking is unavailable. Click Take photo to capture.');
    }
   });
  }
 }catch{
  if(request!==photoRequest)return;
  photoStream?.getTracks().forEach(track=>track.stop());
  photoStream=null;
  photoVideo.srcObject=null;
  $('#photo-status').textContent=L('无法开启相机。请检查浏览器的相机权限后重试。','Camera unavailable. Check browser camera permissions and try again.');
 }finally{
  if(request===photoRequest)button.disabled=false;
 }
}

$('#photo-open').onclick=()=>{
 hideDwell(endingAim);
 $('#photo-camera').hidden=false;
 $('#photo-camera').disabled=false;
 $('#photo-live').hidden=true;
 $('#photo-take').hidden=true;
 $('#photo-save').hidden=true;
 clearPhotoLetter();
 $('#photo-status').textContent='';
 labelPhoto();
 photoDialog.showModal();
 void startPhotoCamera(Boolean(stream?.active));
};
$('#photo-camera').onclick=()=>startPhotoCamera(false);
$('#photo-close').onclick=()=>photoDialog.close();
photoDialog.addEventListener('close',()=>{
 photoRequest++;
 cancelAnimationFrame(photoPreviewFrame);
 hidePhotoHand();
 clearPhotoLetter();
 photoVideo.srcObject=null;
 photoStream?.getTracks().forEach(track=>track.stop());
 photoStream=null;
 photoResult.width=photoResult.width;
});
$('#photo-take').onclick=()=>{
 if(photoTaken){
  clearPhotoLetter();
  labelPhoto();
  showPhotoPreview();
  return;
 }
 if(!paintTogether(photoResult,performance.now())){
  $('#photo-status').textContent=L('画面还没准备好，请稍等再拍。','The camera is still getting ready. Try again in a moment.');
  return;
 }
 photoTaken=true;
 cancelAnimationFrame(photoPreviewFrame);
 hidePhotoHand();
 $('#photo-live').hidden=true;
 photoEnvelope.hidden=false;
 $('#photo-status').textContent=L('你收到了一封来自火星的信。','A letter from Mars just arrived.');
 labelPhoto();
 photoEnvelope.focus();
};
photoEnvelope.onclick=()=>{
 if(!photoTaken)return;
 photoEnvelope.setAttribute('aria-expanded','true');
 photoEnvelope.hidden=true;
 oppyLetter.hidden=false;
 photoResult.hidden=false;
 $('#photo-save').hidden=false;
 $('#photo-status').textContent='';
};
$('#photo-save').onclick=()=>{
 const link=document.createElement('a');
 link.download='oppy-and-me.png';
 link.href=photoResult.toDataURL('image/png');
 link.click();
};
$('#language').addEventListener('click',labelPhoto);
labelPhoto();

const coach=$('#gesture-coach');
const coachHand=$('#coach-hand');
const coachText=$('#coach-text');
let lastCoachKey='',coachUntil=0;
const COACH_DURATION_MS=2100;
function showGestureCoach(){
 let motion='',icon='',instruction='';
 if(step===0||step===1){
  motion='wave';icon='✋';
  instruction=L('举起手，挥一挥，把石堆扫开！','Wave from side to side to clear the rocks!');
  const hint=step===0
   ?(camActive?L('手掌朝向镜头，左右挥动','Face your palm toward the camera and wave side to side'):L('允许相机后挥手，或点击下方按钮开始','Allow camera access, or click Start to use the mouse'))
   :camActive
    ?L('手掌朝向镜头，左右挥动','Face your palm toward the camera and wave side to side')
    :L('点「启用相机」，或在舞台内左右移动鼠标','Enable the camera, or move the mouse side to side onstage');
  $('#coach-hint').textContent=hint;
 }else if(step===4&&rocks.size<3){
  motion='pinch';icon='👌';
  instruction=camActive?L('移到岩石上，捏合并保持','Aim at a rock, pinch and hold'):L('在岩石上按住鼠标','Press and hold on a rock');
 }else if(step===7){
  motion='light';icon='✋';
  instruction=camActive?L('张开手掌，留住光','Open your palm to hold the light'):L('按住舞台，留住光','Hold down on the stage to keep the light');
 }else if(step===11){
  motion=carrying<0?'pinch':'carry';icon=carrying<0?'👌':'✋';
  instruction=camActive?(carrying<0?L('捏住一个记忆','Pinch a memory to pick it up'):L('移到地球，再张手放开','Move to Earth, then open your hand')):(carrying<0?L('按住一个记忆','Press and hold a memory'):L('拖到地球，再松开','Drag to Earth, then release'));
 }
 const now=performance.now();
 const key=motion?step+'-'+motion:'';
 if(key&&key!==lastCoachKey){
  lastCoachKey=key;
  coachUntil=now+COACH_DURATION_MS;

 }
 coach.hidden=!motion||ended||now>=coachUntil;
 $('#coach-hint').hidden=motion!=='wave';
 if(coach.hidden)return;
 if(coach.dataset.motion!==motion)coach.dataset.motion=motion;
 if(coachHand.textContent!==icon)coachHand.textContent=icon;
 if(coachText.textContent!==instruction)coachText.textContent=instruction;
}
const drawMissionWithCoach=drawMission;
drawMission=(now,width,height)=>{
 drawMissionWithCoach(now,width,height);
 drawDialogueRoute(now,width,height);
 showGestureCoach();
};
showGestureCoach();

const evidence=$('#evidence');
const evidenceCursor=$('#evidence-cursor');
const evidenceButtons=['a','b','c','next'].map(id=>$('#evidence-'+id));
let evidencePinchUsed=false,evidenceHover=null,evidencePinchSince=null;
function handleEvidenceGesture(gesture,now){
 if(evidence.hidden)return false;
 if(gesture!=='pinch'){
  evidencePinchUsed=false;
  evidencePinchSince=null;
 }
 if(!gesture){
  evidenceCursor.hidden=true;
  if(evidenceHover)evidenceHover.classList.remove('hand-aim');
  evidenceHover=null;
  return true;
 }
 const frame=evidence.getBoundingClientRect();
 const left=Math.min(.98,Math.max(.02,handCameraX))*frame.width;
 const top=Math.min(.98,Math.max(.02,handCameraY))*frame.height;
 evidenceCursor.hidden=false;
 evidenceCursor.style.left=left+'px';
 evidenceCursor.style.top=top+'px';
 const hovered=evidenceButtons.find(button=>{
  if(button.hidden)return false;
  const rect=button.getBoundingClientRect();
  return frame.left+left>=rect.left&&frame.left+left<=rect.right&&frame.top+top>=rect.top&&frame.top+top<=rect.bottom;
 });
 if(hovered!==evidenceHover){
  if(evidenceHover)evidenceHover.classList.remove('hand-aim');
  evidenceHover=hovered;
  if(hovered)hovered.classList.add('hand-aim');
  evidencePinchSince=null;
 }
 if(gesture==='pinch'&&hovered&&!evidencePinchUsed){
  evidencePinchSince??=now;
  if(now-evidencePinchSince>=250){
   evidencePinchUsed=true;
   hovered.click();
  }
 }
 return true;
}
let evidenceAnswer=-1;
function labelEvidence(){
 $('#evidence-title').textContent=L('哪条线索最支持这里曾经有水？','Which clue best suggests that water once flowed here?');
 $('#evidence-note').textContent=camActive
  ?L('移动手掌对准答案，再捏合选择。','Move your hand to an answer and pinch to choose it.')
  :L('比较三条模拟观测，点击你的答案。','Compare the three clues, then click your answer.');
 $('#evidence-a').textContent=L('A · 岩石外表呈红色','A · The rock is red on the outside');
 $('#evidence-b').textContent=L('B · 岩层里有波浪状的交错纹理','B · Ripple patterns cross the rock layers');
 $('#evidence-c').textContent=L('C · 岩石表面有裂缝','C · The rock has cracks on the surface');
 $('#evidence-next').textContent=L('把证据带给 Oppy →','Share the evidence with Oppy →');
 $('#evidence-feedback').textContent=evidenceAnswer===1
  ?L('找对了。水流留下的纹理能帮助推断沉积物怎样堆积。颜色和裂缝也可能有其他成因。','That’s right. Ripple patterns give us clues about how water moved sediment. Color and cracks can form in other ways.')
  :evidenceAnswer<0?'':L('这个现象可能有多种成因。再找一条能直接联系到水流的线索。','That clue could have several explanations. Look for a pattern that moving water might leave behind.');
 $('#evidence-next').hidden=evidenceAnswer!==1;
}
function showEvidence(){
 evidenceCursor.hidden=true;
 evidencePinchUsed=held==='pinch';
 evidencePinchSince=null;
 evidenceAnswer=-1;
 labelEvidence();
 evidence.hidden=false;
 $('#evidence-a').focus({preventScroll:true});
}
['a','b','c'].forEach((name,index)=>{
 $('#evidence-'+name).onclick=()=>{evidenceAnswer=index;labelEvidence();if(index===1)tone(640,.25)};
});
$('#evidence-next').onclick=()=>{
 if(evidenceAnswer!==1)return;
 evidence.hidden=true;
 enter(5);
 $('#start').focus({preventScroll:true});
};
const enterWithEvidence=enter;
const actCurtain=$('#act-curtain');
enter=(scene)=>{
 routeScene=-1;
 const previousAct=act();
 const previousScene=step;
 evidence.hidden=true;
 if(evidenceHover)evidenceHover.classList.remove('hand-aim');
 evidenceHover=null;
 enterWithEvidence(scene);
 if(scene===0){
  waveTurns=0;waveDir=0;waveAnchor=target;waveTime=sceneSince;
  sweepTimes.fill(null);
  lastCoachKey='';
  actCurtain.dataset.play='';
 }
 if(scene>0&&(act()!==previousAct||(scene===12&&previousScene!==12))){
  actCurtain.textContent=scenes[scene][language==='en'?1:0].split(' / ')[0];
  actCurtain.dataset.play=actCurtain.dataset.play==='a'?'b':'a';
 }
};
$('#language').addEventListener('click',labelEvidence);
labelEvidence();

const nasaRecords={
 2:{
  file:'opportunity-shadow.jpg',id:'PIA06739',credit:'NASA/JPL',
  source:'https://science.nasa.gov/photojournal/opportunity-catches-its-shadow-on-sol-180/',
  title:['机遇号拍下自己的影子','Opportunity photographs its shadow'],
  detail:['2004 年 7 月 26 日 · 坚忍撞击坑','July 26, 2004 · Endurance Crater']
 },
 5:{
  file:'last-chance-rock.jpg',id:'PIA05625',credit:'NASA/JPL/Cornell/ARC',
  source:'https://science.nasa.gov/photojournal/last-chance-evidence-of-ancient-water-flow/',
  title:['真实水流线索 ·「最后机会」岩石','Evidence of flowing water · Last Chance rock'],
  detail:['2004 年 3 月 2 日 · 细小的交错岩层提供了古代水流的线索','March 2, 2004 · Fine layers at different angles suggest ancient water flow']
 },
 12:{
  file:'opportunity-last-message.jpg',id:'PIA22929',credit:'NASA/JPL-Caltech/Cornell/ASU',
  source:'https://science.nasa.gov/resource/opportunitys-last-message/',
  title:['机遇号最后传回的影像','The last image Opportunity transmitted'],
  detail:['2018 年 6 月 10 日 · 沙尘暴中传回的不完整影像','June 10, 2018 · An incomplete image sent during the dust storm']
 }
};
const nasaRecord=$('#nasa-record');
function showNasaRecord(){
 const record=nasaRecords[step];
 nasaRecord.hidden=!record;
 if(!record)return;
 const parent=ended?$('#ending'):$('#screen');
 if(nasaRecord.parentElement!==parent)parent.append(nasaRecord);
 const photo=$('#nasa-photo');
 const path='./assets/nasa/'+record.file;
 if(photo.getAttribute('src')!==path)photo.setAttribute('src',path);
 photo.alt=L(...record.title);
 $('#nasa-title').textContent=L(...record.title);
 $('#nasa-detail').textContent=L(...record.detail);
 const link=$('#nasa-source');
 link.href=record.source;
 link.textContent=record.credit+' · '+record.id+' ↗';
}
const renderWithArchive=renderText;
renderText=()=>{
 renderWithArchive();
 showNasaRecord();
 endingHandHint.hidden=!ended||!camActive;
 if(!ended){hideDwell(endingAim);endingAim.activated=false}
};
showNasaRecord();

// Request camera access on arrival; the browser owns the permission prompt.
if(navigator.mediaDevices?.getUserMedia)void $('#camera').onclick();

// 1.3 camera welcome card: explains why the camera matters, mirrors the permission state, and hides once the camera is live.
const camCard=$('#cam-card'),camBox=document.querySelector('.camera-box');
let camCardDismissed=false,camCardKey='',camWasActive=false;
$('#cam-card-on').onclick=()=>{camCardDismissed=false;if(!camActive&&!$('#camera').disabled)$('#camera').onclick()};
$('#cam-card-mouse').onclick=()=>{camCardDismissed=true;camCard.hidden=true};
function camCardLoop(){
 const pending=$('#camera').disabled;
 const failed=!camActive&&!pending&&/拒绝|denied|未启动|unavailable|localhost/i.test($('#status').textContent);
 if(camWasActive&&!camActive)camCardDismissed=true;   // the player turned the camera off on purpose
 camWasActive=camActive;
 camBox?.classList.toggle('live',camActive);
 const state=camActive?'on':pending?'pending':failed?'failed':'off',key=state+language+camCardDismissed;
 if(key!==camCardKey){camCardKey=key;
  camCard.hidden=camActive||camCardDismissed;
  camCard.classList.toggle('pending',state==='pending');
  $('#cam-card-title').textContent=state==='failed'?L('相机还没打开','The camera is not on yet'):L('用摄像头玩，体验最好','Best with your camera');
  $('#cam-card-text').textContent=state==='pending'?L('请在浏览器弹出的提示中点「允许」。你的手就是操偶杆，Oppy 会跟着你的手动。','Click “Allow” in your browser’s prompt. Your hand becomes the puppet rod, and Oppy follows it.')
   :state==='failed'?L('点地址栏左侧的相机图标，允许使用相机，再按「再试一次」。','Click the camera icon in the address bar, allow the camera, then press “Try again”.')
   :L('你的手就是操偶杆：挥手、捏合、张开手掌，Oppy 会跟着你的手动。','Your hand becomes the puppet rod: wave, pinch and open your palm, and Oppy follows.');
  $('#cam-card-privacy').textContent=L('画面只在这台电脑上处理，不录制、不上传。','Video stays on this device. Nothing is recorded or uploaded.');
  $('#cam-card-on').textContent=state==='failed'?L('再试一次','Try again'):state==='pending'?L('等待允许…','Waiting for permission…'):L('开启摄像头','Turn on camera');
  $('#cam-card-on').disabled=state==='pending';
  $('#cam-card-mouse').textContent=L('先用鼠标玩','Play with mouse')}
 requestAnimationFrame(camCardLoop)}
requestAnimationFrame(camCardLoop);

// 1.3 opening: choose a storybook. Only Book I (Oppy) is unlocked; Books II–III are future stories.
// Choosing Oppy: sparkles + chime, the book floats to the centre, opens with light pouring out, and the picture is
// drawn into the page with a flash; then the story starts. Sounds are synthesised and follow the Sound toggle.
const storybook=$('#storybook');let bookChosen=false;
const EMBLEMS={
 oppy:'<svg class="cover-emblem" viewBox="0 0 100 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 34h56l8 8H14z"/><path d="M24 34l20-10 26 4"/><path d="M48 24V10"/><rect x="40" y="3" width="16" height="8" rx="1"/><circle cx="45" cy="7" r="1.4"/><circle cx="51" cy="7" r="1.4"/><path d="M66 28l6-12"/><ellipse cx="74" cy="14" rx="6" ry="2.4"/><circle cx="24" cy="52" r="7"/><circle cx="48" cy="52" r="7"/><circle cx="72" cy="52" r="7"/><path d="M24 42v3M48 42v3M72 42v3"/></svg>',
 voyager:'<svg class="cover-emblem" viewBox="0 0 100 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="50" cy="26" rx="20" ry="7"/><path d="M30 26c4 12 36 12 40 0"/><path d="M50 33v10"/><rect x="44" y="43" width="12" height="9"/><path d="M56 47h30M44 47H18M86 47l4-4M18 47l-5 5"/><path d="M82 12l1.5 3 3 1.5-3 1.5L82 21l-1.5-3-3-1.5 3-1.5z"/></svg>',
 apollo:'<svg class="cover-emblem" viewBox="0 0 100 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 40h70"/><path d="M22 40l6-12h34l8 12"/><path d="M40 28v-6h12"/><path d="M68 28V12"/><path d="M60 12c4-6 12-6 16 0z"/><circle cx="24" cy="48" r="7"/><circle cx="74" cy="48" r="7"/><path d="M84 6a8 8 0 1 0 6 13a7 7 0 1 1-6-13z"/></svg>'};
const BOOKS=[
 {id:'oppy',open:true,theme:'',title:'Oppy',num:['第一册','Book I'],sub:['留在火星的探测车','The Rover Who Stayed on Mars'],cap:['第一册 · 现在就读','Book I · Read now']},
 {id:'voyager',theme:'cover-blue',title:'Voyager',long:true,num:['第二册','Book II'],sub:['还在飞行的探测器','The Probe Still Travelling'],cap:['第二册 · 即将推出','Book II · Coming soon']},
 {id:'apollo',theme:'cover-grey',title:'Apollo',num:['第三册','Book III'],sub:['留在月球的月球车','The Rover Left on the Moon'],cap:['第三册 · 即将推出','Book III · Coming soon']}];
function buildBooks(){
 $('#sb-shelf').innerHTML=BOOKS.map(b=>`<div class="sb-slot${b.open?'':' locked'}" id="slot-${b.id}"><div class="book${b.open?' unlocked':''}" id="book-${b.id}" role="button" tabindex="0"${b.open?'':' aria-disabled="true"'}>
  <div class="book-block">${b.open?'<div class="book-page"><p class="book-chapter" id="book-chapter"></p><p class="book-text" id="book-text"></p><span class="book-folio">1</span></div>':''}</div>
  <div class="book-cover"><div class="cover-front ${b.theme}"><i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>
   <span class="cover-series" data-i="series"></span>${EMBLEMS[b.id]}<span class="cover-title${b.long?' long':''}">${b.title}</span><span class="cover-rule"></span><span class="cover-sub" data-i="sub"></span><span class="cover-book" data-i="num"></span></div>
   ${b.open?`<div class="cover-back">${EMBLEMS.oppy}<span class="book-ex" data-i="num"></span><span class="book-ex-title">Oppy</span><span class="book-ex-sub" id="book-ex-sub"></span></div>`:''}</div>
  <i class="ribbon"></i>${b.open?'<i class="book-light"></i>':'<span class="book-lock"><b>🔒</b></span>'}</div><span class="sb-cap" data-i="cap"></span></div>`).join('')}
function fillBooks(){
 $('#sb-eyebrow').textContent=L('余影 · 遗落之物故事集','Shadows Left Behind · Story Collection');
 $('#sb-title').textContent=L('选一本故事书','Choose a story');
 BOOKS.forEach(b=>{const slot=document.getElementById?.('slot-'+b.id);if(!slot)return;
  slot.querySelectorAll('[data-i="series"]').forEach(e=>e.textContent=L('遗落之物故事集','Stories Left Behind'));
  slot.querySelectorAll('[data-i="num"]').forEach(e=>e.textContent=L(...b.num));
  slot.querySelectorAll('[data-i="sub"]').forEach(e=>e.textContent=L(...b.sub));
  slot.querySelectorAll('[data-i="cap"]').forEach(e=>e.textContent=L(...b.cap));
  slot.querySelector('.book').setAttribute('aria-label',b.open?L('打开第一册《Oppy》','Open Book I: Oppy'):L(`${b.num[0]}（未解锁）`,`${b.num[1]}: ${b.title} (locked)`))});
 const ex=document.getElementById?.('book-ex-sub');if(ex)ex.textContent=L('一个关于机遇号的故事','A story of NASA’s Opportunity rover');
 const ch=document.getElementById?.('book-chapter');if(ch)ch.textContent=L('第一章','Chapter One');
 const tx=document.getElementById?.('book-text');if(tx)tx.textContent=L('很久以前，在一颗红色的星球上，有一辆小小的探测车，名叫机遇号。它等啊等，等着有人来找它……','Once upon a time, on a red and dusty planet, there lived a little rover named Opportunity. It waited and waited for someone to find it…');
 if(!bookChosen)$('#sb-hint').textContent=L('点一下 Oppy 的书，开始故事','Tap Oppy’s book to begin')}
// golden dust rising around the shelf
function buildDust(){const d=$('#sb-dust');let h='';for(let i=0;i<22;i++){const r=k=>((Math.sin(i*12.9898+k*78.233)*43758.5453)%1+1)%1;
  h+=`<i style="left:${(18+r(1)*64).toFixed(1)}%;--s:${(2+r(2)*3).toFixed(1)}px;--d:${(6+r(3)*6).toFixed(1)}s;--delay:${(-r(4)*10).toFixed(1)}s;--drift:${((r(5)-.5)*80).toFixed(0)}px"></i>`}d.innerHTML=h}
function sparkBurst(el){const box=$('#sb-sparks'),a=el.getBoundingClientRect(),b=storybook.getBoundingClientRect(),cx=a.left-b.left+a.width/2,cy=a.top-b.top+a.height/2;let h='';
 for(let i=0;i<26;i++){const ang=i/26*Math.PI*2+Math.random()*.3,dist=70+Math.random()*120;h+=`<i style="--x:${cx}px;--y:${cy}px;--s:${(8+Math.random()*12).toFixed(0)}px;--tx:${(Math.cos(ang)*dist).toFixed(0)}px;--ty:${(Math.sin(ang)*dist).toFixed(0)}px;animation-delay:${(Math.random()*.15).toFixed(2)}s"></i>`}
 box.innerHTML=h}
// --- synthesised sounds (no files) ---
function sbOut(){if(!fx||!audio||audio.state!=='running')return null;const out=audio.createGain();out.gain.value=.9;const dl=audio.createDelay();dl.delayTime.value=.23;const fb=audio.createGain();fb.gain.value=.38;const wet=audio.createGain();wet.gain.value=.35;
 out.connect(audio.destination);out.connect(dl);dl.connect(fb).connect(dl);dl.connect(wet).connect(audio.destination);return out}
function sbBell(out,f,at,len,vol){const o=audio.createOscillator(),o2=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=f;o2.type='sine';o2.frequency.value=f*2.01;
 g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(vol,at+.006);g.gain.exponentialRampToValueAtTime(.0001,at+len);const g2=audio.createGain();g2.gain.value=.25;o.connect(g);o2.connect(g2).connect(g);g.connect(out);o.start(at);o2.start(at);o.stop(at+len+.05);o2.stop(at+len+.05)}
function sbChime(){const out=sbOut();if(!out)return;const t=audio.currentTime;[1046.5,1318.5,1568,2093,2637].forEach((f,i)=>sbBell(out,f,t+i*.075,1.4,.07))}
function sbShimmer(){const out=sbOut();if(!out)return;const t=audio.currentTime;[2093,2349,2637,3136,3520,4186].forEach((f,i)=>sbBell(out,f,t+i*.045,.9,.035));sbBell(out,523.3,t,2.2,.06)}
function sbWhoosh(){if(!fx||!audio||audio.state!=='running')return;const t=audio.currentTime,len=1.3,buf=audio.createBuffer(1,audio.sampleRate*len,audio.sampleRate),d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 const src=audio.createBufferSource();src.buffer=buf;const bp=audio.createBiquadFilter();bp.type='bandpass';bp.Q.value=1.2;bp.frequency.setValueAtTime(300,t);bp.frequency.exponentialRampToValueAtTime(2600,t+len*.8);
 const g=audio.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12,t+.35);g.gain.exponentialRampToValueAtTime(.0001,t+len);src.connect(bp).connect(g).connect(audio.destination);src.start(t);src.stop(t+len)}
function sbThud(){if(!fx||!audio||audio.state!=='running')return;const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(70,t+.25);
 g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.0001,t+.3);o.connect(g).connect(audio.destination);o.start(t);o.stop(t+.32)}
function lockedBook(el){try{unlock()}catch{}el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');sbThud();
 $('#sb-hint').textContent=L('这本故事还在写，先读 Oppy 的故事吧。','This story is still being written. Start with Oppy’s.')}
function chooseOppy(){if(bookChosen)return;bookChosen=true;try{unlock()}catch{}
 const slot=$('#slot-oppy'),a=slot.getBoundingClientRect(),b=storybook.getBoundingClientRect();
 slot.style.setProperty('--dx',((b.left+b.width/2)-(a.left+a.width/2))+'px');
 slot.style.setProperty('--dy',((b.top+b.height/2)-(a.top+a.height/2)+8)+'px');
 sparkBurst($('#book-oppy'));setTimeout(sbChime,30);
 storybook.classList.add('chosen');
 setTimeout(()=>{storybook.classList.add('open');sbWhoosh()},1100);
 setTimeout(()=>{storybook.classList.add('dive');sbShimmer()},2850);
 setTimeout(()=>{storybook.hidden=true;if(!started)$('#start').click()},3850)}
function sizeBooks(){const s=$('#screen').getBoundingClientRect();storybook.style.setProperty?.('--stage-h',s.height+'px')}
buildBooks();buildDust();fillBooks();sizeBooks();
window.addEventListener('resize',sizeBooks);
$('#language').addEventListener('click',()=>setTimeout(fillBooks,0));
$('#sb-shelf').addEventListener('click',e=>{const book=e.target.closest?.('.book');if(!book)return;if(book.id==='book-oppy')chooseOppy();else lockedBook(book)});
window.addEventListener('keydown',e=>{if(bookChosen||storybook.hidden)return;
 if(e.code==='Space'||e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();
  const f=document.activeElement;if(f&&f.classList?.contains('book')&&f.id!=='book-oppy')lockedBook(f);else chooseOppy()}},true);
// The stage captures the pointer on pointerdown (for hold-to-scan and dragging); keep that from swallowing clicks on the books.
storybook.addEventListener('pointerdown',e=>e.stopPropagation());

// 1.3 recording mode (open with ?rec): stage + a large mirrored camera for filming the demo, and one-key jumps to the
// highlight moments. Keys 1–6 jump, H shows/hides the menu. Only active with ?rec in the URL.
const REC_MODE=typeof location!=='undefined'&&/[?&]rec(=|&|$)/.test(location.search);
const REC_SHOTS=[
 {key:'1',label:['选书开场','Choose the book'],go:()=>{location.href=location.pathname+'?rec&t='+Date.now()}},
 {key:'2',label:['挥手扫开石堆','Wave the rocks away'],step:1},
 {key:'3',label:['跟着光点走','Follow the glow'],step:2},
 {key:'4',label:['扫描岩石','Scan the rocks'],step:4},
 {key:'5',label:['留住最后的光','Hold the last light'],step:6},
 {key:'6',label:['把记忆送回地球','Carry memories home'],step:11}];
let recJump=function(shot){
 if(shot.go){shot.go();return}
 storybook.hidden=true;bookChosen=true;try{unlock()}catch{}
 const cc=document.getElementById('cam-card');if(cc){camCardDismissed=true;cc.hidden=true}
 try{reset()}catch{}
 started=true;enter(shot.step);renderText();
 document.querySelectorAll('#rec-menu button').forEach(b=>b.classList.toggle('on',b.dataset.key===shot.key))}
if(REC_MODE){
 document.body.classList.add('rec-mode');
 const menu=document.createElement('nav');menu.id='rec-menu';
 const fill=()=>{menu.innerHTML=`<b>REC · ${L('精华片段','Highlights')}</b>`+REC_SHOTS.map(s=>`<button type="button" data-key="${s.key}"><kbd>${s.key}</kbd>${L(...s.label)}</button>`).join('')+`<small>${L('H 隐藏菜单','H hides this menu')}</small>`;
  menu.querySelectorAll('button').forEach(b=>b.onclick=()=>recJump(REC_SHOTS.find(s=>s.key===b.dataset.key)))};
 fill();document.body.append(menu);
 $('#language').addEventListener('click',()=>setTimeout(fill,0));
 window.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;
  const shot=REC_SHOTS.find(s=>s.key===e.key);
  if(shot){e.preventDefault();e.stopImmediatePropagation();recJump(shot);return}
  if(e.key==='h'||e.key==='H'){e.stopImmediatePropagation();menu.hidden=!menu.hidden}},true);
 // keep the stage canvas sized to the new layout
 setTimeout(()=>window.dispatchEvent(new Event('resize')),300);
}

// recording mode: 3-2-1 countdown before each highlight (Shift+number skips it)
let recCounting=false;
function recCountdown(then){if(recCounting)return;recCounting=true;try{unlock()}catch{}
 const box=document.createElement('div');box.id='rec-count';(document.getElementById('screen')||document.body).append(box);
 const steps=['3','2','1','GO!'];let i=0;
 const tick=()=>{if(i>=steps.length){box.remove();recCounting=false;then();return}
  box.textContent=steps[i];box.className='';void box.offsetWidth;box.className='pop'+(i===3?' go':'');
  try{tone(i===3?988:660,i===3?.35:.18,'sine',0,.12)}catch{}
  i++;setTimeout(tick,i===4?650:850)};
 tick()}
if(REC_MODE){
 const go=recJump;
 recJump=shot=>{if(shot.go){shot.go();return}recCountdown(()=>go(shot))};
 window.addEventListener('keydown',e=>{const shot=REC_SHOTS.find(s=>s.key===e.key.replace(/[!@#$%^]/,m=>'1234567'['!@#$%^'.indexOf(m)]));
  if(e.shiftKey&&shot&&!shot.go){e.preventDefault();e.stopImmediatePropagation();go(shot)}},true);
 if(/[?&]cd=1/.test(location.search))setTimeout(()=>recCountdown(()=>{}),900);
 REC_SHOTS[0].go=()=>{location.href=location.pathname+'?rec&cd=1&t='+Date.now()};
}

// recording mode: auto-record all highlights. R starts (the browser asks which tab to share — pick this one),
// each highlight gets a 3-2-1 countdown and a fixed time, then the video downloads. Space = next, Esc = stop & save.
const REC_TIMES={1:6,2:10,3:12,4:14,5:10,6:16};
function resetBook(){storybook.className='';storybook.hidden=false;bookChosen=false;
 const sp=document.getElementById('sb-sparks');if(sp)sp.innerHTML='';
 const slot=document.getElementById('slot-oppy');if(slot){slot.style.removeProperty('--dx');slot.style.removeProperty('--dy')}
 try{reset()}catch{}fillBooks()}
function recDo(shot){
 if(shot.book){resetBook();setTimeout(()=>{if(!bookChosen)chooseOppy()},1500);return}
 storybook.hidden=true;bookChosen=true;try{unlock()}catch{}
 const cc=document.getElementById('cam-card');if(cc){camCardDismissed=true;cc.hidden=true}
 try{reset()}catch{}
 started=true;enter(shot.step);renderText()}
let recRecorder=null,recSkip=null,recStopAll=false;
function recWait(sec){return new Promise(res=>{const t=setTimeout(res,sec*1000);recSkip=()=>{clearTimeout(t);res()}})}
function recStatus(text){const s=document.getElementById('rec-status');if(s)s.textContent=text}
async function recordAll(){
 if(recRecorder)return;
 let stream;
 try{stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:30},audio:true,preferCurrentTab:true,selfBrowserSurface:'include'})}
 catch(e){recStatus(L('没有开始录制（未选择分享画面）','Recording not started (no screen chosen)'));return}
 const mime=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(m=>window.MediaRecorder?.isTypeSupported?.(m))||'';
 const chunks=[],rec=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:8000000}:{});
 rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
 const done=new Promise(res=>rec.onstop=res);
 recRecorder=rec;recStopAll=false;rec.start(500);document.body.classList.add('rec-live');
 const t0=performance.now();const clock=setInterval(()=>{const s=Math.floor((performance.now()-t0)/1000);recStatus(`● REC ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`)},250);
 stream.getVideoTracks()[0]?.addEventListener('ended',()=>{recStopAll=true;recSkip?.()});
 await recWait(.8);
 for(const shot of REC_SHOTS){if(recStopAll)break;
  await new Promise(res=>recCountdown(()=>{recDo(shot);res()}));
  document.querySelectorAll('#rec-menu button').forEach(b=>b.classList.toggle('on',b.dataset.key===shot.key));
  await recWait(REC_TIMES[shot.key]||10)}
 clearInterval(clock);
 if(rec.state!=='inactive')rec.stop();await done;stream.getTracks().forEach(t=>t.stop());
 recRecorder=null;document.body.classList.remove('rec-live');
 const blob=new Blob(chunks,{type:mime||'video/webm'}),a=document.createElement('a'),d=new Date();
 a.href=URL.createObjectURL(blob);a.download=`shadows-highlights-${d.getHours()}${String(d.getMinutes()).padStart(2,'0')}.webm`;document.body.append(a);a.click();a.remove();
 recStatus(L(`已保存到下载文件夹（${(blob.size/1e6).toFixed(1)} MB）`,`Saved to Downloads (${(blob.size/1e6).toFixed(1)} MB)`))}
if(REC_MODE){
 REC_SHOTS[0].go=null;REC_SHOTS[0].book=true;REC_SHOTS[0].step=0;
 recJump=shot=>recCountdown(()=>recDo(shot));
 const menu=document.getElementById('rec-menu');
 const addControls=()=>{if(!menu||menu.querySelector('.rec-all'))return;
  const btn=document.createElement('button');btn.type='button';btn.className='rec-all';btn.innerHTML=`<kbd>R</kbd>${L('● 自动录制全部精华','● Record all highlights')}`;btn.onclick=recordAll;
  const st=document.createElement('small');st.id='rec-status';st.textContent=L('空格：下一段 · Esc：停止并保存','Space: next · Esc: stop & save');
  menu.querySelector('b').after(btn);menu.append(st);
  menu.querySelectorAll('button[data-key]').forEach(b=>b.onclick=()=>recJump(REC_SHOTS.find(s=>s.key===b.dataset.key)))};
 addControls();
 $('#language').addEventListener('click',()=>setTimeout(addControls,30));
 window.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;
  if((e.key==='r'||e.key==='R')&&!recRecorder){e.preventDefault();e.stopImmediatePropagation();recordAll();return}
  if(recRecorder&&(e.code==='Space'||e.key==='n'||e.key==='N')){e.preventDefault();e.stopImmediatePropagation();recSkip?.();return}
  if(recRecorder&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();recStopAll=true;recSkip?.()}},true);
}

// recording mode: the countdown says what comes next, and auto-record also saves a marks file
// (when each highlight starts, in seconds from the start of the video).
const REC_TIPS={1:['点 Oppy 的书，看它飘起翻开','Tap Oppy’s book: it floats and opens'],2:['张开手掌，左右挥动','Open your palm and wave side to side'],
 3:['用手把 Oppy 开到发光处','Guide Oppy to the glow with your hand'],4:['对准岩石捏合，停一下','Pinch on a rock and hold'],
 5:['张开手掌，举着不动','Hold your open palm still'],6:['捏起记忆，移到地球，张手放开','Pinch a memory, carry it to Earth, open your hand']};
function recLabelFor(shot){return `${L('下一段','Next')}: ${L(...shot.label)}  ·  ${L(...(REC_TIPS[shot.key]||['','']))}`}
function recCountdownFor(shot,then){recCountdown(then);const box=document.getElementById('rec-count');if(!box)return;
 const tip=document.createElement('div');tip.className='rec-next';tip.textContent=recLabelFor(shot);box.parentElement.append(tip);setTimeout(()=>tip.remove(),3300)}
recordAll=async function(){
 if(recRecorder)return;
 let stream;
 try{stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:30},audio:true,preferCurrentTab:true,selfBrowserSurface:'include'})}
 catch(e){recStatus(L('没有开始录制（未选择分享画面）','Recording not started (no screen chosen)'));return}
 const mime=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'].find(m=>window.MediaRecorder?.isTypeSupported?.(m))||'';
 const chunks=[],rec=new MediaRecorder(stream,mime?{mimeType:mime,videoBitsPerSecond:8000000}:{});
 rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
 const done=new Promise(res=>rec.onstop=res);
 recRecorder=rec;recStopAll=false;rec.start(500);document.body.classList.add('rec-live');
 const t0=performance.now(),marks=[];
 const clock=setInterval(()=>{const s=Math.floor((performance.now()-t0)/1000);recStatus(`● REC ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`)},250);
 stream.getVideoTracks()[0]?.addEventListener('ended',()=>{recStopAll=true;recSkip?.()});
 await recWait(.8);
 for(const shot of REC_SHOTS){if(recStopAll)break;
  await new Promise(res=>recCountdownFor(shot,()=>{marks.push({key:shot.key,highlight:L(...shot.label),startsAt:+((performance.now()-t0)/1000).toFixed(2)});recDo(shot);res()}));
  document.querySelectorAll('#rec-menu button').forEach(b=>b.classList.toggle('on',b.dataset.key===shot.key));
  await recWait(REC_TIMES[shot.key]||10)}
 clearInterval(clock);
 if(rec.state!=='inactive')rec.stop();await done;stream.getTracks().forEach(t=>t.stop());
 recRecorder=null;document.body.classList.remove('rec-live');
 const d=new Date(),stamp=`${d.getHours()}${String(d.getMinutes()).padStart(2,'0')}`;
 const save=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove()};
 const video=new Blob(chunks,{type:mime||'video/webm'});
 save(video,`shadows-highlights-${stamp}.webm`);
 setTimeout(()=>save(new Blob([JSON.stringify({video:`shadows-highlights-${stamp}.webm`,note:'startsAt = seconds from the start of the video when each highlight begins (after its countdown)',highlights:marks},null,1)],{type:'application/json'}),`shadows-highlights-${stamp}-marks.json`),400);
 recStatus(L(`已保存到下载文件夹（${(video.size/1e6).toFixed(1)} MB + 时间表）`,`Saved to Downloads (${(video.size/1e6).toFixed(1)} MB + marks)`))};
if(REC_MODE){
 recJump=shot=>recCountdownFor(shot,()=>recDo(shot));
 const hook=()=>{const b=document.querySelector('#rec-menu .rec-all');if(b)b.onclick=()=>recordAll();
  document.querySelectorAll('#rec-menu button[data-key]').forEach(x=>x.onclick=()=>recJump(REC_SHOTS.find(s=>s.key===x.dataset.key)))};
 hook();$('#language').addEventListener('click',()=>setTimeout(hook,60));
}
