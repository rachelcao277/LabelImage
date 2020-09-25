(function () {
    document.onkeydown = function (e) {
        if (e.key == 'z' && e.ctrlKey) {
            if (annotate.historyIndex > 0) {
                annotate.historyIndex--;
                annotate.RenderHistoryState(annotate.historyIndex);
            }
        } else if (e.key == 'y' && e.ctrlKey) {
            if (annotate.historyIndex < annotate.Nodes.historyGroup.children.length-1) {
                annotate.historyIndex++;
                annotate.RenderHistoryState(annotate.historyIndex);
            }
        }
    }
})()