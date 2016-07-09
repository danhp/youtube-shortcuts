chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  var newIndex, linkUrl;
  switch (request.requestType) {
    case 'openLinkNewTab':
      newIndex = sender.tab.index + 1;
      chrome.tabs.create({url: 'https://www.youtube.com' + request.linkUrl,
                          selected: true,
                          index: newIndex,
                          openerTabId: sender.tab.id});

    default:
      break;
  }
});
