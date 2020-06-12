//获取缩放样式
let setScale = () => {
	var width = document.body.clientWidth;
	var height = document.body.clientHeight;
	var scaleX = width / 1920;
	var scaleY = height / 1000;
	var scale = '';
	var mleft = '';

	return {
//		'transform': 'scale(' + scaleX + ',' + scaleY + ')',
		'display': 'block'
	}
};

export default {
	setScale,
};
