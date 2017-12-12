/**
 * Created by Romain on 19/06/2017.
 */

let kp = KeyPressed({triggerOnce: false}),
    move = {},
    moveDoc = document.getElementById("move");


kp.setOptions({triggerOnce: true}).on('global', (e) => {
    console.log("Global :", e);
    if (e.type === "keydown") {
        let doc = null;
        switch (e.keyCode) {
            case 38:
                document.getElementById("key38").classList.add('pressed');
                doc = document.querySelector("key38");
                move['38'] = window.setInterval(() => {
                    let top = moveDoc.style.top;
                    if (!top) {
                        moveDoc.style.top = '-1px';
                    } else {
                        moveDoc.style.top = Number(top.replace(/px/g, "")) - 1 + "px";
                    }
                });
                break;
            case 40:
                document.getElementById("key40").classList.add('pressed');
                move['40'] = window.setInterval(() => {
                    let top = moveDoc.style.top;
                    if (!top) {
                        moveDoc.style.top = '1px';
                    } else {
                        moveDoc.style.top = Number(top.replace(/px/g, "")) + 1 + "px";
                    }
                });
                break;
            case 37:
                document.getElementById("key37").classList.add('pressed');
                move['37'] = window.setInterval(() => {
                    let left = moveDoc.style.left;
                    if (!left) {
                        moveDoc.style.left = '-1px';
                    } else {
                        moveDoc.style.left = Number(left.replace(/px/g, "")) - 1 + "px";
                    }
                });
                break;
            case 39:
                document.getElementById("key39").classList.add('pressed');
                move['39'] = window.setInterval(() => {
                    let left = moveDoc.style.left;
                    if (!left) {
                        moveDoc.style.left = '1px';
                    } else {
                        moveDoc.style.left = Number(left.replace(/px/g, "")) + 1 + "px";
                    }
                });
                break;
        }
    } else {
        switch (e.keyCode) {
            case 38:
                document.getElementById("key38").classList.remove('pressed');
                window.clearInterval(move['38']);
                break;
            case 40:
                document.getElementById("key40").classList.remove('pressed');
                window.clearInterval(move['40']);
                break;
            case 39:
                document.getElementById("key39").classList.remove('pressed');
                window.clearInterval(move['39']);
                break;
            case 37:
                document.getElementById("key37").classList.remove('pressed');
                window.clearInterval(move['37']);
                break;
        }
    }

});