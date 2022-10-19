
[r: args = macro.args]
[r: express = json.get(args,"toRoll")]
[h: expression = replace(express," ", "")]

[h: parsing = 1]
[h: start=0]
[h: end=1]
[h: tokens = ""]
[h: l = length(expression)]
[h, while(end <= l), code:{
	[h: new = substring(expression,end-1,end)]
	
	[h, if(new=="+" || new=="-"), code : 
	{
		[h: sub = substring(expression,start,end-1)]
		[r: tokens=listappend(tokens,sub)]
		[r: tokens=listappend(tokens,new)]
		[h: start= end]
		};{}]
	[h, if(end == (l)), code:{
		[h: sub = substring(expression,start,end)]
		[h: tokens=listappend(tokens,sub)]
		};{} ]
	[h: end=end+1]
	}]
[h: "<br>token before rolling: "+tokens+"   nbr: " +listCount(tokens,',')+"<br>"]
[h: tokensb = ""]
[h, for(index, 0 , listCount(tokens,",")),code: {
	[h: tok = listget(tokens,index)]
	[r: "testing "+index]
	[h: localstuff = stringToList(tok, "d")]
	[r,if(listcount(localstuff)>1),code:{
		[h:newTok = ""]
		[r: "this is rollable "]
		[h:dice = listget(localstuff,1)]
		[h:num = listget(localstuff,0)]
		[r,COUNT(number(num)-1): newTok = newTok + "d"+dice + ",+,"]
		[r: tok = newTok+"d"+dice]		
	};{}]
	[h:tokensb=listappend(tokensb,tok)]
}]

[h: "<br>endtokens: "+tokensb+"<br>"]
[h:tokensc=""]
[h:display=""]
[h,COUNT(listCount(tokensb,",")),code:{ 
	[h: tok = listget(tokensb,roll.count)]
	[if(startswith(tok,"d")),code:{
		[dice = substring(tok, 1)]
		[h: rollresult = roll(1,dice)]
		[h, if(rollresult==dice):color="Green";color="Black"]
		[h, if(rollresult==1):color="Red"]
		[r: str= strformat('<span style="font-weigth:Bold;color:%{color};">%{rollresult}</span>')]
		[tokensc=tokensc+rollresult]
		[display=display+str]
	};{
		[tokensc=tokensc+tok]
		[display=display+tok]
	}]
}]
[h: "<br>endtokens: "+tokensc+"<br>"]
[h: rollResult = listFormat(tokensc, "%list", "%item", "") ]
[h: endresult = eval(rollResult+"+0")]
[H: tt = "<html><p>" + display + "</p></html>"]
[H: tt = replace(tt,'"',"&quot;")]
[h: htmlOutput = strformat('<span title="%{tt}">%{endresult}</span>')]
[h: broadcast("rolling "+express+": " + htmlOutput)]
