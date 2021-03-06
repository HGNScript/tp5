$(function() {
    excel();
    page();

    $('.grade').change(function() {
        var arr = $('.grade');
        var data = {}
        $.each(arr, function(index, array) {
            data[index] = $(this).val();
        })

        layui.use('laypage', function() {
            var laypage = layui.laypage;
            $.ajax({
                type: "post",
                url: '/teacher/Classlist/selectData',
                traditional: true,
                dataType: "json",
                data: data,
                beforeSend: function(){
                    index = parent.layer.load()
                },
                success: function(data) {

                    parent.layer.close(index)

                    dataAll = data

                    classSelectData = data['data']
                    specialtys = data['specialtys']

                    var len = data['data'].length

                    laypage.render({
                        elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
                            ,
                        count: len, //数据总数，从服务端得到
                        limit: 10,
                        jump: function(obj, first) {

                                if (obj.curr > 1) {

                                    var start = obj.curr * obj.limit-obj.limit

                                    var data = classSelectData.slice(start, obj.curr * obj.limit)
                                }

                                if (obj.curr == 1) {
                                    var start = 0

                                    var data = classSelectData.slice(start, start+obj.limit)
                                }


                                $("#tbody").empty();
                                var data_html = "";
                                $.each(data, function(index, array) {
                                    data_html += html(array)
                                });
                                $("#tbody").append(data_html);

                                $("#specialty").empty();
                                var specialty_html = `<option value=''>专业</option>`

                                Object.keys(specialtys).forEach(function(key){

                                    if (dataAll['specialty'] == specialtys[key]) {
                                        specialty_html += `<option value="`+specialtys[key]+`" class="option" selected="selected">`+specialtys[key]+`</option>`

                                    } else {
                                        specialty_html += `<option value="`+specialtys[key]+`" class="option">`+specialtys[key]+`</option>`

                                    }

                                });  


                                $("#specialty").append(specialty_html);

                                $('.layui-unselect').not('.header').click(function() {
                                    $(this).toggleClass('layui-form-checked')
                                })


                                checkbox()

                        }
                    });
                }
            })
        });
    })

    $("#search").click(function() {
        var str = $('#input').val()
        if (!str) {
            layer.msg('请填写您要查询的数据', {
                icon: 2, //提示的样式
                time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
                end: function() {
                    layer.closeAll('dialog')
                }
            });
            return 0
        }
        search()
    })
    $('#input').keypress(function(event) {
        var keynum = (event.keyCode ? event.keyCode : event.which);
        if (keynum == '13') {
            var str = $('#input').val()
            if (!str) {
                layer.msg('请填写您要查询的数据', {
                    icon: 2, //提示的样式
                    time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
                    end: function() {
                        layer.closeAll('dialog')
                    }
                });
                return 0
            }
            search();
        }
    });
    $('#renovate').mouseover(function() {
        $('#renovate i').addClass('layui-anim layui-anim-rotate layui-anim-loop')
    })
    $('#renovate').mouseout(function() {
        $('#renovate i').removeClass('layui-anim layui-anim-rotate layui-anim-loop')
    })
    $('#renovate').click(function() {
        location.href = "/teacher/Classlist/index"
    })

})

function page() {
    layui.use(['laypage', 'layer'], function() {
        // var layer = layui.layer;
        var laypage = layui.laypage;

        $.ajax({
            type: "get",
            url: '/teacher/Classlist/indexLen',
            traditional: true,
            dataType: "json",
            beforeSend: function(){
                index = parent.layer.load()
            },
            success: function(data) {
                parent.layer.close(index)

                classData = data

                var len = data.length

                laypage.render({
                    elem: 'test1' //注意，这里的 test1 是 ID，不用加 # 号
                        ,
                    count: len, //数据总数，从服务端得到
                    limit: 10,
                    jump: function(obj, first) {

                        if (obj.curr > 1) {

                            var start = obj.curr * obj.limit-obj.limit

                            var data = classData.slice(start, obj.curr * obj.limit)
                        }

                        if (obj.curr == 1) {
                            var start = 0

                            var data = classData.slice(start, start+obj.limit)
                        }


                        $("#tbody").empty();
                        var data_html = "";
                        if (!data.length > 0) {
                            layer.confirm('还没有班级数据,请添加!', function() {
                                // location.href="/teacher/Admin/addAdmin";\
                                layer.closeAll('dialog')
                                // x_admin_show('添加用户', 'addAdmin')
                            });
                        } else {
                            $.each(data, function(index, array) {
                                data_html += html(array)
                            });
                        }

                        $("#tbody").append(data_html);
                        $('.layui-unselect').not('.header').click(function() {
                            $(this).toggleClass('layui-form-checked')
                        })

                        checkbox();

                    }
                });
            }
        })
    });
}

function member_del(obj, id) {
    layer.confirm('确认要删除吗？', function(index) {
        class_id = {}
        class_id[0] = id
        $.ajax({
            type: "post",
            url: '/teacher/Classlist/del',
            traditional: true,
            dataType: "json",
            data: class_id,
            success: function(data) {
                console.log(data)
                if (data['valid']) {
                    layer.msg('删除成功', {
                        icon: 1, //提示的样式
                        time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
                        end: function() {
                            // location.href = "/teacher/Classlist/index"
                            page();
                        }
                    });
                } else {
                    layer.msg('删除失败', {
                        icon: 2, //提示的样式
                        time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
                        end: function() {
                            // location.href = "/teacher/Classlist/index"
                            page();
                        }
                    });
                }

            }
        })
        // $(obj).parents("tr").remove();
        // layer.msg('已删除!', { icon: 1, time: 1000 });
    });
}

function excel() {
    layui.use('upload', function() {
        var upload = layui.upload;

        //执行实例
        var uploadInst = upload.render({
            elem: '#excel2' //绑定元素
                ,
            url: '/teacher/Classlist/excel' //上传接口
                ,
            accept: 'file',
            field: 'excel',
            before: function() {
                load = layer.load()
            },
            done: function(data) {
                layer.close(load)
                if (data['valid']) {
                    layer.msg(data['msg'], {
                        icon: 6, //提示的样式
                        time: 1500, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
                        end: function() {
                            location.reload()
                        }
                    });
                } else {
                    layer.msg(data['msg'], {
                        icon: 5, //提示的样式
                        time: 1500, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
                        end: function() {
                            // location.href = "/teacher/Classlist/index"
                            page()
                        }
                    });
                }
            },
        });
    });
}

function checkbox() {
    $('.checkbox').click(function() {
        var checkbox = $('.checkbox')
        var flag = false;
        var arr = [];
        checkbox.each(function(item) {
            var c = $(this).attr('class')
            arr[item] = c
        })
        var flag = arr.every(function(item) {
            return item == "checkbox layui-unselect layui-form-checkbox layui-form-checked"
        })
        if (flag) {
            $('.header').addClass('layui-form-checked')
        } else {
            $('.header').removeClass('layui-form-checked')
        }

    })
}

function delAll(argument) {
    var id = tableCheck.getData()
    if (!id.length) {
        layer.msg('请选择要删除的数据', {
            icon: 2, //提示的样式
            time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
            end: function() {
                layer.closeAll('dialog')
            }
        });
        return 0
    }
    layer.confirm('确认要删除吗？', function(index) {
        var id = tableCheck.getData()
        var class_id = {};
        id.forEach(function(item, index) {
            class_id[index] = item
        })
        $.ajax({
            type: "post",
            url: '/teacher/Classlist/del',
            traditional: true,
            dataType: "json",
            data: class_id,
            success: function(data) {
                layer.msg('删除成功', {
                    icon: 1, //提示的样式
                    time: 1000, //2秒关闭（如果不配置，默认是3秒）//设置后不需要自己写定时关闭了，单位是毫秒
                    end: function() {
                        $('.header').removeClass('layui-form-checked')
                        page()
                    }
                });
            }
        })
    });
}

function search() {
    var info = $("#input").val();
    layui.use('laypage', function() {
        var laypage = layui.laypage;

        $.ajax({
            type: "post",
            url: '/teacher/Classlist/searchLen',
            traditional: true,
            dataType: "json",
            data: { 'info': info },
            beforeSend: function(){
                index = layer.load()
            },
            success: function(data) {
                layer.close(index)

                var len = data.length

                searchData  = data

                laypage.render({
                    elem: 'test1',
                    count: len, //数据总数，从服务端得到
                    limit: 4,
                    jump: function(obj, first) {

                        if (obj.curr > 1) {

                            var start = obj.curr * obj.limit-obj.limit

                            var data = searchData.slice(start, obj.curr * obj.limit)
                        }

                        if (obj.curr == 1) {
                            var start = 0

                            var data = searchData.slice(start, start+obj.limit)
                        }


                        $("#tbody").empty();
                        var data_html = "";
                        $.each(data, function(index, array) {
                            data_html += html(array)
                        });


                        $("#tbody").append(data_html);
                    }
                });
            }
        })
    });
}


function html(array) {
    var data_html = '';
        return data_html += `<tr>
            <td>
                <div class="checkbox layui-unselect layui-form-checkbox" lay-skin="primary" data-id="` + array['class_id'] + `"><i class="layui-icon">&#xe605;</i></div>
            </td>
            <td>` + array['class_name'] + `</td>
            <td>` + array['class_grade'] + `</td>
            <td>` + array['class_staffRoom'] + `</td>
            <td>` + array['class_specialty'] + `</td>
            <td>` + array['sum'] + `</td>
            <td>` + array['tch_name'] + `</td>
            <td>` + array['tch_phone'] + `</td>
            <td class="td-manage">
            <a title="班级信息" onclick="x_admin_show('负责班级','/teacher/Checkc/index?class_id=` + array['class_id'] + `')" href="javascript:;">
                <i class="layui-icon">&#xe63c;</i>
              </a>
                <a title="编辑信息" href="/teacher/Classlist/edit?class_id=` + array['class_id'] + `">
                <i class="layui-icon">&#xe639;</i>
              </a>
                        <a title="删除" onclick="member_del(this,'` + array['class_id'] + `')" href="javascript:;">
                <i class="layui-icon">&#xe640;</i>
              </a>
                    </td>
                </tr>`;
    }