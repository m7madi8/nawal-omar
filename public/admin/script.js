/* Legacy admin entry — use /admin with server session authentication. */
(function () {
  var target = '/admin';
  if (!/\/admin\/?$/i.test(location.pathname)) {
    location.replace(target);
  }
})();
