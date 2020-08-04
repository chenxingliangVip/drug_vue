export function validatorWork(works) {
  let currentWork = null;
  let AWork = works[0];
  let BWork = works[1];
  currentWork = getWorkTime(AWork);
  if(!currentWork){
    currentWork = getWorkTime(BWork);
  }
  if(!currentWork){
    let now = new Date();
    let nowTime = now.getHours()*3600+now.getMinutes()*60+now.getSeconds();
    let secondTimeArray = getTimeSecond(AWork);
    if(nowTime > secondTimeArray[secondTimeArray.length-1] ){
      currentWork = BWork;
    }
    if(nowTime < secondTimeArray[0]){
      currentWork = AWork;
    }
  }
  return currentWork;
}

function getWorkTime(work) {
  let currentWork = null;
  let secondTimeArray = getTimeSecond(work);
  let now = new Date();
  let nowTime = now.getHours()*3600+now.getMinutes()*60+now.getSeconds();
  if(secondTimeArray.length == 2&&nowTime>= secondTimeArray[0]&&nowTime<=secondTimeArray[1]){
    currentWork = work;
  }else if(secondTimeArray.length == 4&&((nowTime>= secondTimeArray[0]&&nowTime<=secondTimeArray[1])
     ||(nowTime>= secondTimeArray[2]&&nowTime<=secondTimeArray[3]))){
    currentWork = work;
  }
  return currentWork;
}

function getTimeSecond(work) {
  let AStartTimeSplit = work.startTime.split(":");
  let AEndTimeSplit = work.endTime.split(":");
  let AStartTime = parseInt(AStartTimeSplit[0])*3600+parseInt(AStartTimeSplit[1])*60+parseInt(AStartTimeSplit[2]);
  let AEndTime = parseInt(AEndTimeSplit[0])*3600+parseInt(AEndTimeSplit[1])*60+parseInt(AEndTimeSplit[2]);
  if(AEndTime < AStartTime){
    let maxTime = 24*3600;
    return [AStartTime,maxTime,0,AEndTime]
  }
  return [AStartTime,AEndTime];
}


export function getAlphabet() {
  let alphabet = [];
  for (let i = 0; i < 26; i++) {
    alphabet.push(String.fromCharCode((65 + i)));
  }
  return alphabet;
}


export function sortObject(array,prop){
  for(let i = 0; i < Object.keys(array).length; i++){
    for(let j = i+1; j < Object.keys(array).length; j++){
      let data_i =array[i];
      let data_j = array[j];
      data_i[prop] = typeof data_i[prop] == "number"?data_i[prop]:parseInt(data_i[prop]);
      data_j[prop] = typeof data_j[prop] == "number"?data_j[prop]:parseInt(data_j[prop]);
      if(data_i[prop] < data_j[prop]){
        array[i] = array[j];
        array[j] = data_i;
      }
    }
  }
}


export function sortStr(array,prop){
  for(let i = 0; i < array.length; i++){
    for(let j = i+1; j < array.length; j++){
      let copy = Object.assign({},array[i]);
      let data_i =array[i][prop];
      let data_j = array[j][prop];
      if(data_i < data_j){
        array[i] = Object.assign({},array[j]);
        array[j] = copy;
      }
    }
  }
  return array;
}

export function sortS(array,desc){
  for(let i = 0; i < array.length; i++){
    for(let j = i+1; j < array.length; j++){
      let copy = array[i];
      let data_i =array[i];
      let data_j = array[j];
      if(!desc){
        if(data_i > data_j){
          array[i] = array[j];
          array[j] = copy;
        }
      }else{
        if(data_i < data_j){
          array[i] = array[j];
          array[j] = copy;
        }
      }

    }
  }
  return array;
}


export function sortSpecial(array){
  for(let i = 0; i < array.length; i++){
    for(let j = i+1; j < array.length; j++){
      let copy = array[i];
      let data_i =array[i];
      let data_j = array[j];
      let num_i = data_i.replace(/[^0-9]/ig,"");
      let num_j = data_j.replace(/[^0-9]/ig,"");
      if(!num_i){
        num_i = "99";
      }
      if(!num_j){
        num_j = "99";
      }
      if(num_i < num_j){
        array[i] = array[j];
        array[j] = copy;
      }
    }
  }
  return array;
}

export function getLastDay(year, month)
{
  let d = new Date(0);
  if (month == 12)
  {
    d.setUTCFullYear(year + 1);
    d.setUTCMonth(0);
  }
  else
  {
    d.setUTCFullYear(year);
    d.setUTCMonth(month);
  }
  d.setTime(d.getTime() - 1);
  let lastDay = d.getUTCDate();
  let fullDay = year+"-"+ (month < 10?("0"+month):month)+"-"+(lastDay<10?("0"+lastDay):lastDay);
  return fullDay;
}
