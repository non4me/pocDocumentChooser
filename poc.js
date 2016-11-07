(function () {
    'use strict';

    var selectedDocs = [];

    onload = createList;
    function createList() {
        var filter = document.querySelector('.document-chooser .search input').value;
        var container = document.querySelector('.document-chooser #list');
        var filteredList = documentList.filter(function (element) {
            return filter ? _removeDiacritics(element.name.toLowerCase()).indexOf(_removeDiacritics(filter.toLowerCase())) > -1 : true;
        });

        var newList = filteredList.map(_createItem);

        container.innerHTML = newList.join('\n');

        function _createItem(item) {
            return document.createElement("div").innerHTML = [
                '<div class="list-item" id="document_' + item.id + '">',
                '<div class="item-name"><span>' + item.name + '</span></div>',
                '<div class="item-count">',
                '<input type="text" value="1"  id="input_' + item.id + '">',
                '<div class="arrows">',
                '<span class="up" id="up_' + item.id + '"></span><span class="down" id="down_' + item.id + '"></span>',
                '</div>',
                '</div>',
                '</div>'
            ].join('\n');
        }

        function _removeDiacritics(s) {
            var r = s.toLowerCase();
            r = r.replace(new RegExp("[àáâãäå]", 'g'), "a");
            r = r.replace(new RegExp("æ", 'g'), "ae");
            r = r.replace(new RegExp("[çč]", 'g'), "c");
            r = r.replace(new RegExp("[èéêë]", 'g'), "e");
            r = r.replace(new RegExp("[ìíîï]", 'g'), "i");
            r = r.replace(new RegExp("[ňñ]", 'g'), "n");
            r = r.replace(new RegExp("[òóôõö]", 'g'), "o");
            r = r.replace(new RegExp("œ", 'g'), "oe");
            r = r.replace(new RegExp("ř", 'g'), "r");
            r = r.replace(new RegExp("š", 'g'), "s");
            r = r.replace(new RegExp("ß", 'g'), "ss");
            r = r.replace(new RegExp("[ùúûüů]", 'g'), "u");
            r = r.replace(new RegExp("[ýÿ]", 'g'), "y");
            r = r.replace(new RegExp("ž", 'g'), "z");
            return r;
        }

    }

    document.querySelector('.document-chooser .navigation .close').addEventListener('click', close);
    function close() {
        document.querySelector('#document-chooser').style.display = 'none';
    }

    document.querySelector('.document-chooser .navigation .choose').addEventListener('click', choose);
    function choose() {
        //TODO: send selectedDocs to server throw REST
        close();
    }

    document.querySelector('.document-chooser .search input').addEventListener('keydown', search);
    function search(event) {
        clearTimeout(updateList);
        var updateList = setTimeout(function () {
            createList();
        }, 300);
    }

    document.querySelector('.document-chooser .list').addEventListener('click', clickDocument);
    function clickDocument(event) {
        var target = event.target.id ? event.target : event.target.parentElement;
        if (target.id) {
            var clickedElement = target.id.split('_');
            var docId = clickedElement[1];
            var elementName = clickedElement[0];
            var docInput = document.querySelector('.document-chooser .list #input_' + docId);

            var indexDoc = -1;
            for (var i = 0, len = selectedDocs.length; i < len; i++) {
                if (selectedDocs[i].id === docId) {
                    indexDoc = i;
                    break;
                }
            }

            if (elementName === 'document') {
                var docCount = docInput.value;

                if (indexDoc === -1) {
                    selectedDocs.push({id: docId, count: docCount});
                    target.classList.add('selected')
                }
                else {
                    selectedDocs.splice(indexDoc, 1);
                    target.classList.remove('selected')
                }
            }
            else if (elementName === 'up') {
                docInput.value = +docInput.value + 1;

                if (selectedDocs[indexDoc]) {
                    selectedDocs[indexDoc].count = docInput.value;
                }
            }
            else if (elementName === 'down') {
                if (+docInput.value > 0) {
                    docInput.value = +docInput.value - 1;

                    if (selectedDocs[indexDoc]) {
                        selectedDocs[indexDoc].count = docInput.value;
                    }
                }
            }
        }
    }

    document.querySelector('.document-chooser .list').addEventListener('keydown', keydownDocument);
    function keydownDocument(event) {
        var target = event.target.id ? event.target : event.target.parentElement;
        if (target.id) {
            var UP = 38;
            var DOWN = 40;

            var docId = target.id.split('_')[1];
            var docInput = event.target;
            var keyCode = event.keyCode || event.which;

            var indexDoc = -1;
            for (var i = 0, len = selectedDocs.length; i < len; i++) {
                if (selectedDocs[i].id === docId) {
                    indexDoc = i;
                    break;
                }
            }

            if (keyCode === UP) {
                docInput.value = +docInput.value + 1;

                if (selectedDocs[indexDoc]) {
                    selectedDocs[indexDoc].count = docInput.value;
                }
            }
            else if (keyCode === DOWN) {
                if (+docInput.value > 0) {
                    docInput.value = +docInput.value - 1;

                    if (selectedDocs[indexDoc]) {
                        selectedDocs[indexDoc].count = docInput.value;
                    }
                }
            }
        }
    }

})();