$(function () {
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //自定义表单验证属性
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //校验两次密码是否一致
        repwd: function (value) {
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) return "两次密码不一致"
        }
    })

    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        $.post('/api/reguser',{username:$('#form_reg [name=username]').val(),password:$('#form_reg [name=password]').val()},
        function(res){
            if(res.status !== 0) return layer.msg(res.message)
            layer.msg('注册成功,请登录')
            $('/link_login').click()
        })
    })

    //监听登录表单提交事件
    $("#form_login").on('submit',function(e){
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/api/login',
            //快速获取表单数据
            data:$(this).serialize(),
            success:function(res){
                console.log(res);
                if(res.status !== 0) return layer.msg(res.message)
                layer.msg('登录成功')
                localStorage.setItem('token',res.token)
                // window.location = 'index.html'
                location.href = 'index.html'
            }
        })
    })
})