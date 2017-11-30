function _iterChildren(el, callback) {
	for (const child of el.childNodes) {
		if (callback(child) === false) {
			return false
		}
		if (_iterChildren(child, callback) === false) {
			return false
		}
	}
}

function copyURL(target) {
	target.showPopover()
}

function customizeCopyURLPopover(target) {
	const doc = target.contentWindow.document
	_iterChildren(doc.documentElement, el => {
		if (el.id == 'inject-url-here') {
			el.textContent = safari.application.activeBrowserWindow.activeTab.url
			const selection = window.getSelection()
			selection.removeAllRanges()

			const range = doc.createRange()
			range.selectNodeContents(el)
			selection.addRange(range)
			return false
		}
	})
}

safari.application.addEventListener('popover', function dispatchPopover(evt) {
	switch (evt.target.identifier) {
	case 'com.uranusjr.trueurl.copyurl-popover':
		customizeCopyURLPopover(evt.target)
		break
	default:
		console.warn(`Ignoring unknown popover ${evt.target.identifier}`)
		break
	}
}, true)

safari.application.addEventListener('command', function dispatchCommand(evt) {
	switch (evt.command) {
	case 'com.uranusjr.trueurl.copyurl':
		copyURL(evt.target)
		break
	default:
		console.warn(`Ignoring unknown command ${evt.command}`)
		break
	}
}, false)
