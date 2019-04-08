var studentTable = document.getElementById('student-table-body');

function init() {
    bindEvent();
}

function bindEvent() {
    var dl = document.getElementsByClassName('left-menu')[0];
    dl.addEventListener('click', changeMenu, false);

    // 添加学生表单
    var addSubmitBtn = document.getElementById('add-student-submit');
    addSubmitBtn.addEventListener('click', function (e) {
        updateStudent(e, 'add-student-form', '/api/student/addStudent');
    }, false);

    // 编辑学生表单提交
    var editSubmitBtn = document.getElementById('edit-student-submit');
    editSubmitBtn.addEventListener('click', function (e) {
        updateStudent(e, 'edit-student-form', '/api/student/updateStudent');
    }, false);

    // 表格里点击事件
    studentTable.addEventListener('click', tbodyClick, false);

    // 修改学生mask 点击
    var mask = document.getElementsByClassName('mask')[0];
    mask.addEventListener('click', resetMask, false)
}

function resetMask() {
    var dialog = document.getElementsByClassName('dialog')[0];
    dialog.classList.remove('dialog-active');
}

function changeMenu(e) {
    var tagName = e.target.tagName.toLowerCase();
    if (tagName !== 'dd') {
        return;
    }

    initMenuCss(e.target);
    var contentId = e.target.getAttribute('content-id');
    if (contentId) {
        initContent(contentId);
        if (contentId === 'student-list') {
            renderStudentTable();
        }
    }
}

function initMenuCss(dom) {
    var clearDomArr = document.getElementsByClassName('active');
    for (var i = 0; i < clearDomArr.length; i++) {
        clearDomArr[i].classList.remove('active');
    }
    dom.classList.add('active')

}

function initContent(contentId) {
    var all = document.getElementsByClassName('content');
    for (var i = 0; i < all.length; i++) {
        all[i].classList.remove('content-active');
    }
    var content = document.getElementById(contentId);
    content.classList.add('content-active');

}

function updateStudent(e, formId, path) {
    e.preventDefault();
    var form = document.getElementById(formId);
    var data = buildStudentInfoByForm(form);
    if (!data) {
        return false;
    }
    sendRequest(path, data, function () {
        var confirm = true;
        if (formId === 'add-student-form') {
            confirm = window.confirm('是否返回学生列表页');
        }
        if (confirm) {
            document.getElementById('nav-list').click();
        }
        resetMask();
        form.reset();
    })
}

function sendRequest(path, data, callback) {
    var response = saveData('http://api.duyiedu.com' + path,
        Object.assign(data, {'appkey': 'xuyongliang_1554447217727'}));
    if (response.status && response.status === 'success') {
        if (typeof callback === 'function') {
            callback(response);
        }
    } else {
        alert(response.msg);
    }
    return response;
}

function buildStudentInfoByForm(form) {
    var name = form.name.value;
    var sex = form.sex.value;
    var sNo = form.sNo.value;
    var birth = form.birth.value;
    var phone = form.phone.value;
    var email = form.email.value;
    var address = form.address.value;

    if (!name || !sex || !sNo || !birth || !phone || !email || !address) {
        alert('部分输入为空');
        return false;
    }

    if (!/\d{4,16}/.test(sNo)) {
        alert('学号必须为4-16位的数字组成');
        return false;
    }

    if (!/^\d{4}$/.test(birth)) {
        alert('出生年份必须四位数');
        return false;
    }

    if (!/^1\d{10}$/.test(phone)) {
        alert('输入正确的手机号');
        return false;
    }

    if (!/^[\w\d][\w\d_.]*@[\w\d]+(\.[\w\d_]*)+[\w]$/.test(email)) {
        alert('输入正确的邮箱');
        return false;
    }

    return {
        name: name,
        sex: sex,
        sNo: sNo,
        birth: birth,
        phone: phone,
        email: email,
        address: address,
    }
}

function renderStudentTable() {
    sendRequest('/api/student/findAll', '', function (result) {
        if (!result.data) {
            return
        }
        studentTable.stuData = result.data;
        var appendHtml = '';
        result.data.forEach(function (value, idx) {
            appendHtml += '\n' +
                '                <tr>\n' +
                '                    <td>' + value.sNo + '</td>\n' +
                '                    <td>' + value.name + '</td>\n' +
                '                    <td>' + (value.sex == 0 ? '男' : '女') + '</td>\n' +
                '                    <td>' + value.email + '</td>\n' +
                '                    <td>' + (new Date().getFullYear() - value.birth) + '</td>\n' +
                '                    <td>' + value.phone + '</td>\n' +
                '                    <td>' + value.address + '</td>\n' +
                '                    <td>\n' +
                '                        <button class="btn edit" idx="' + idx + '" >修改</button>\n' +
                '                        <button class="btn del" idx="' + idx + '">删除</button>\n' +
                '                    </td>\n' +
                '                </tr>';
        })
        studentTable.innerHTML = appendHtml;
    })
}

function tbodyClick(e) {
    var tag = e.target.tagName.toLowerCase();
    if (tag !== 'button') {
        return;
    }
    var idx = parseInt(e.target.getAttribute('idx'));
    var stud = studentTable.stuData[idx];

    if (e.target.className.indexOf('edit') >= 0) {
        var dialog = document.getElementsByClassName('dialog')[0];
        var form = document.getElementById('edit-student-form');

        for (var prop in stud) {
            if (form[prop]) {
                form[prop].value = stud[prop];
            }
        }
        dialog.classList.add('dialog-active');
    } else {
        var confirm = window.confirm("确认删除?");
        if (!confirm) {
            return;
        }
        sendRequest('/api/student/delBySno', {'sNo': stud['sNo']},
            function () {
                alert('删除成功');
                document.getElementById('nav-list').click();
            })
    }
}

init();

// 向后端存储数据
function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object') {
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}