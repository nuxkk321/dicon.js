/*
 * https://github.com/nuxkk321/dicon
 */
(function($) {
    "use strict";
    var plugin_name='dicon';
    if(typeof(self[plugin_name])=='function') return false;


    /**
     * 开始绘制,以下所有单位均为px
     * @param ctx
     * @param path 路径参数
     * @param start 起点坐标
     * @param length 每一步绘制的长度
     * @private
     */
    function _cdraw(ctx,path,start,length){
        if(!length) length=1;
        if(!start) start=[0,0];
        var now=[0,0];
        var direct_fix=[[0,0],
            [-1, 1],[0, 1],[1, 1],
            [-1, 0],[0, 0],[1, 0],
            [-1,-1],[0,-1],[1,-1]
        ];
        var arc_fix=[[0,0],
            [7,3],[6,2],[5,1],
            [0,4],[0,0],[4,0],
            [1,5],[2,6],[3,7]
        ];
        ctx.beginPath();
        ctx.moveTo(start[0],start[1]);
        for(var x in path){
            var p=path[x];/*格式为[方向,步数,类型]*/
            var d=direct_fix[p[0]];/*方向修正值*/
            now[0]+=p[1]*d[0];/*x坐标的新位置*/
            now[1]+=p[1]*d[1];/*y坐标的新位置*/
            if(p[2]){/*画弧,1:顺时针,2:逆时针;半径为 步数x步长/2 */
                var c=[(now[0]-p[1]*d[0]/2)*length,(now[1]-p[1]*d[1]/2)*length,p[1]*length/2];/*圆心xy坐标和半径*/
                var fix=arc_fix[p[0]];/*起始弧度和终点弧度修正值*/
                ctx.arc(start[0]+c[0],start[1]+c[1],c[2],Math.PI*fix[0]/4,Math.PI*fix[1]/4,p[2]==2);
            }else{/*画直线*/
                ctx.lineTo(start[0]+now[0]*length,start[1]+now[1]*length);
            }
        }
        ctx.closePath();
        ctx.fill();
    }

    function init_draw(options,canvas,prefab){
        if(!prefab) prefab={};

        if(!canvas){
            canvas=document.createElement('canvas');
        }
        canvas.width = prefab.width || options.width;
        canvas.height = prefab.height || options.height;

        var ctx=canvas.getContext('2d');
        

        var step_list=prefab.step_list || options.step_list;
        for(var i in step_list){
            var step_info=step_list[i];
			
			ctx.fillStyle=step_info.fillStyle || '#000';
            if(step_info.path_list || step_info.start_list){
                /*有多个步骤,且分别设置了 path_list 或 start_list*/
            }else if(step_info.path_start_list){
                /*有多个步骤,且将path和start一起组合成数组*/
                for(var x in step_info.path_start_list){
                    var v=step_info.path_start_list[x];
                    _cdraw(ctx,v[0],v[1],step_info.length);
                }
            }else{
                /*只有一个步骤*/
                _cdraw(ctx,step_info.path,step_info.start,step_info.length);
            }

        }
        return canvas.toDataURL("image/png");
    }



    var prefab={};
    prefab["add-lg"]={
        width:170,
        height:170,
        step_list:[
            {
                path:[
                    [8,3],[6,2,1],
                    [2,3],[6,3],[2,2,1],
                    [4,3],[2,3],[4,2,1],
                    [8,3],[4,3],[8,2,1]
                ],
                start:[85-8,85-8],
                length:8
            },
            {
                path_start_list:[
                    [
                        [[8,2,2],[4,4],[2,4],[6,2,2],[8,2]],
                        [85-12*5,85-14*5]
                    ],
                    [
                        [[8,2,1],[6,4],[2,4],[4,2,1],[8,2]],
                        [85+12*5,85-14*5]
                    ],
                    [
                        [[2,2,1],[4,4],[8,4],[6,2,1],[2,2]],
                        [85-12*5,85+14*5]
                    ],
                    [
                        [[2,2,2],[6,4],[8,4],[4,2,2],[2,2]],
                        [85+12*5,85+14*5]
                    ],
                    [
                        [[2,2,2],[6,3],[8,2,2]],
                        [85-6*5,85-16*5]
                    ],
                    [
                        [[2,2,2],[6,3],[8,2,2]],
                        [85+3*5,85-16*5]
                    ],
                    [
                        [[2,2,2],[6,3],[8,2,2]],
                        [85-6*5,85+14*5]
                    ],
                    [
                        [[2,2,2],[6,3],[8,2,2]],
                        [85+3*5,85+14*5]
                    ],
                    [
                        [[4,2,2],[2,3],[6,2,2]],
                        [85-14*5,85-6*5]
                    ],
                    [
                        [[4,2,2],[2,3],[6,2,2]],
                        [85-14*5,85+3*5]
                    ],
                    [
                        [[4,2,2],[2,3],[6,2,2]],
                        [85+16*5,85-6*5]
                    ],
                    [
                        [[4,2,2],[2,3],[6,2,2]],
                        [85+16*5,85+3*5]
                    ]
                ],
                length:5
            }
        ]
    };

	prefab["close-lg"]=function(){
		var cross_length=34;
		var cross_width=3;
		var cross_lt=[32,32];
		//todo::位置有点不对
		var step_list=[
			{
				path:[
					[2,64,1],
					[8,64,1]
				],
				start:[32,0],
			},
			{
				path:[
					[1,cross_width],
					[3,cross_length],
					[9,cross_width]
				],
				start:[16.5,13],
				fillStyle:'#fff'
			},
			{
				path:[
					[3,cross_width],
					[1,cross_length],
					[7,cross_width]
				],
				start:[47.5,13],
				fillStyle:'#fff'
			},
		];
		 
		return {
			width:64,
			height:64,
			step_list:step_list
		};
	};
    /**
     * 入口方法
     * @param cfg
     * @param canvas
     * @returns {*}
     */
     self[plugin_name]=function(cfg,canvas){
         if(typeof(cfg)=='string'){
             cfg={
                 prefab:cfg
             };
         }
         var options={width:0,height:0,prefab:''};
         for(var x in cfg){
             options[x]=cfg[x];
         }

         var prefab_data=prefab[options.prefab];
         if(typeof(prefab_data)=='function'){
             prefab_data=prefab_data(options);
         }

         return init_draw(options,canvas,prefab_data);
     };
})();