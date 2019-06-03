$(function(){
	var W=$(window).width(); // 윈도우 가로 너비
	var H=$(window).height(); // 윈도우 세로 높이
	var total=3; // 영역 개수 설정
	var timer; // resize event시 연속 동작 방지 변수	
	var pos=0; // scroll event시 가로 이동량 변수
	var count=0; // wheel 동작 횟수
	var loading; // loding timer
	var moving=false; // scroll시 움직임 체크
	var i=0; // loading되는 숫자
	var sign=W/total; // scroll bar fill
	var videoW; // video width
	var myvideo=document.getElementById("myvideo"); // video 호출
	myvideo.muted=true;
	var popup="uncheck"; // popup 활성화 체크
	
	/* scrollbar Plugin */
	$(".popup").mCustomScrollbar();
	
	$('.loading').css({"line-height":H+"px"});
	/* loding page */
	loading=setInterval(function(){
		
		if(i < 100){
			i+=1;
		}
		else{
			i=100;
			$(".loading").delay(750).slideUp(350);
			clearInterval(loading);
		}
		$(".loading").text(i + "%");
	}, 5);
	
	$(window).resize(function(){
		clearTimeout(timer);
		
		timer=setTimeout(function(){
			W=$(window).width();
			H=$(window).height();
			
			/* CSS */
			$(".wrapper").css({width:W*total});
			$(".loading").css({width:W});
			$(".loading").css({height:H});
			$(".scroll_bar .sign").css({width:sign});
			$("section").css({width:W});
			$("section").css({height:H});
			$(".inner").css({height:H});
			$(".loding").css({"line-height":H});
			
			/* video */
			$("#home video").css({height:H});
			videoW=$("#home video").width();
			if(videoW >= W){
				$("#home video").removeAttr("style").css({height:H, "margin-left":videoW/2*(-1)});
			}
			else{
				$("#home video").removeAttr("style").css({width:W, height:"auto", "margin-left":"-50%"});
			}
			
			/* responsive */
			if(W < 1480){
				
			}
			else if(W < 1180){
				
			}
			else if(W < 640){
				
			}
			else{
				$(".scroll_bar").css({display:non});
			}
			
			$("html, body").scrollLeft(W*count); // resize시 스크롤 위치 오류 보정
		}, 50);
	});
	
	 /* 접근성 */
	$(".skip_nav a").focusin(function(){
		$(this).animate({top:0}, 300);
	});
	$(".skip_nav a").focusout(function(){
		$(this).animate({top:-45}, 300);
	});
	
	$(".wrapper").mousewheel(function(e, delta){
		if(moving == true){
			return false; // 연속 동작 방지
		}
		if(popup == "check"){
			return false; // popup 활성화 시 명령을 리턴
		}
		if(W < 640){
			return false; // 가로 640px 이하 시 명령을 리턴
		}
			
		if(delta < 0){	// DOWN and +content
			if(count < (total-1)){ 	//count가 total 범위보다 작을 때
				count+=1; 		// count 증가
			}
			else{				// count가 total 범위를 넘어서면 
				return false; 	// 명령을 리턴
			}
		}
		else{ // UP and -content
			if(count > 0){ 		//count가 0보다 클 때
				count-=1; 		//count 감소
			}
			else{				// count가 0 이하로 떨어지면
				return false;	// 명령을 리턴
			}
		}
		console.log(count);
		
		pageScroll()
	});
	
	/* GNB 이동 */
	$("#GNB li").click(function(e){
		e.preventDefault();
		count=$(this).index();
		
		pageScroll()
	});
	
	/* popup window */
	$(".more").click(function(e){
		e.preventDefault();
		
		$(this).parent().parent().find(".popup").show();
		$(".dim").show();
		
		popup="check";
	});
	$(".close").click(function(e){
		e.preventDefault();
		
		$(".popup").hide();
		$(".dim").hide();
		
		popup="uncheck";
	});
	
	/* mousewheel Fn */
	function pageScroll(){
		/* page active class 부여 */
		$("section").removeClass("active");
		$("section.page" + count).addClass("active");
		
		pos=count*W;
		var readyW=$(".ready").width();
		moving=true; // 상태 점검 변수에 true를 부여
		$(".ready").animate({left:0}, 50);
		$(".ready").hide();
		$("section.active .ready").show();
		$("section.active .ready").animate({left:-readyW}, 200, function(){
			$("html, body").animate({scrollLeft:pos}, 800);
			$("#GNB li").removeClass("active");
			$("#GNB li").eq(count).addClass("active");
			moving=false;
		});
		
		if($("#about").hasClass("active") == true){
			infoTrue();
			workFalse();
		}
		else if($("#work").hasClass("active") == true){
			infoFalse();
			workTrue();
		}
		else{
			infoFalse();
			workFalse();
		}
		
		sign=(W-20)/total;
		sign=sign*(count+1);
		$(".scroll_bar .sign").animate({width:sign}, 1000);
	};
	
	/* content animation Fn for mousewheel */
	function infoTrue(){ // #info 활성화
		$("#about .preview").show();
		$("#about .preview span").delay(1350).animate({top:-38}, 300, function(){
			$("#about .preview").delay(450).animate({top: "-100%"}, 300, function(){
				$(this).hide();
				$("#about .inner").delay(100).css({opacity:1});
				$("#about .title").animate({left:0}, 300);
			});
		});
	};
	function infoFalse(){ // #info 상태 복구
		$("#about .preview span").animate({top:0});
		$("#about .preview").css({top:0});
		$("#about .inner").delay(100).css({opacity:0})
		$("#about .title").css({left:-400});
	};
	function workTrue(){ // #work 활성화
		$("#work .first").delay(600).animate({left:0}, 500);
		$("#work .second").delay(700).animate({left:0}, 800);
		$("#work .third").delay(750).animate({left:0}, 900);
	};
	function workFalse(){ // #work 상태 복구
		$("#work .first").delay(1000).animate({left:700}, 100, function(){
			$("#work .second").css({left:1000});
			$("#work .third").css({left:1100});
		});
	};
	
	pageScroll(); // mousewheel trigger
	$(window).trigger("resize");
});