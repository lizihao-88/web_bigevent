$(function () {
    var layer = layui.layer
    var form = layui.form

    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)
        const y = dt.getFullYear()
        const m = padZero(dt.getMonth() + 1)
        const d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss

    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    var q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) return layer.msg("获取文章列表失败！")
                var htmlStr = template('tpl-Table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) return layer.msg('获取文章分类列表失败！')
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        q.cate_id = $('[name=cate_id').val()
        q.state = $('[name=state]').val()
        initTable()
    })

    function renderPage(total) {
        var laypage = layui.laypage

        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total //数据总数，从服务端得到
            , curr: q.pagenum
            , limit: q.pagesize
            , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
            , limits: [2, 3, 5, 10]
            , jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                q.pagenum = obj.curr //得到当前页，以便向服务端请求对应页的数据。
                q.pagesize = obj.limit//得到每页显示的条数

                //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });
    }

    
    $('body').on('click', '.btn-delete', function (e) {
        var id = $(this).attr('data-id')
        var len = $('.btn-delete').length
        e.preventDefault()
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if(res.status !==0) return layer.msg('删除失败！')
                    layer.msg('删除成功！')

                    if(len ===1){
                        q.pagenum = q.pagenum ===1? 1:q.pagenum-1
                    }
                    initTable()
                }
            })
            layer.close(index); 
        });
    })

    $('body').on('click', '.btn-edit', function() {
        location.href = '/article/art_pub.html'
      })

})