let socket;
const Server = "127.0.0.1:8080/test";
function log(id,value){
    $("#"+id).text(value);
}
if(typeof(WebSocket) == "undefined") {
    console.log("您的浏览器不支持WebSocket");
}else{
    console.log("您的浏览器支持WebSocket");
    //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
    socket = new WebSocket("ws://" + Server);
    //打开事件
    socket.onopen = function() {
        console.log("Socket 已打开");
        log("ServerName",Server);
        log("ServerStatus","正常连线中")
        let data = {
            cmd:"getAllMsg",
            data:{

            }
        };
        data = JSON.stringify(data);
        socket.send(data);
        log("ServerHelp","调试窗口:发送了"+data);
    };
    //获得消息事件-接收到服务端消息
    socket.onmessage = function(msg) {
        console.log(msg.data);
        log("ServerHelp","调试窗口:收到了"+msg.data);
        //发现消息进入开始处理前端触发逻辑
        let data = JSON.parse(msg.data);
        switch (data.cmd){
            case "addMsg": {
                data = data.data;
                let contentDiv = $("#con-1");
                contentDiv.append("<div class=\"row a-content\">");
                contentDiv.append(
                    "" +
                    "<div class=\"lined\">\n" +
                    "<p class=\"text-success\">\n" +
                    "2022-06-01 10:36:20\n" +
                    "</p>\n" +
                    "</div>");
                contentDiv.append(
                    " <div class=\"linet\">\n" +
                    " <a onclick=\"user('999');\">" + data.name + "</a>\n" +
                    " <b onclick=\"oneChat('" + data.name + "',socket)\">私信</b>\n" +
                    " </div>"
                );
                contentDiv.append(
                    " <div class=\"c-pic\">\n" +
                    " <img src=\"http://www.hanyun.tk/tx/null.png\" class=\"img-rounded\" onclick=\"aite('一笑而过','999','1654050980');\">\n" +
                    " </div>"
                );
                contentDiv.append(
                    " <div class=\"c-msg\">\n" +
                    " <font style=\"color:rgb(0,0,0);\">\n" + data.msg +
                    "</div>" +
                    "</div>"
                );
                break;
            }
            case "addOneMsg":{
                    data = data.data;
                    let contentDiv = $("#con-2");
                    contentDiv.append("<div class=\"row a-content\">");
                    contentDiv.append(
                        ""+
                        "<div class=\"lined\">\n" +
                        "<p class=\"text-success\">\n" +
                        "2022-06-01 10:36:20\n" +
                        "</p>\n" +
                        "</div>");
                    contentDiv.append(
                        " <div class=\"linet\">\n" +
                        " <a onclick=\"user('999');\">"+data.name+"</a>\n" +
                        " </div>"
                    );
                    contentDiv.append(
                        " <div class=\"c-pic\">\n" +
                        " <img src=\"http://www.hanyun.tk/tx/null.png\" class=\"img-rounded\" onclick=\"aite('一笑而过','999','1654050980');\">\n" +
                        " </div>"
                    );
                    contentDiv.append(
                        " <div class=\"c-msg\">\n" +
                        " <font style=\"color:rgb(0,0,0);\">\n" + data.msg +
                        "</div>" +
                        "</div>"
                    );
                    break;
            }
            case "keepOneChat":{
                data = data.data;
                let friendDiv = $(".my-friend");
                friendDiv.html("");
                friendDiv.append(
                    "<div class=\"row a-friend\">\n" +
                        "<div class=\"col-lg-3 f-pic\">\n" +
                            "<img class=\"img-circle\" src=\"http://www.hanyun.tk/tx/null.png\">" +
                        "</div>\n" +
                        "<div class=\"col-lg-9 f-info\">\n" +
                            "<div class=\"f-name\">\n" +
                                data.name+ "\n" +
                            "</div>\n" +
                            "<div class=\"f-news\" >\n" +
                                data.oldMsg + "\n" +
                            "</div>\n" +
                        "</div>\n" +
                    "</div>");
                $("#title1").css("display","none");
                $("#con-1").css("display","none");
                $("#title2").text(data.name);
                $("#title2").css("display","block");
                $(".bt-send").attr("onclick","").click(function()
                {
                    sendOneMsg(socket);
                });

                $("#con-2").css("display","block");
                break;
            }
            default:
                break;
        }
    };
    //关闭事件
    socket.onclose = function() {
        log("ServerStatus","已断线");
        console.log("Socket已关闭");
    };
    //发生了错误事件
    socket.onerror = function(error) {
        log("ServerStatus","配置错误")
    }
}
function sendMsg(socket){
    let name = GetQueryString("name");
    if (name !=null && name.toString().length>1)
    {
        let msg = $("#text-con").html();
        let data = {
            cmd:"sendMsg",
            data:{
                name:name,
                msg:msg
            }
        };
        socket.send(JSON.stringify(data));
    }
}
function sendOneMsg(socket){
    let name = $("#title2").text();
    if (name !=null && name.toString().length>1)
    {
        let msg = $("#text-con").html();
        let data = {
            cmd:"sendOneMsg",
            data:{
                name:name,
                msg:msg
            }
        };
        socket.send(JSON.stringify(data));
    }
}
function oneChat(name,socket){
    let data = {
        cmd:"creatOneChat",
        data:{
            name:name
        }
    }
    socket.send(JSON.stringify(data));

}
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
    if(r!=null)return  unescape(r[2]); return null;
}
function display(id){
    let item = $("."+id);
    if( item.css("display") == "none" )
        item.css("display","")
    else
        item.css("display","none")

}
function textz(src){
    let item = "<img src='"+src+"' >";
    $("#text-con").append(item);
}