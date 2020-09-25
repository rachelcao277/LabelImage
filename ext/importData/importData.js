var importData = (function () {

    function addFeaturesButton() {
        //添加相关css
        // let head = document.getElementsByTagName('head')[0];
        // let link = document.createElement('link');
        // link.type='text/css';
        // link.rel = 'stylesheet';
        // link.href = './ext/importData/importData.css';
        // head.appendChild(link);
        //添加导入按钮
        let assistFeatures = document.querySelector('.assistFeatures');
        let p = document.createElement("p");
        p.setAttribute('class', 'importJson');
        p.setAttribute('title', '导入json标记');
        p.addEventListener('click', function () {
            document.querySelector('.importInput').click();
        })
        assistFeatures.appendChild(p);
        //添加导入input
        var importInput = document.createElement("input");
        importInput.setAttribute('class', 'importInput');
        importInput.setAttribute('type', 'file');
        importInput.setAttribute('accept', '.json,application/json');
        importInput.setAttribute('hidden', 'hidden');
        importInput.addEventListener("change", fileChanged);
        assistFeatures.appendChild(importInput);
    }

    function fileChanged(e) {
        var selectedFile = e.target.files[0];//获取读取的File对象
        var name = selectedFile.name;//读取选中文件的文件名
        var size = selectedFile.size;//读取选中文件的大小
        console.log("文件名:" + name + "大小：" + size);
        var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
        reader.readAsText(selectedFile);//读取文件的内容
        reader.onload = function () {
            //当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
            try {
                let json = JSON.parse(this.result);
                //校验文件内容是否合法
                if (json && json.length > 0 && json[0].content && json[0].contentType) {
                    fromJson(json);
                } else {
                    throw 'JSON文件内容格式错误！';
                }
            } catch (ex) {
                console.error('读取json文件失败，原因：' + ex);
            }

        };
    }

    function fromJson(json) {
        annotate.Arrays.imageAnnotateMemory = json;
        annotate.ReplaceAnnotateShow();
        annotate.RepaintResultList();
        annotate.Arrays.imageAnnotateMemory.forEach((memory, index) => {
            annotate.RecordOperation('add', '绘制', index, JSON.stringify(memory));
        });
    }

    addFeaturesButton();

    return {
        fromJson: fromJson
    }
})()