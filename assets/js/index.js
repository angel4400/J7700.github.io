(function($) {
    var video = $("#my-video"); // 视频对象
    var loop = false; // 是否循环播放
    var qieh = 1; // 切换视频
    var videoIndex = 0; // 视频索引
    var videoProp = 0; // 视频比例
    var ddd = document.getElementById('video-div'); // 视频容器
    var full = false; // 是否全屏
    var timer; // 定时器
    var hidding = false; // 是否隐藏
    var isOn = true; // 是否开启
    var videoListLen = $('.player-list-video').length; // 视频列表长度
    var videoSpeed = 1; // 视频播放速度
    var videoListAll = new Array(
      "https://lark-assets-prod-aliyun.oss-cn-hangzhou.aliyuncs.com/yuque/0/2022/mp4/23093680/1668342640692-492b2275-7408-4810-8102-bfaab8266c8f.mp4?OSSAccessKeyId=LTAI4GGhPJmQ4HWCmhDAn4F5&Expires=1668344450&Signature=hR9CWaHeV74GRU8%2BUw2WbdCKomE%3D&response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27%25E7%2594%25BB%25E4%25B8%25AD%25E6%25B8%25B8.mp4",
      "https://lark-assets-prod-aliyun.oss-cn-hangzhou.aliyuncs.com/yuque/0/2022/mp4/23093680/1668337659717-ef67615d-e842-475a-86d1-9fd2119a6652.mp4?OSSAccessKeyId=LTAI4GGhPJmQ4HWCmhDAn4F5&Expires=1668344492&Signature=dohJBG2ssOVi599qcjA34w8hcMw%3D&response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27Windy%2520Hill.mp4",
      "https://lark-assets-prod-aliyun.oss-cn-hangzhou.aliyuncs.com/yuque/0/2022/mp4/23093680/1668337758970-2b3e1688-5b84-4d13-bdbf-cd77d4f4c2c8.mp4?OSSAccessKeyId=LTAI4GGhPJmQ4HWCmhDAn4F5&Expires=1668340401&Signature=IjMnbBktstoCcUhcsCAt3n%2BrJGc%3D&response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27%25E5%25BF%2586%25E5%25A4%258F%25E6%2580%259D%25E4%25B9%25A1.mp4"
    ); // 视频列表
    var danId = 0; // 弹幕id
    var clickFlag = null; // 点击标识
    var vedioError = null; // 视频错误
    function qiehuan(){ // 切换视频
        video[0].src = videoListAll[videoIndex]; // 视频地址
        $('.psVideo-timeBar').css('width', 0); // 进度条
        video[0].play(); // 播放
        $('.psVideo-play-btn').removeClass('psVideo-stop').addClass('psVideo-play'); // 播放按钮
        $('.psVideo-play-one').hide(); // 播放按钮
    }
    // 读取初始时间
    function timeFormat(seconds) { // 时间格式化
        var minite = Math.floor(seconds / 60); // 分钟
        if(minite < 10) { // 小于10
            minite = "0" + minite; // 补0
        }
        var second = Math.floor(seconds % 60); // 秒
        if(second < 10) { // 小于10
            second = "0" + second; // 补0
        }
        return minite + ":" + second; // 返回时间
    }
    //更新时间进度条
    function updateProgress(x){ // 更新进度条
        if (!full || !hidding){ // 不是全屏或者不是隐藏
            var progress = $('.psVideo-progress'); // 进度条
            var position = x - progress.offset().left; // 进度条位置
            var percentage = 100 * position / progress.width(); // 进度条百分比
            if(percentage > 100) { // 大于100
                percentage = 100; // 等于100
            }
            if(percentage < 0) { // 小于0
                percentage = 0; // 等于0
            }
            $('.psVideo-timeBar').css('width', percentage+'%'); // 进度条
            video[0].currentTime = video[0].duration * percentage / 100; // 当前时间
        }
    }
    // 拖拽时间进度条
    function enableProgressDrag() { // 拖拽进度条
        if (!full || !hidding){ // 不是全屏或者不是隐藏
            var progressDrag = false; // 拖拽
            $('.psVideo-progress').on('mousedown', function(e) { // 鼠标按下
                progressDrag = true; // 拖拽
                updateProgress(e.pageX); // 更新进度条
            });
            $(document).on('mouseup', function(e) { // 鼠标抬起
                if(progressDrag) { // 拖拽
                    progressDrag = false; // 拖拽
                    updateProgress(e.pageX); // 更新进度条
                }
            });
            $(document).on('mousemove', function(e) { // 鼠标移动
                if(progressDrag) { // 拖拽
                    updateProgress(e.pageX); // 更新进度条
                }
            });
        }
    };
    // 控制栏展示消失
    function showControl(shouldShow) { // 控制栏展示消失
        if(shouldShow) { // 展示
            $('.psVideo-shade').removeClass('psVideo-shade-off').addClass('psVideo-shade-on'); // 遮罩
            $('.player-list').removeClass('player-list-off').addClass('player-list-on'); // 列表
        } else {
            $('.psVideo-shade').removeClass('psVideo-shade-on').addClass('psVideo-shade-off'); // 遮罩
            $('.player-list').removeClass('player-list-on').addClass('player-list-off'); // 列表
        }
    }
    function fillShow() { // 全屏
        if (full){ // 全屏
            if(hidding){
                hidding = false; // 隐藏
            }
            if (timer) { // 定时器
                clearTimeout(timer); // 清除定时器
                timer = null; // 清除定时器
            }
            $('.psVideo-shade').removeClass('psVideo-shade-off').addClass('psVideo-shade-on'); // 遮罩
            $('.player-list').removeClass('player-list-off').addClass('player-list-on'); // 列表
            video.attr('style', 'cursor:pointer'); // 鼠标样式
            if (isOn){ // 鼠标移动
                timer = setTimeout(function () { // 定时器
                    hidding = true;
                    $('.psVideo-shade').removeClass('psVideo-shade-on').addClass('psVideo-shade-off');
                    $('.player-list').removeClass('player-list-on').addClass('player-list-off');
                    video.attr('style', 'cursor:none');
                }, 2000)
            }
        }
    }
    //声音按钮
    function soundAndMute() {
        if (!full || !hidding){
            if(video[0].muted) {
                video[0].muted = false;
                $('#soundBtn').removeClass("jinyin").addClass("sound");
                $('.volumeBar').css('height', (1 - video[0].volume) * 100 + '%');
                $('.sound-number').text(parseInt(video[0].volume * 100));
            } else {
                video[0].muted = true;
                $('#soundBtn').removeClass("sound").addClass("jinyin");
                $('.sound-number').text(0);
                $('.volumeBar').css({
                    "height": "50px",
                })
            }
        }
    };
    //声音拖拽
    function enableSoundDrag() {
        if (!full || !hidding){
            var volumeDrag = false;
            $('.volume').on('mousedown', function(e) {
                volumeDrag = true;
                updateVolume(e.pageY);
                video[0].muted = false;
                $('#soundBtn').removeClass("jinyin").addClass("sound");
            });
            $(document).on('mouseup', function(e) {
                if(volumeDrag) {
                    volumeDrag = false;
                    updateVolume(e.pageY);
                }
            });
            $(document).on('mousemove', function(e) {
                if(volumeDrag) {
                    updateVolume(e.pageY);
                }
            });
        }
    };
    // 更新声音
    function updateVolume(y, vol) {
        if (!full || !hidding){
            var volume = $('.volume');
            var soundTop = y - volume.offset().top;
            var percentage;
            if(vol) {
                percentage =100- (vol * 100);
            } else {
                var position = soundTop;
                percentage = 100 * position / 50;
            }
            if(percentage > 100) {
                $('#soundBtn').removeClass("sound").addClass("jinyin");
                percentage = 100;
            } else {
                $('#soundBtn').removeClass("jinyin").addClass("sound");
            }
            if(percentage < 0) {
                percentage = 0;
            }
            percentage = parseInt(percentage);
            $('.sound-number').text(100 -percentage);
            $('.volumeBar').css('height', percentage + '%');
            video[0].volume = (100 - percentage) / 100;
        }
    };
    //开始暂停
    function playAndPause() {
            if(video[0].paused || video[0].ended) {
                video[0].play();
                $('.psVideo-play-btn').removeClass('psVideo-stop').addClass('psVideo-play');
                $('.psVideo-play-one').hide();
                playSpeed(videoSpeed);
                $('.psVideo-dan-all').css('animation-play-state','running');
            }
            else {
                video[0].pause();
                $('.psVideo-play-btn').removeClass('psVideo-play').addClass('psVideo-stop');
                $('.psVideo-play-one').show();
                $('.psVideo-dan-all').css('animation-play-state','paused');
            }
    }
    //播放速度
    function playSpeed(speed) {
        if (!full || !hidding){
            if(speed == 1) {
                $('#speed05Btn').removeClass("moren");
                $('#speed2Btn').removeClass("moren");
                $('#speed1Btn').addClass("moren");
                videoSpeed = 1;
            } else if(speed == 2) {
                $('#speed05Btn').removeClass("moren");
                $('#speed1Btn').removeClass("moren");
                $('#speed2Btn').addClass("moren");
                videoSpeed = 2;
            } else if(speed == 0.5) {
                $('#speed1Btn').removeClass("moren");
                $('#speed2Btn').removeClass("moren");
                $('#speed05Btn').addClass("moren");
                videoSpeed = 0.5;
            }
            video[0].playbackRate = speed;
        }
    }
    //循环播放
    function isloop() {
        if (!full || !hidding){
            if(!loop){
                $('#loop').removeClass('loop').addClass('loop-ture');
                video[0].loop = true;
                loop = !loop;
            } else{
                $('#loop').removeClass('loop-ture').addClass('loop');
                video[0].loop = false;
                loop = !loop;
            }
        }
    }

    function danOn() {
        var danText = $('.psVideo-dan-input').val();
        var zz = "^[ ]+$";               //正则判断是否全是空格
        var isK = new RegExp(zz);
        if (danText && !(isK.test(danText))){
            var danIdNow = 'dan' + danId;
            if (full){
                var danDom = "<span class='psVideo-dan-all psVideo-dan-value-full' id='" + danIdNow + "'</span>";
            } else {
                var danDom = "<span class='psVideo-dan-all psVideo-dan-value' id='" + danIdNow + "'</span>";
            }
            $('.psVideo').prepend(danDom);
            if(danId %3 == 1){
                $('#' + danIdNow).css('margin-top','30px');
            } else if(danId % 3 == 2){
                $('#' + danIdNow).css('margin-top','60px');
            }
            if(video[0].paused || video[0].ended){
                $('.psVideo-dan-all').css('animation-play-state','paused');
            } else {
                $('.psVideo-dan-all').css('animation-play-state','running');
            }
            $('.psVideo-dan-all').on('animationend', function () {
                $('#'+ this.id).remove();
            });
            danId += 1;
            $('#' + danIdNow).text(danText);
            $('.psVideo-dan-input').val("");
        }

    }
    function toFull() {
        $('.psVideo').addClass('full');
        video.addClass('full');
        $('.psVideo-dan').addClass('psVideo-dan-full');
        $('.psVideo-dan-input').addClass('psVideo-dan-input-full');
        $('.psVideo-shade').addClass('psVideo-shade-full');
        timer = setTimeout(function () {
            hidding = true;
            $('.psVideo-shade').removeClass('psVideo-shade-on').addClass('psVideo-shade-off');
            $('.player-list').removeClass('player-list-on').addClass('player-list-off');
            video.attr('style', 'cursor:none');
        }, 2000)
    }
    function outFull() {
        clearTimeout(timer);
        video.removeClass('full');
        $('.psVideo').removeClass('full');
        $('.psVideo-shade').removeClass('psVideo-shade-full');
        $('.psVideo-shade').removeClass('psVideo-shade-off').addClass('psVideo-shade-on');
        $('.player-list').removeClass('player-list-off').addClass('player-list-on');
        video.attr('style', 'cursor:pointer');
        $('.psVideo-dan').removeClass('psVideo-dan-full');
        $('.psVideo-dan-input').removeClass('psVideo-dan-input-full');
    }
    //全屏
    function doOnClick() {
        if(clickFlag) {
            clickFlag = clearTimeout(clickFlag);
        }
        clickFlag = setTimeout(function() {
            playAndPause();
        }, 300);
    }
    function doOnDblClick() {
        if(clickFlag) {
            clickFlag = clearTimeout(clickFlag);
        }
        launchFullScreen();
    }
    function keyTime(key){
        if (key == 39){
            var keyCurrentTime = video[0].currentTime + 10;
            var keyDuration = video[0].duration;
            var keyPercent = 100 * keyCurrentTime / keyDuration;
            $('.psVideo-timeBar').css('width', keyPercent + '%');
            $('#currentTime').text(timeFormat(keyCurrentTime));
            video[0].currentTime = keyCurrentTime;
        }
        if (key == 37){
            console.log(video[0].currentTime);
            var keyCurrentTime = video[0].currentTime - 10;
            console.log(keyCurrentTime);
            var keyDuration = video[0].duration;
            var keyPercent = 100 * keyCurrentTime / keyDuration;
            $('.psVideo-timeBar').css('width', keyPercent + '%');
            $('#currentTime').text(timeFormat(keyCurrentTime));
            video[0].currentTime = keyCurrentTime;
        }
    }
    //全屏
    function launchFullScreen() {
        if (!full || !hidding){
            var element = document.documentElement;
            if (! full){
                if(element.requestFullScreen) {
                    element.requestFullScreen();
                } else if(element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if(element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        }
    }
    //监听退出全屏事件
    document.addEventListener("fullscreenchange", function(e) {
        if (!full){
            toFull();
        } else {
            outFull();
        }
        full = !full;
    });
    document.addEventListener("mozfullscreenchange", function(e) {
        if (!full){
            toFull();
        } else {
            outFull();
        }
        full = !full;
    });
    document.addEventListener("webkitfullscreenchange", function(e) {
        if (!full){
            toFull();
        } else {
            outFull();
        }
        full = !full;
    });
    document.addEventListener("MSFullscreenChange", function(e) {
        if (!full){
            toFull();
        } else {
            outFull();
        }
        full = !full;
    });

    updateVolume(0, 0.9);  // 初始化声音
    video.on("loadedmetadata", function(){
        $('#currentTime').text(timeFormat(0));
        $('#duration').text(timeFormat(video[0].duration));
        enableProgressDrag();
        enableSoundDrag();
        playSpeed(videoSpeed);
    });
    video.on('timeupdate', function() {
        var currentTime = video[0].currentTime;
        var duration = video[0].duration;
        var percent = 100 * currentTime / duration;
        $('.psVideo-timeBar').css('width', percent + '%');
        $('#currentTime').text(timeFormat(currentTime));
    });
    video.on('canplay', function() {
        $('.psVideo-loading').fadeOut(100);
    });
    video.on('waiting', function() {
        $('.psVideo-loading').fadeIn(100);
    });
    video.on('ended', function() {
        if (!loop){
            videoIndex += 1;
        }
        if(videoIndex == videoListLen){
            videoIndex = 0;
        }
        for(var i =0; i < videoListLen; i++){
            $('.player-list-video').eq(i).removeClass('video-now');
        }
        $('.player-list-video').eq(videoIndex).addClass('video-now');
        qiehuan();

    });

    $('.psVideo').hover(function() {
        showControl(true);
    }, function() {
        showControl(false);
    });
    // 判断鼠标是否在控制区，进入和出去改变isOn值，来触发是否开启延时函数
    $('.psVideo-shade').hover(function() {
        isOn = false;
    }, function() {
        isOn = true;
    });
    $('.player-list').hover(function() {
        isOn = false;
    }, function() {
        isOn = true;
    });
    $('body').on('mousemove', function () {
        fillShow();
    });
    $('.psVideo-play-one').on('click', function () {
        playAndPause();
    });
    $('.psVideo-play-btn').on('click', function () {
        if (!full || !hidding){
            playAndPause();
        }
    });
    $('.all').on('click', launchFullScreen); // 全屏
    $('#currentTime').text(timeFormat(0)); // 初始化时间
    $('#duration').text(timeFormat(video[0].duration)); // 初始化时间
    enableProgressDrag(); // 进度条拖动
    enableSoundDrag(); // 初始化声音拖动
    playSpeed(videoSpeed); // 初始化播放速度
    $('#speed1Btn').on('click', function() {
        playSpeed(1); // 1倍速
    });
    $('#speed2Btn').on('click', function() {
        playSpeed(2);
    });
    $('#speed05Btn').on('click', function() {
        playSpeed(0.5);
    });
    //  阻止事件冒泡
    $('.sound-list').bind("click",function(event){
        event.stopPropagation(); //  阻止事件冒泡
    });
    $('.konge').bind("click",function(event){
        event.stopPropagation(); //阻止事件冒泡
    });
    $('#soundBtn').on('click',soundAndMute); // 静音
    $('#loop').on('click', isloop); // 循环播放
    video.on('click', function () {
        doOnClick(); // 点击播放暂停
    });
    video.on('dblclick', function () {
        doOnDblClick(); //双击全屏
    });
    $('.psVideo-dan-btn').on('click', function () { //弹幕开关
        danOn(); //弹幕开关
    });
    $(window).keypress(function(e) { //键盘事件
        var isFocus = $(".psVideo-dan-input").is(":focus"); //判断是否获取焦点
        var isControl = $('.psVideo-shade').hasClass('psVideo-shade-off'); // 判断控制区是否隐藏
        if (e.keyCode == 0 || e.keyCode == 32){ // 空格
            if(!isFocus || isControl){
                playAndPause();
            }
        }
        if (e.keyCode == 13){ //回车
            if(isFocus){
                danOn(); // 发送弹幕
            }
        }
    });
    $(window).keydown(function(e) {
        keyTime(e.keyCode); //快进快退
    });
    $('.player-list-video').on('click', function () {
        if (!full || !hidding){
            videoIndex = $(this).index(); //获取当前点击的视频索引
            for(var i =0; i < videoListLen; i++){ //清除所有视频的选中状态
                $('.player-list-video').eq(i).removeClass('video-now'); //清除所有视频的选中状态
            }
            $(this).addClass('video-now'); //给当前点击的视频添加选中状态
            qiehuan(); //切换视频
        }
    });
})(jQuery);
