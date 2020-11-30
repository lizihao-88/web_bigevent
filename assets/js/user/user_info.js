$(function(){
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname:function(value) {
            if(value.length > 6){
                return '昵称长度必须在1~6个字符之间!'
            }
        }
    })

    initUserinfo()
    //初始化用户信息
    function initUserinfo(){
        $.ajax({
            method:'GET',
            url:'/my/userinfo',
            success:function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                } 
                form.val('formUserinfo',res.data)
            }
        })
    }

    $('#btnReset').on('click',function(e){
        e.preventDefault()
        initUserinfo()
    })

    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/userinfo',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0) return layer.msg('修改用户信息失败！')
                layer.msg('更新用户信息成功')
                
                //子页面调父页面的函数
                window.parent.getUserInfo()
            } 
        })
    })
})