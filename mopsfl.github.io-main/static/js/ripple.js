//Written by Aaron Längert
var ripple = function() {
    function rippleStart(e) {
        rippleContainer = getRippleContainer(e.target), ('0' == rippleContainer.getAttribute('animating') || !rippleContainer.hasAttribute('animating')) && e.target.className.indexOf('ripple') > -1 && (rippleContainer.setAttribute('animating', '1'), offsetX = 'number' == typeof e.offsetX ? e.offsetX : e.touches[0].clientX - e.target.getBoundingClientRect().left, offsetY = 'number' == typeof e.offsetY ? e.offsetY : e.touches[0].clientY - e.target.getBoundingClientRect().top, fullCoverRadius = Math.max(Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)), Math.sqrt(Math.pow(e.target.clientWidth - offsetX, 2) + Math.pow(e.target.clientHeight - offsetY, 2)), Math.sqrt(Math.pow(offsetX, 2) + Math.pow(e.target.clientHeight - offsetY, 2)), Math.sqrt(Math.pow(offsetY, 2) + Math.pow(e.target.clientWidth - offsetX, 2))), expandTime = e.target.getAttribute('ripple-press-expand-time') || 3, rippleContainer.style.transition = 'transform ' + expandTime + 's ease-out, box-shadow 0.1s linear', rippleContainer.style.background = e.target.getAttribute('ripple-color') || 'white', rippleContainer.style.opacity = e.target.getAttribute('ripple-opacity') || '0.6', rippleContainer.style.boxShadow = e.target.getAttribute('ripple-shadow') || 'none', rippleContainer.style.top = offsetY + 'px', rippleContainer.style.left = offsetX + 'px', rippleContainer.style.transform = 'translate(-50%, -50%) scale(' + fullCoverRadius / 100 + ')');
    }

    function rippleEnd(e) {
        rippleContainer = getRippleContainer(e.target), '1' == rippleContainer.getAttribute('animating') && (rippleContainer.setAttribute('animating', '2'), background = window.getComputedStyle(rippleContainer, null).getPropertyValue('background'), destinationRadius = e.target.clientWidth + e.target.clientHeight, rippleContainer.style.transition = 'none', expandTime = e.target.getAttribute('ripple-release-expand-time') || 0.4, rippleContainer.style.transition = 'transform ' + expandTime + 's linear, background ' + expandTime + 's linear, opacity ' + expandTime + 's ease-in-out', rippleContainer.style.transform = 'translate(-50%, -50%) scale(' + destinationRadius / 100 + ')', rippleContainer.style.background = 'radial-gradient(transparent 10%, ' + background + ' 40%)', rippleContainer.style.opacity = '0', e.target.dispatchEvent(new CustomEvent('ripple-button-click', { target: e.target })), eval(e.target.getAttribute('onrippleclick')));
    }

    function rippleRetrieve(e) {
        rippleContainer = getRippleContainer(e.target), 'translate(-50%, -50%) scale(0)' == rippleContainer.style.transform && rippleContainer.setAttribute('animating', '0'), '1' == rippleContainer.getAttribute('animating') && (rippleContainer.setAttribute('animating', '3'), collapseTime = e.target.getAttribute('ripple-leave-collapse-time') || 0.4, rippleContainer.style.transition = 'transform ' + collapseTime + 's linear, box-shadow ' + collapseTime + 's linear', rippleContainer.style.boxShadow = 'none', rippleContainer.style.transform = 'translate(-50%, -50%) scale(0)');
    }

    function getRippleContainer(e) {
        for (childs = e.childNodes, ii = 0; ii < childs.length; ii++)
            try {
                if (childs[ii].className.indexOf('rippleContainer') > -1)
                    return childs[ii];
            } catch (t) {}
        return e;
    }
    window.addEventListener('load', function() {
        css = document.createElement('style'), css.type = 'text/css', css.innerHTML = '.ripple { overflow: hidden !important; position: relative; } .ripple .rippleContainer { display: block; height: 200px !important; width: 200px !important; padding: 0px 0px 0px 0px; border-radius: 50%; position: absolute !important; top: 0px; left: 0px; transform: translate(-50%, -50%) scale(0); -webkit-transform: translate(-50%, -50%) scale(0); -ms-transform: translate(-50%, -50%) scale(0); background-color: transparent; }  .ripple * {pointer-events: none !important;}', document.head.appendChild(css), ripple.registerRipples();
    });
    var ripple = {
        registerRipples: function() {
            for (rippleButtons = document.getElementsByClassName('ripple'), i = 0; i < rippleButtons.length; i++)
                rippleButtons[i].addEventListener('touchstart', function(e) {
                    rippleStart(e);
                }, { passive: !0 }), rippleButtons[i].addEventListener('touchmove', function(e) {
                    if (e.target.hasAttribute('ripple-cancel-on-move'))
                        return void rippleRetrieve(e);
                    try {
                        overEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY).className.indexOf('ripple') >= 0;
                    } catch (t) {
                        overEl = !1;
                    }
                    overEl || rippleRetrieve(e);
                }, { passive: !0 }), rippleButtons[i].addEventListener('touchend', function(e) {
                    rippleEnd(e);
                }, { passive: !0 }), rippleButtons[i].addEventListener('mousedown', function(e) {
                    rippleStart(e);
                }, { passive: !0 }), rippleButtons[i].addEventListener('mouseup', function(e) {
                    rippleEnd(e);
                }, { passive: !0 }), rippleButtons[i].addEventListener('mousemove', function(e) {
                    !e.target.hasAttribute('ripple-cancel-on-move') || 0 == e.movementX && 0 == e.movementY || rippleRetrieve(e);
                }, { passive: !0 }), rippleButtons[i].addEventListener('mouseleave', function(e) {
                    rippleRetrieve(e);
                }, { passive: !0 }), rippleButtons[i].addEventListener('transitionend', function(e) {
                    ('2' == e.target.getAttribute('animating') || '3' == e.target.getAttribute('animating')) && (e.target.style.transition = 'none', e.target.style.transform = 'translate(-50%, -50%) scale(0)', e.target.style.boxShadow = 'none', e.target.setAttribute('animating', '0'));
                }, { passive: !0 }), getRippleContainer(rippleButtons[i]) == rippleButtons[i] && (rippleButtons[i].innerHTML += '<div class="rippleContainer"></div>');
        },
        ripple: function(t) {
            t.className.indexOf('ripple') < 0 || (rect = t.getBoundingClientRect(), e = {
                target: t,
                offsetX: rect.width / 2,
                offsetY: rect.height / 2
            }, rippleStart(e), rippleEnd(e));
        }
    };
    return ripple;
}();
